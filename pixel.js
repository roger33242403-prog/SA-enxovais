/* ============================================================
   SA Enxovais — Meta Pixel
   Substitua SEU_PIXEL_ID pelo seu ID real quando criar
   a conta no Meta Business Manager.
   ============================================================ */

const PIXEL_ID = 'SEU_PIXEL_ID';

// Injeta o snippet base do Meta Pixel no <head>
(function () {
  if (typeof fbq !== 'undefined') return; // evita duplicata

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
})();

// ── Funções públicas ──────────────────────────────────────────

/**
 * Dispara PageView.
 * Chame em: index.html e obrigado.html — dentro de <script> no fim do <body>
 *   trackPageView();
 */
function trackPageView() {
  if (typeof fbq === 'undefined') return;
  fbq('track', 'PageView');
  console.log('[Pixel] PageView disparado');
}

/**
 * Dispara ViewContent com o nome do produto.
 * Chame em: js/produtos.js — quando os cards de produto são renderizados
 *   trackViewContent(produto.nome);
 */
function trackViewContent(nomeProduto) {
  if (typeof fbq === 'undefined') return;
  fbq('track', 'ViewContent', {
    content_name: nomeProduto,
    content_type: 'product'
  });
  console.log('[Pixel] ViewContent disparado —', nomeProduto);
}

/**
 * Dispara Lead quando o cliente clica em "Pedir agora".
 * Chame em: js/pedido.js — no evento de clique do botão "Pedir agora"
 *   trackLead(nomeProduto);
 */
function trackLead(nomeProduto) {
  if (typeof fbq === 'undefined') return;
  fbq('track', 'Lead', {
    content_name: nomeProduto
  });
  console.log('[Pixel] Lead disparado —', nomeProduto);
}

/**
 * Dispara Purchase quando o comprovante é enviado.
 * Chame em: obrigado.html — no clique do botão "Enviar comprovante" (com imagem anexada)
 *   trackPurchase();
 */
function trackPurchase() {
  if (typeof fbq === 'undefined') return;
  fbq('track', 'Purchase', {
    currency: 'BRL',
    value: 0  // valor pode ser atualizado dinamicamente se necessário
  });
  console.log('[Pixel] Purchase disparado');
}
