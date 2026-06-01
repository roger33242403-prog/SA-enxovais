const https = require('https');

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ erro: 'Método não permitido' }) };
  }

  try {
    const dados = JSON.parse(event.body);
    const { nome, telefone, itens, total, tipo, metodo } = dados;

    const itensMp = itens.map(item => ({
      id: String(item.id),
      title: item.nome,
      quantity: item.qtd,
      unit_price: item.preco,
      currency_id: 'BRL'
    }));

    const baseUrl = 'https://roger33242403-prog.github.io/SA-enxovais';

    let paymentMethods;
    if(metodo === 'pix'){
      paymentMethods = {
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }],
        installments: 1
      };
    } else if(metodo === 'pix_parcelado'){
      paymentMethods = {
        excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }],
        installments: 12
      };
    } else {
      paymentMethods = {
        excluded_payment_types: [{ id: 'account_money' }, { id: 'ticket' }],
        installments: 12
      };
    }

    const preferencia = {
      items: itensMp,
      payer: {
        name: nome,
        phone: { number: telefone.replace(/[^0-9]/g, '') }
      },
      payment_methods: paymentMethods,
      back_urls: {
        success: baseUrl + '/obrigado.html?tipo=' + tipo + '&status=aprovado',
        failure: baseUrl + '/obrigado.html?tipo=' + tipo + '&status=erro',
        pending: baseUrl + '/obrigado.html?tipo=' + tipo + '&status=pendente'
      },
      auto_return: 'approved',
      statement_descriptor: 'SA ENXOVAIS',
      external_reference: Date.now().toString()
    };

    const resposta = await chamarMercadoPago(preferencia);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: resposta.init_point, id: resposta.id })
    };

  } catch (erro) {
    console.error('Erro:', erro);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ erro: 'Erro ao criar pagamento: ' + erro.message })
    };
  }
};

function chamarMercadoPago(preferencia) {
  return new Promise((resolve, reject) => {
    const corpo = JSON.stringify(preferencia);
    const token = process.env.MP_ACCESS_TOKEN;

    const opcoes = {
      hostname: 'api.mercadopago.com',
      path: '/checkout/preferences',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(corpo)
      }
    };

    const req = https.request(opcoes, (res) => {
      let dados = '';
      res.on('data', chunk => dados += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(dados);
          if (res.statusCode === 201) {
            resolve(json);
          } else {
            reject(new Error('MP retornou ' + res.statusCode + ': ' + dados));
          }
        } catch (e) {
          reject(new Error('Erro ao parsear resposta: ' + dados));
        }
      });
    });

    req.on('error', reject);
    req.write(corpo);
    req.end();
  });
}
