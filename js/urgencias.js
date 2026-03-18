// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — urgencias.js  v1.0
//  Bolsa de urgencias: filtros, cards, modal, ticker
// ═══════════════════════════════════════════════════════════════

var filtroDispUrg = 'todos';
var filtroCatUrg  = '';
var filtroTextoUrg = '';
var targetUrgId    = null;

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  if (!initPage('empresa')) return;
  marcarNavActivo();
  iniciarTicker();
  calcularContadores();
  aplicarFiltrosUrg();
  renderPacksUrgModal();
  actualizarSidebarUrg();
  verificarSemaforo();

  // Buscador en tiempo real
  var inp = document.getElementById('urg-search');
  if (inp) {
    inp.addEventListener('input', function() {
      clearTimeout(inp._t);
      inp._t = setTimeout(function() { aplicarFiltrosUrg(); }, 300);
    });
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') aplicarFiltrosUrg();
    });
  }
});

// ── OBTENER URGENTES ──────────────────────────────────────────
function getUrgentes() {
  return TRABAJADORES.filter(function(t) {
    return t.urgente === true && t.estado !== 'no_disponible';
  });
}

// ── CALCULAR CONTADORES SIDEBAR ───────────────────────────────
function calcularContadores() {
  var urgentes = getUrgentes();
  var hoy = urgentes.filter(function(t) { return t.disponibleDesde === 'Hoy'; });

  setTxtUrg('total-urgentes', urgentes.length);
  setTxtUrg('total-hoy',      hoy.length);
  setTxtUrg('cnt-todas',      urgentes.length);

  var cats = {
    'Obra Gruesa':           'cnt-og',
    'Acabados':              'cnt-ac',
    'Instalaciones':         'cnt-in',
    'Maquinaria y Transporte': 'cnt-mq',
    'Técnicos y Gestión':    'cnt-tg',
    'Auxiliares':            'cnt-aux',
  };
  Object.keys(cats).forEach(function(cat) {
    var n = urgentes.filter(function(t) { return t.categoria === cat; }).length;
    setTxtUrg(cats[cat], n);
  });
}

