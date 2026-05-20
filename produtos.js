/* ============================================================
   SA Enxovais — Produtos
   Adicione, edite ou remova produtos diretamente neste array.
   ============================================================ */

const PRODUTOS = [
  {
    id: 1,
    nome: 'Jogo de Cama Queen 7 Peças',
    descricao: 'Percal 200 fios, 100% algodão. Inclui: lençol de cima, lençol de baixo com elástico, 4 fronhas e capa de edredom.',
    preco: 189.90,
    foto: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    disponivel: true
  },
  {
    id: 2,
    nome: 'Jogo de Toalhas de Banho 5 Peças',
    descricao: 'Felpudo premium, 100% algodão. Inclui: 2 toalhas de banho, 2 toalhas de rosto e 1 toalha de piso.',
    preco: 124.90,
    foto: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=600&q=80',
    disponivel: true
  },
  {
    id: 3,
    nome: 'Edredom Casal Matelassê',
    descricao: 'Microfibra acetinada com enchimento de pluma sintética. Design elegante que combina com qualquer decoração.',
    preco: 159.90,
    foto: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
    disponivel: true
  }
];

// ── Renderização ──────────────────────────────────────────────

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarProdutos() {
  const container = document.getElementById('produtos-grid');
  if (!container) return;

  const produtosAtivos = PRODUTOS.filter(p => p.disponivel);

  if (produtosAtivos.length === 0) {
    container.innerHTML = `
      <div class="sem-produtos">
        <p>Nenhum produto disponível no momento. Fale conosco pelo WhatsApp!</p>
      </div>`;
    return;
  }

  container.innerHTML = produtosAtivos.map(produto => `
    <div class="card-produto" data-produto-id="${produto.id}">
      <div class="card-foto">
        <img src="${produto.foto}" alt="${produto.nome}" loading="lazy" />
      </div>
      <div class="card-info">
        <h3 class="card-nome">${produto.nome}</h3>
        <p class="card-descricao">${produto.descricao}</p>
        <div class="card-rodape">
          <span class="card-preco">${formatarPreco(produto.preco)}</span>
          <button
            class="btn-pedir"
            onclick="abrirModal(${produto.id})"
          >
            Pedir agora
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Dispara ViewContent para cada produto visível
  if (typeof trackViewContent === 'function') {
    produtosAtivos.forEach(p => trackViewContent(p.nome));
  }
}

// ── Utilitário: buscar produto por ID ─────────────────────────
function getProdutoPorId(id) {
  return PRODUTOS.find(p => p.id === Number(id)) || null;
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', renderizarProdutos);
