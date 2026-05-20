/* ============================================================
   SA Enxovais — Pedido
   Modal de pedido + envio via WhatsApp
   ============================================================ */

const WHATSAPP_NUMERO = '5537998217693';

// ── Abrir modal ───────────────────────────────────────────────

function abrirModal(produtoId) {
  const produto = getProdutoPorId(produtoId);
  if (!produto) return;

  // Dispara Lead no Pixel
  if (typeof trackLead === 'function') trackLead(produto.nome);

  // Preenche o nome do produto no formulário
  document.getElementById('modal-nome-produto').textContent = produto.nome;
  document.getElementById('campo-produto').value = produto.nome;

  document.getElementById('modal-pedido').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}

function fecharModal() {
  document.getElementById('modal-pedido').classList.remove('aberto');
  document.body.style.overflow = '';
  document.getElementById('form-pedido').reset();
  limparErros();
}

// Fecha ao clicar fora do modal
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modal-pedido');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) fecharModal();
    });
  }

  const form = document.getElementById('form-pedido');
  if (form) form.addEventListener('submit', enviarPedido);
});

// ── Validação ─────────────────────────────────────────────────

function limparErros() {
  document.querySelectorAll('.campo-erro').forEach(el => el.textContent = '');
}

function mostrarErro(campoId, mensagem) {
  const el = document.getElementById(`erro-${campoId}`);
  if (el) el.textContent = mensagem;
}

function validarForm() {
  limparErros();
  let valido = true;

  const campos = ['nome', 'telefone', 'endereco', 'quantidade', 'pagamento'];
  const labels = {
    nome: 'Nome',
    telefone: 'Telefone',
    endereco: 'Endereço',
    quantidade: 'Quantidade',
    pagamento: 'Pagamento'
  };

  campos.forEach(campo => {
    const el = document.getElementById(`campo-${campo}`);
    if (el && !el.value.trim()) {
      mostrarErro(campo, `${labels[campo]} é obrigatório.`);
      valido = false;
    }
  });

  const qtd = parseInt(document.getElementById('campo-quantidade')?.value);
  if (qtd < 1 || isNaN(qtd)) {
    mostrarErro('quantidade', 'Informe uma quantidade válida.');
    valido = false;
  }

  return valido;
}

// ── Enviar pedido ─────────────────────────────────────────────

function enviarPedido(e) {
  e.preventDefault();
  if (!validarForm()) return;

  const nome      = document.getElementById('campo-nome').value.trim();
  const telefone  = document.getElementById('campo-telefone').value.trim();
  const endereco  = document.getElementById('campo-endereco').value.trim();
  const produto   = document.getElementById('campo-produto').value.trim();
  const quantidade = document.getElementById('campo-quantidade').value.trim();
  const pagamento = document.getElementById('campo-pagamento').value;
  const obs       = document.getElementById('campo-obs').value.trim();

  const pagamentoLabel = pagamento === 'fiado'
    ? 'Fiado (até R$ 150,00)'
    : 'Metade à vista (libera até R$ 400,00)';

  let mensagem =
    `🛍️ *Novo Pedido - SA Enxovais!*\n\n` +
    `👤 *Nome:* ${nome}\n` +
    `📱 *Telefone:* ${telefone}\n` +
    `📍 *Endereço:* ${endereco}\n` +
    `📦 *Produto:* ${produto} (${quantidade} unid.)\n` +
    `💰 *Pagamento:* ${pagamentoLabel}\n`;

  if (obs) mensagem += `📝 *Observações:* ${obs}\n`;

  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;

  // Abre o WhatsApp e redireciona para a página de obrigado
  window.open(url, '_blank');

  setTimeout(() => {
    window.location.href = 'obrigado.html';
  }, 800);
}