// ── FILTROS ───────────────────────────────────────────────────
function filtrarDisp(el, val) {
  filtroDispUrg = val;
  document.querySelectorAll('.urg-fil-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
  aplicarFiltrosUrg();
}

function filtrarCatUrg(el, cat) {
  filtroCatUrg = cat;
  document.querySelectorAll('#urg-cat-list .cat-item').forEach(function(i) { i.classList.remove('active'); });
  el.classList.add('active');
  aplicarFiltrosUrg();
}

function aplicarFiltrosUrg() {
  filtroTextoUrg = ((document.getElementById('urg-search') || {}).value || '').toLowerCase().trim();
  var sort = ((document.getElementById('urg-sort') || {}).value) || 'hoy';

  var lista = getUrgentes().filter(function(t) {
    var matchDisp = filtroDispUrg === 'todos' || t.disponibleDesde === filtroDispUrg;
    var matchCat  = !filtroCatUrg || t.categoria === filtroCatUrg;
    var matchTxt  = !filtroTextoUrg
      || t.nombre.toLowerCase().includes(filtroTextoUrg)
      || t.oficio.toLowerCase().includes(filtroTextoUrg)
      || t.zona.toLowerCase().includes(filtroTextoUrg)
      || t.habilidades.some(function(h) { return h.toLowerCase().includes(filtroTextoUrg); });
    return matchDisp && matchCat && matchTxt;
  });

  // Ordenar
  var orden = { 'Hoy': 0, 'Mañana': 1, 'Esta semana': 2 };
  if (sort === 'hoy') {
    lista.sort(function(a, b) {
      return (orden[a.disponibleDesde] || 9) - (orden[b.disponibleDesde] || 9);
    });
  } else if (sort === 'rating') {
    lista.sort(function(a, b) { return b.rating - a.rating; });
  } else if (sort === 'exp') {
    lista.sort(function(a, b) { return b.exp - a.exp; });
  }

  var titulo = filtroCatUrg
    ? '⚡ ' + filtroCatUrg + ' urgentes'
    : filtroDispUrg !== 'todos'
    ? '⚡ Disponibles ' + filtroDispUrg.toLowerCase()
    : '⚡ Disponibles para entrar hoy o esta semana';

  setTxtUrg('urg-results-title', titulo);
  setTxtUrg('urg-results-count', lista.length + ' perfil' + (lista.length !== 1 ? 'es' : '') + ' urgente' + (lista.length !== 1 ? 's' : ''));

  renderCardsUrg(lista);
}

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCardsUrg(lista) {
  var container = document.getElementById('urgencias-container');
  if (!container) return;

  if (!lista.length) {
    container.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1">'
      + '<div class="empty-icon">🔍</div>'
      + '<div class="empty-title">Sin resultados urgentes</div>'
      + '<div class="empty-sub">Prueba con otro filtro o busca en el <a href="feed.html">feed general</a></div>'
      + '</div>';
    return;
  }

  container.innerHTML = '';
  lista.forEach(function(t, i) {
    var card = crearCardUrgente(t);
    card.style.animationDelay = (i * 0.07) + 's';
    container.appendChild(card);
  });
}

function crearCardUrgente(t) {
  var revelado  = estaRevelado(t.id);
  var sinCred   = getCreditos() <= 0;
  var dispColor = t.disponibleDesde === 'Hoy'
    ? 'urg-hoy' : t.disponibleDesde === 'Mañana'
    ? 'urg-manana' : 'urg-semana';

  var chips = t.habilidades.slice(0, 3).map(function(h) {
    return '<span class="chip">' + h + '</span>';
  }).join('') + (t.habilidades.length > 3
    ? '<span class="chip chip-more">+' + (t.habilidades.length - 3) + '</span>' : '');

  var card = document.createElement('article');
  card.className = 'urg-card fade-in' + (revelado ? ' urg-card-revelada' : '');
  card.id = 'urg-card-' + t.id;

  card.innerHTML =
    // Franja de urgencia
    '<div class="urg-card-franja ' + dispColor + '">'
    + '<span class="urg-franja-ico">' + (t.disponibleDesde === 'Hoy' ? '🔴' : t.disponibleDesde === 'Mañana' ? '🟡' : '🟢') + '</span>'
    + '<span class="urg-franja-txt">Disponible: <strong>' + (t.disponibleDesde || 'Esta semana') + '</strong></span>'
    + '<span class="urg-badge-urgente">⚡ URGENTE</span>'
    + '</div>'

    + '<div class="urg-card-body">'

    // Head
    + '<div class="card-head">'
    +   '<div class="avatar-wrap">'
    +     '<div class="avatar" style="background:' + t.color + '20;border-color:' + t.color + '">'
    +       '<span class="avatar-emoji">' + t.emoji + '</span>'
    +     '</div>'
    +     '<span class="badge-estado badge-disponible" style="font-size:.65rem;white-space:nowrap">● Disponible</span>'
    +   '</div>'
    +   '<div class="card-identity">'
    +     '<h3 class="worker-name">' + t.nombre + '</h3>'
    +     '<p class="worker-oficio">🔧 ' + t.oficio + '</p>'
    +     '<div class="worker-stars">' + renderEstrellas(t.rating)
    +       ' <span class="rating-num">' + (t.rating > 0 ? t.rating + '.0' : 'Nuevo') + '</span>'
    +       ' <span class="rating-count">(' + t.reseñas_count + ' reseñas)</span>'
    +     '</div>'
    +   '</div>'
    +   '<a href="perfil.html?id=' + t.id + '" class="btn-ver-perfil" title="Ver perfil">👤</a>'
    + '</div>'

    // Meta
    + '<div class="card-meta-grid">'
    +   '<div class="meta-item"><span>📍</span> ' + t.zona + '</div>'
    +   '<div class="meta-item"><span>📅</span> ' + t.exp + ' años</div>'
    +   '<div class="meta-item"><span>📁</span> ' + t.categoria + '</div>'
    +   '<div class="meta-item"><span>✅</span> Verificado</div>'
    + '</div>'

    // Chips
    + '<div class="card-chips">' + chips + '</div>'

    // Contacto revelado
    + '<div class="contact-box" id="urg-contact-' + t.id + '" style="display:' + (revelado ? 'flex' : 'none') + '">'
    +   '<span class="contact-icon">💬</span>'
    +   '<div class="contact-info">'
    +     '<span class="contact-label">WhatsApp Verificado</span>'
    +     '<span class="contact-num">' + t.whatsapp_display + '</span>'
    +   '</div>'
    +   '<a href="https://wa.me/' + t.whatsapp + '?text=' + encodeURIComponent('Hola ' + t.nombre + ', te contacto desde Construlinker ⚡ para una incorporación urgente.') + '"'
    +      ' target="_blank" class="btn-wsp">📲 Chatear</a>'
    + '</div>'

    // Acción principal
    + '<div class="urg-card-footer">'
    + (revelado
      ? '<button class="btn-accion btn-accion-done" disabled style="width:100%">✅ Contacto desbloqueado</button>'
      : sinCred
      ? '<button class="btn-accion btn-accion-blocked" style="width:100%" onclick="abrirModalCompraUrg()">⚠️ Sin créditos · Recargar</button>'
      : '<button class="btn-urg-contacto" onclick="pedirContactoUrg(' + t.id + ')">'
        + '<span>⚡ Ver Contacto Urgente</span>'
        + '<span class="accion-tag">🪙 1 crédito</span>'
        + '</button>'
    )
    + '<a href="perfil.html?id=' + t.id + '" class="btn-perfil-link">Ver perfil completo →</a>'
    + '</div>'

    + '</div>'; // urg-card-body

  return card;
}

// ── MODAL CONTACTO URGENTE ────────────────────────────────────
function pedirContactoUrg(id) {
  if (getCreditos() <= 0) {
    mostrarToast('⛔ Sin créditos. Este candidato urgente no puede esperar — recarga ahora.', 'rojo');
    abrirModalCompraUrg();
    return;
  }
  if (estaRevelado(id)) return;

  var t = TRABAJADORES.find(function(x) { return x.id === id; });
  if (!t) return;
  targetUrgId = id;

  setTxtUrg('murg-nombre', t.nombre);
  setTxtUrg('murg-oficio', t.oficio);
  setTxtUrg('murg-saldo',  getCreditos());
  setTxtUrg('murg-saldo-post', getCreditos() - 1);

  var dispEl = document.getElementById('murg-disp');
  if (dispEl) {
    var cls = t.disponibleDesde === 'Hoy' ? 'urg-hoy' : t.disponibleDesde === 'Mañana' ? 'urg-manana' : 'urg-semana';
    dispEl.className = 'urg-disp-badge ' + cls;
    dispEl.textContent = '⏱ Disponible: ' + (t.disponibleDesde || 'Esta semana');
  }

  var overlay = document.getElementById('modal-urg-overlay');
  overlay.style.display = 'flex';
  setTimeout(function() { overlay.classList.add('open'); }, 10);
}

function cerrarModalUrg() {
  var overlay = document.getElementById('modal-urg-overlay');
  overlay.classList.remove('open');
  setTimeout(function() { overlay.style.display = 'none'; }, 250);
  targetUrgId = null;
}

function confirmarContactoUrg() {
  if (targetUrgId === null) return;
  var id = targetUrgId;
  cerrarModalUrg();

  var ok = gastarCredito(id, ACCIONES.VER_CONTACTO);
  if (!ok) { mostrarToast('❌ Sin créditos suficientes.', 'rojo'); return; }

  sincronizarWallet();
  actualizarSidebarUrg();

  var t = TRABAJADORES.find(function(x) { return x.id === id; });

  // Mostrar contacto en card
  var box = document.getElementById('urg-contact-' + id);
  if (box) { box.style.display = 'flex'; box.classList.add('reveal-anim'); }

  // Actualizar botón
  var card = document.getElementById('urg-card-' + id);
  if (card) {
    card.classList.add('urg-card-revelada');
    var footer = card.querySelector('.urg-card-footer');
    if (footer) {
      footer.innerHTML =
        '<button class="btn-accion btn-accion-done" disabled style="width:100%">✅ Contacto desbloqueado</button>'
        + '<a href="perfil.html?id=' + t.id + '" class="btn-perfil-link">Ver perfil completo →</a>';
    }
  }

  // Mensaje urgente del PDF
  mostrarToast('⚡ Contacto de ' + t.nombre + ' desbloqueado. ¡Escríbele ahora! Saldo: ' + getCreditos(), 'verde');
  verificarSemaforo();
}

// ── MODAL COMPRA ──────────────────────────────────────────────
function abrirModalCompraUrg() {
  var el = document.getElementById('modal-compra-urg');
  if (!el) return;
  el.style.display = 'flex';
  setTimeout(function() { el.classList.add('open'); }, 10);
}

function cerrarModalCompraUrg() {
  var el = document.getElementById('modal-compra-urg');
  if (!el) return;
  el.classList.remove('open');
  setTimeout(function() { el.style.display = 'none'; }, 250);
}

function comprarPaqueteUrg(cantidad, precio) {
  cerrarModalCompraUrg();
  agregarCreditos(cantidad);
  sincronizarWallet();
  actualizarSidebarUrg();
  mostrarToast('🎉 ¡' + cantidad + ' créditos añadidos! Saldo: ' + getCreditos(), 'verde');
  setTimeout(function() { aplicarFiltrosUrg(); }, 300);
}

function renderPacksUrgModal() {
  var container = document.getElementById('packs-urg-container');
  if (!container) return;
  container.innerHTML = PACKS_CREDITOS.map(function(p) {
    return '<div class="paquete-card ' + (p.popular ? 'popular' : '') + '" style="position:relative;margin-top:' + (p.popular ? '14px' : '0') + '">'
      + (p.popular ? '<div class="popular-badge">⭐ Más popular</div>' : '')
      + '<div style="font-size:26px;margin-bottom:4px">' + p.emoji + '</div>'
      + '<div class="paquete-cred">' + p.creditos + '</div>'
      + '<div class="paquete-label">crédito' + (p.creditos > 1 ? 's' : '') + '</div>'
      + '<div class="paquete-precio">' + p.moneda + ' ' + p.precio + '</div>'
      + '<button onclick="comprarPaqueteUrg(' + p.creditos + ',' + p.precio + ')" '
      +   'class="' + (p.popular ? 'btn-primary' : 'btn-dark') + '" '
      +   'style="width:100%;padding:9px;font-size:.85rem;justify-content:center;margin-top:6px">'
      +   'Comprar</button>'
      + '</div>';
  }).join('');
}

// ── TICKER ────────────────────────────────────────────────────
function iniciarTicker() {
  var urgentes = getUrgentes().filter(function(t) { return t.disponibleDesde === 'Hoy'; });
  var ticker = document.getElementById('urgencias-ticker');
  if (!ticker || !urgentes.length) return;

  var idx = 0;
  function mostrarSiguiente() {
    var t = urgentes[idx % urgentes.length];
    ticker.innerHTML =
      '<div class="ticker-item">'
      + '<span class="ticker-emoji">' + t.emoji + '</span>'
      + '<div>'
      +   '<div class="ticker-nombre">' + t.nombre + '</div>'
      +   '<div class="ticker-oficio">' + t.oficio + ' · ' + t.zona + '</div>'
      + '</div>'
      + '<span class="ticker-now">🔴 HOY</span>'
      + '</div>';
    idx++;
  }
  mostrarSiguiente();
  setInterval(mostrarSiguiente, 3500);
}

// ── SIDEBAR ───────────────────────────────────────────────────
function actualizarSidebarUrg() {
  var n = getCreditos();
  var wn = document.getElementById('wallet-urg-num');
  var wp = document.getElementById('wallet-urg-prog');
  if (wn) wn.textContent = n;
  if (wp) wp.style.width = Math.min(100, (n / 50) * 100) + '%';
}

// ── HELPERS ──────────────────────────────────────────────────
function setTxtUrg(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}