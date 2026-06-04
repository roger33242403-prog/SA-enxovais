const functions = require("firebase-functions");
const https = require("https");

exports.criarPagamento = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(200).send(""); return; }
  if (req.method !== "POST") { res.status(405).json({ erro: "Metodo nao permitido" }); return; }

  const { nome, telefone, itens, tipo, metodo } = req.body;

  const itensMp = itens.map((item) => ({
    id: String(item.id),
    title: item.nome,
    quantity: item.qtd,
    unit_price: item.preco,
    currency_id: "BRL",
  }));

  const baseUrl = "https://roger33242403-prog.github.io/SA-enxovais";

  let paymentMethods;
  if (metodo === "pix") {
    paymentMethods = { excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }], installments: 1 };
  } else if (metodo === "pix_parcelado") {
    paymentMethods = { excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "ticket" }], installments: 12 };
  } else {
    paymentMethods = { excluded_payment_types: [{ id: "account_money" }, { id: "ticket" }], installments: 12 };
  }

  const preferencia = {
    items: itensMp,
    payer: { name: nome, phone: { number: telefone.replace(/[^0-9]/g, "") } },
    payment_methods: paymentMethods,
    back_urls: {
      success: baseUrl + "/obrigado.html?tipo=" + tipo + "&status=aprovado",
      failure: baseUrl + "/obrigado.html?tipo=" + tipo + "&status=erro",
      pending: baseUrl + "/obrigado.html?tipo=" + tipo + "&status=pendente",
    },
    auto_return: "approved",
    statement_descriptor: "SA ENXOVAIS",
    external_reference: Date.now().toString(),
  };

  const cfg = functions.config();
  const token = (cfg.mp && cfg.mp.access_token) ? cfg.mp.access_token : process.env.MP_ACCESS_TOKEN;
  const corpo = JSON.stringify(preferencia);

  const opcoes = {
    hostname: "api.mercadopago.com",
    path: "/checkout/preferences",
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(corpo),
    },
  };

  const req2 = https.request(opcoes, (resp) => {
    let dados = "";
    resp.on("data", (chunk) => (dados += chunk));
    resp.on("end", () => {
      const json = JSON.parse(dados);
      if (resp.statusCode === 201) {
        res.json({ url: json.init_point, id: json.id });
      } else {
        res.status(500).json({ erro: "MP erro: " + dados });
      }
    });
  });

  req2.on("error", (e) => res.status(500).json({ erro: e.message }));
  req2.write(corpo);
  req2.end();
});
