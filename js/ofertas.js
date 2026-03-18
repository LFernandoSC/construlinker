// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — ofertas.js  v1.0
//  Publicación de ofertas, postulaciones, filtros, modales
// ═══════════════════════════════════════════════════════════════

var filtroCatOf  = '';
var filtroZonaOf = '';
var filtroTextoOf = '';
var vistaActual  = 'todas';  // 'todas' | 'mis-ofertas' | 'postuladas'

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  cargarEstado();
  if (!ESTADO.autenticado) { window.location.href = 'index.html'; return; }
  if (!ESTADO.postulaciones) ESTADO.postulaciones = [];
  marcarNavActivo();
  sincronizarWallet();
  verificarSemaforo();

  adaptarUIporTipo();
  calcularContadoresOf();
  aplicarFiltrosOf();

  // Buscador en tiempo real
  var inp = document.getElementById('of-search');
  if (inp) {
    inp.addEventListener('input', function() {
      clearTimeout(inp._t);
      inp._t = setTimeout(function() { aplicarFiltrosOf(); }, 300);
    });
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') aplicarFiltrosOf();
    });
  }

  // Zona select
  var zonaS = document.getElementById('of-zona-select');
  if (zonaS) zonaS.addEventListener('change', function() { aplicarFiltrosOf(); });
});

// ── ADAPTAR UI POR TIPO DE USUARIO ───────────────────────────
function adaptarUIporTipo() {
  var esEmpresa   = ESTADO.tipoUsuario === 'empresa';
  var esTrabajador = ESTADO.tipoUsuario === 'trabajador';

  // Avatar en header
  var av = document.getElementById('header-avatar');
  if (av) av.textContent = esEmpresa ? '🏢' : '👷';

  // Hero
  var badge    = document.getElementById('hero-badge');
  var titulo   = document.getElementById('hero-titulo');
  var sub      = document.getElementById('hero-sub');
  var heroAct  = document.getElementById('hero-action');

  if (esEmpresa) {
    if (badge)   badge.textContent = '📋 BOLSA DE TRABAJO';
    if (titulo)  titulo.innerHTML  = 'Publica tu oferta<br><span>y recibe postulantes</span>';
    if (sub)     sub.textContent   = 'Crea ofertas de trabajo gratis. Los trabajadores las ven y se postulan directamente. Tú decides a quién contactar.';
    if (heroAct) heroAct.innerHTML =
      '<div class="of-hero-action-card">'
      + '<div style="font-size:36px;margin-bottom:8px">📋</div>'
      + '<div class="of-hero-action-titulo">¿Necesitas personal?</div>'
      + '<div class="of-hero-action-sub">Publica una oferta gratis en menos de 2 minutos</div>'
      + '<button class="btn-primary" style="width:100%;justify-content:center;margin-top:14px" onclick="abrirModalPublicar()">'
      + '+ Publicar Oferta Gratis</button>'
      + '</div>';
  } else {
    if (badge)   badge.textContent = '💼 OFERTAS DE TRABAJO';
    if (titulo)  titulo.innerHTML  = 'Ofertas publicadas por<br><span>empresas reales</span>';
    if (heroAct) heroAct.innerHTML =
      '<div class="of-hero-action-card">'
      + '<div style="font-size:36px;margin-bottom:8px">👷</div>'
      + '<div class="of-hero-action-titulo">Tu perfil activo</div>'
      + '<div class="of-hero-action-sub">Las empresas también pueden buscarte en el directorio de trabajadores</div>'
      + '<a href="mi-perfil.html" class="btn-dark" style="width:100%;justify-content:center;margin-top:14px;display:flex">'
      + '👤 Ver mi perfil</a>'
      + '</div>';
  }

  // Botones de vista sidebar
  var vistaBtns = document.getElementById('vista-btns');
  if (vistaBtns) {
    if (esEmpresa) {
      vistaBtns.innerHTML =
        '<button class="of-vista-btn active" data-vista="todas"      onclick="cambiarVista(this,\'todas\')">📋 Todas las ofertas</button>'
        + '<button class="of-vista-btn"       data-vista="mis-ofertas" onclick="cambiarVista(this,\'mis-ofertas\')">🏢 Mis ofertas</button>';
    } else {
      vistaBtns.innerHTML =
        '<button class="of-vista-btn active" data-vista="todas"      onclick="cambiarVista(this,\'todas\')">📋 Todas las ofertas</button>'
        + '<button class="of-vista-btn"       data-vista="postuladas"  onclick="cambiarVista(this,\'postuladas\')">✅ Mis postulaciones</button>';
    }
  }
}

// ── CAMBIAR VISTA ─────────────────────────────────────────────
function cambiarVista(el, vista) {
  vistaActual = vista;
  document.querySelectorAll('.of-vista-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
  aplicarFiltrosOf();
}

// ── CONTADORES ────────────────────────────────────────────────
function calcularContadoresOf() {
  var activas  = OFERTAS.filter(function(o) { return o.activa; });
  var urgentes = activas.filter(function(o) { return o.urgente; });
  var empresas = [...new Set(activas.map(function(o) { return o.empresaId; }))].length;
  var postul   = (ESTADO.postulaciones || []).length;

  setTxtOf('of-total',    activas.length);
  setTxtOf('of-urgentes', urgentes.length);
  setTxtOf('of-mis',      postul);
  setTxtOf('of-empresas', empresas);

  var cats = {
    'Obra Gruesa':           'of-cnt-og',
    'Acabados':              'of-cnt-ac',
    'Instalaciones':         'of-cnt-in',
    'Maquinaria y Transporte': 'of-cnt-mq',
    'Técnicos y Gestión':    'of-cnt-tg',
    'Auxiliares':            'of-cnt-aux',
  };
  setTxtOf('of-cnt-all', activas.length);
  Object.keys(cats).forEach(function(cat) {
    var n = activas.filter(function(o) { return o.categoria === cat; }).length;
    setTxtOf(cats[cat], n);
  });
}

// ── FILTROS ───────────────────────────────────────────────────
function filtrarCatOf(el, cat) {
  filtroCatOf = cat;
  document.querySelectorAll('.cat-item').forEach(function(i) { i.classList.remove('active'); });
  el.classList.add('active');
  aplicarFiltrosOf();
}

function aplicarFiltrosOf() {
  filtroTextoOf = ((document.getElementById('of-search') || {}).value || '').toLowerCase().trim();
  filtroZonaOf  = ((document.getElementById('of-zona-select') || {}).value || '').toLowerCase().trim();

  var soloUrgentes = (document.getElementById('solo-urgentes') || {}).checked;
  var sort         = ((document.getElementById('of-sort') || {}).value) || 'reciente';

  // Tipos contrato seleccionados
  var tiposChecked = [];
  document.querySelectorAll('.of-tipo-filtros input:checked').forEach(function(cb) {
    tiposChecked.push(cb.value);
  });

  var lista = OFERTAS.filter(function(o) {
    if (!o.activa) return false;

    // Vista
    if (vistaActual === 'mis-ofertas' && o.empresaId !== ESTADO.userId) return false;
    if (vistaActual === 'postuladas'  && !yaPostulado(o.id)) return false;

    var matchCat   = !filtroCatOf  || o.categoria === filtroCatOf;
    var matchZona  = !filtroZonaOf || o.zona.toLowerCase().includes(filtroZonaOf);
    var matchUrgente = !soloUrgentes || o.urgente;
    var matchTipo  = !tiposChecked.length || tiposChecked.includes(o.tipo);
    var matchTxt   = !filtroTextoOf
      || o.titulo.toLowerCase().includes(filtroTextoOf)
      || o.empresa.toLowerCase().includes(filtroTextoOf)
      || o.zona.toLowerCase().includes(filtroTextoOf)
      || o.categoria.toLowerCase().includes(filtroTextoOf)
      || (o.tags || []).some(function(tag) { return tag.toLowerCase().includes(filtroTextoOf); });

    return matchCat && matchZona && matchUrgente && matchTipo && matchTxt;
  });

  // Ordenar
  if (sort === 'urgente') {
    lista.sort(function(a, b) { return (b.urgente ? 1 : 0) - (a.urgente ? 1 : 0); });
  } else if (sort === 'postulantes') {
    lista.sort(function(a, b) { return b.postulantes - a.postulantes; });
  } else if (sort === 'salario') {
    lista.sort(function(a, b) {
      var getSalNum = function(s) {
        var m = (s || '').match(/[\d,]+/);
        return m ? parseInt(m[0].replace(',','')) : 0;
      };
      return getSalNum(b.salario) - getSalNum(a.salario);
    });
  }
  // reciente: ya están en orden de inserción (más nuevo primero)

  var tituloRes = vistaActual === 'mis-ofertas' ? 'Mis Ofertas Publicadas'
    : vistaActual === 'postuladas'              ? 'Mis Postulaciones'
    : filtroCatOf                               ? filtroCatOf
    : 'Todas las Ofertas';

  setTxtOf('of-results-title', tituloRes);
  setTxtOf('of-results-count', lista.length + ' oferta' + (lista.length !== 1 ? 's' : '') + ' encontrada' + (lista.length !== 1 ? 's' : ''));
  renderCardsOf(lista);
}

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCardsOf(lista) {
  var container = document.getElementById('ofertas-container');
  if (!container) return;

  if (!lista.length) {
    container.innerHTML =
      '<div class="empty-state" style="grid-column:1/-1">'
      + '<div class="empty-icon">📋</div>'
      + '<div class="empty-title">Sin resultados</div>'
      + '<div class="empty-sub">Prueba con otro filtro o categoría</div>'
      + (ESTADO.tipoUsuario === 'empresa'
        ? '<button class="btn-primary" onclick="abrirModalPublicar()" style="margin-top:14px">+ Publicar una oferta</button>'
        : '')
      + '</div>';
    return;
  }

  container.innerHTML = '';
  lista.forEach(function(o, i) {
    var card = crearCardOferta(o);
    card.style.animationDelay = (i * 0.06) + 's';
    container.appendChild(card);
  });
}

function crearCardOferta(o) {
  var esEmpresa   = ESTADO.tipoUsuario === 'empresa';
  var postulado   = yaPostulado(o.id);
  var esMiOferta  = o.empresaId === ESTADO.userId;

  var categoriaEmoji = {
    'Obra Gruesa':           '🧱',
    'Acabados':              '🎨',
    'Instalaciones':         '⚡',
    'Maquinaria y Transporte': '🚜',
    'Técnicos y Gestión':    '📋',
    'Auxiliares':            '🦺',
  };
  var catEmoji = categoriaEmoji[o.categoria] || '📁';

  var tags = (o.tags || []).map(function(t) {
    return '<span class="chip">' + t + '</span>';
  }).join('');

  var card = document.createElement('article');
  card.className = 'of-card fade-in' + (o.urgente ? ' of-card-urgente' : '') + (postulado ? ' of-card-postulada' : '');
  card.id = 'of-card-' + o.id;

  card.innerHTML =
    // Header card
    '<div class="of-card-head">'
    + '<div class="of-empresa-avatar">' + o.empresaEmoji + '</div>'
    + '<div class="of-card-head-info">'
    +   '<div class="of-empresa-nombre">' + o.empresa + '</div>'
    +   '<div class="of-fecha-pub">Publicado: ' + o.fechaPublicacion + '</div>'
    + '</div>'
    + (o.urgente ? '<span class="of-badge-urgente">⚡ URGENTE</span>' : '')
    + (o.nueva   ? '<span class="of-badge-nueva">🆕 NUEVA</span>' : '')
    + '</div>'

    // Título
    + '<h3 class="of-titulo">' + o.titulo + '</h3>'

    // Meta grid
    + '<div class="of-meta-grid">'
    +   '<div class="of-meta-item"><span>' + catEmoji + '</span>' + o.categoria + '</div>'
    +   '<div class="of-meta-item"><span>📍</span>' + o.zona + '</div>'
    +   '<div class="of-meta-item"><span>💰</span>' + (o.salario || 'A convenir') + '</div>'
    +   '<div class="of-meta-item"><span>💼</span>' + o.tipo + '</div>'
    +   '<div class="of-meta-item"><span>⏱</span>' + (o.duracion || 'A definir') + '</div>'
    +   '<div class="of-meta-item"><span>👷</span>' + o.trabajadoresNeeded + ' trabajador' + (o.trabajadoresNeeded > 1 ? 'es' : '') + '</div>'
    + '</div>'

    // Descripción corta
    + '<p class="of-descripcion">' + o.descripcion.substring(0, 120) + (o.descripcion.length > 120 ? '…' : '') + '</p>'

    // Tags
    + (tags ? '<div class="card-chips" style="margin-bottom:8px">' + tags + '</div>' : '')

    // Footer
    + '<div class="of-card-footer">'
    +   '<div class="of-postulantes-info">'
    +     '<span class="of-post-num">' + o.postulantes + '</span>'
    +     '<span class="of-post-label"> postulante' + (o.postulantes !== 1 ? 's' : '') + '</span>'
    +   '</div>'
    +   '<div class="of-btns">'
    +     '<button class="btn-secondary" style="padding:9px 14px;font-size:.85rem" onclick="verOfertaDetalle(' + o.id + ')">👁️ Ver más</button>'
    +     (esEmpresa && esMiOferta
          ? '<button class="btn-dark" style="padding:9px 14px;font-size:.85rem" onclick="cerrarOferta(' + o.id + ')">🗑️ Cerrar</button>'
          : !esEmpresa && postulado
          ? '<button class="btn-accion btn-accion-done" style="flex:1;font-size:.88rem" disabled>✅ Postulado</button>'
          : !esEmpresa
          ? '<button class="btn-postular" onclick="postularAOferta(' + o.id + ')">📨 Postularme</button>'
          : '')
    +   '</div>'
    + '</div>'
    + '<div class="of-fecha-inicio">🗓️ Inicio: <strong>' + (o.fechaInicio || 'A definir') + '</strong></div>';

  return card;
}

// ── VER DETALLE ───────────────────────────────────────────────
function verOfertaDetalle(id) {
  var o = OFERTAS.find(function(x) { return x.id === id; });
  if (!o) return;
  var esEmpresa = ESTADO.tipoUsuario === 'empresa';
  var postulado = yaPostulado(o.id);
  var esMiOf    = o.empresaId === ESTADO.userId;

  var requisitosHtml = (o.requisitos || []).map(function(r) {
    return '<li>✅ ' + r + '</li>';
  }).join('');

  var content = document.getElementById('modal-oferta-content');
  if (!content) return;

  content.innerHTML =
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:16px">'
    + '<div>'
    +   '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">'
    +     (o.urgente ? '<span class="of-badge-urgente">⚡ URGENTE</span>' : '')
    +     (o.nueva   ? '<span class="of-badge-nueva">🆕 NUEVA</span>' : '')
    +   '</div>'
    +   '<h2 style="font-family:\'Barlow Condensed\',sans-serif;font-size:1.5rem;font-weight:900;color:var(--negro);line-height:1.15">' + o.titulo + '</h2>'
    +   '<div style="font-size:.9rem;color:var(--gris-med);margin-top:4px">🏢 ' + o.empresa + ' · 📅 ' + o.fechaPublicacion + '</div>'
    + '</div>'
    + '<button onclick="cerrarModalVerOferta()" style="background:none;border:none;font-size:22px;cursor:pointer;color:#AAA;flex-shrink:0">✖</button>'
    + '</div>'

    + '<div class="of-detalle-grid">'
    +   '<div class="of-detalle-item"><span class="of-det-label">📁 Categoría</span><span>' + o.categoria + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">📍 Zona</span><span>' + o.zona + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">💰 Salario</span><span><strong>' + (o.salario || 'A convenir') + '</strong></span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">💼 Tipo</span><span>' + o.tipo + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">⏱ Duración</span><span>' + (o.duracion || 'A definir') + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">🗓️ Inicio</span><span>' + (o.fechaInicio || 'Inmediato') + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">👷 Vacantes</span><span>' + o.trabajadoresNeeded + '</span></div>'
    +   '<div class="of-detalle-item"><span class="of-det-label">👥 Postulantes</span><span>' + o.postulantes + '</span></div>'
    + '</div>'

    + '<div class="of-detalle-section">'
    +   '<div class="of-detalle-titulo">📄 Descripción</div>'
    +   '<p style="font-size:.92rem;color:var(--gris-med);line-height:1.65">' + o.descripcion + '</p>'
    + '</div>'

    + (requisitosHtml
      ? '<div class="of-detalle-section">'
        + '<div class="of-detalle-titulo">✅ Requisitos</div>'
        + '<ul style="list-style:none;display:flex;flex-direction:column;gap:6px;font-size:.88rem;color:var(--negro)">'
        + requisitosHtml + '</ul></div>'
      : '')

    + '<div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap">'
    + (esEmpresa && esMiOf
      ? '<button class="btn-secondary" onclick="cerrarOferta(' + o.id + ');cerrarModalVerOferta()">🗑️ Cerrar oferta</button>'
      : !esEmpresa && postulado
      ? '<button class="btn-accion btn-accion-done" style="flex:1" disabled>✅ Ya te postulaste</button>'
      : !esEmpresa
      ? '<button class="btn-postular" style="flex:1;justify-content:center" onclick="postularAOferta(' + o.id + ');cerrarModalVerOferta()">📨 Postularme a esta oferta</button>'
      : '')
    + '<button class="btn-secondary" onclick="cerrarModalVerOferta()">Cerrar</button>'
    + '</div>';

  var overlay = document.getElementById('modal-ver-oferta');
  overlay.style.display = 'flex';
  setTimeout(function() { overlay.classList.add('open'); }, 10);
}

function cerrarModalVerOferta() {
  var overlay = document.getElementById('modal-ver-oferta');
  overlay.classList.remove('open');
  setTimeout(function() { overlay.style.display = 'none'; }, 250);
}

// ── POSTULARSE ────────────────────────────────────────────────
function postularAOferta(id) {
  var o = OFERTAS.find(function(x) { return x.id === id; });
  if (!o) return;
  if (yaPostulado(id)) { mostrarToast('Ya te postulaste a esta oferta.', 'azul'); return; }

  var ok = postularOferta(id);
  if (!ok) return;

  mostrarToast('📨 ¡Postulación enviada a ' + o.empresa + '! Te contactarán si tu perfil encaja.', 'verde');
  calcularContadoresOf();

  // Actualizar botón en card
  var card = document.getElementById('of-card-' + id);
  if (card) {
    card.classList.add('of-card-postulada');
    var btns = card.querySelector('.of-btns');
    if (btns) {
      var btn = btns.querySelector('.btn-postular');
      if (btn) {
        btn.className = 'btn-accion btn-accion-done';
        btn.disabled  = true;
        btn.style.flex = '1';
        btn.style.fontSize = '.88rem';
        btn.textContent = '✅ Postulado';
      }
    }
    // Actualizar contador
    var numEl = card.querySelector('.of-post-num');
    if (numEl) numEl.textContent = parseInt(numEl.textContent || 0) + 1;
  }

  setTxtOf('of-mis', (ESTADO.postulaciones || []).length);
}

// ── PUBLICAR OFERTA ───────────────────────────────────────────
function abrirModalPublicar() {
  var overlay = document.getElementById('modal-publicar');
  overlay.style.display = 'flex';
  setTimeout(function() { overlay.classList.add('open'); }, 10);
}

function cerrarModalPublicar() {
  var overlay = document.getElementById('modal-publicar');
  overlay.classList.remove('open');
  setTimeout(function() { overlay.style.display = 'none'; }, 250);
  limpiarErrorOf('error-publicar');
}

function publicarOfertaForm() {
  limpiarErrorOf('error-publicar');

  var titulo      = valOf('pub-titulo');
  var categoria   = valOf('pub-categoria');
  var zona        = valOf('pub-zona');
  var descripcion = valOf('pub-descripcion');

  if (!titulo)      { mostrarErrorOf('error-publicar', '⚠️ El título es obligatorio.'); return; }
  if (!categoria)   { mostrarErrorOf('error-publicar', '⚠️ Selecciona una categoría.'); return; }
  if (!zona)        { mostrarErrorOf('error-publicar', '⚠️ Indica la zona de trabajo.'); return; }
  if (!descripcion) { mostrarErrorOf('error-publicar', '⚠️ La descripción es obligatoria.'); return; }

  var btn = document.getElementById('btn-publicar');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Publicando…';

  var requisitosRaw = valOf('pub-requisitos');
  var requisitos = requisitosRaw
    ? requisitosRaw.split('\n').map(function(r) { return r.trim(); }).filter(function(r) { return r.length > 0; })
    : [];

  var tagsRaw = valOf('pub-tags');
  var tags = tagsRaw
    ? tagsRaw.split(',').map(function(t) { return t.trim(); }).filter(function(t) { return t.length > 0; })
    : [];

  var urgente = (document.getElementById('pub-urgente') || {}).checked || false;

  setTimeout(function() {
    var nueva = publicarOferta({
      titulo:      titulo,
      categoria:   categoria,
      zona:        zona,
      descripcion: descripcion,
      salario:     valOf('pub-salario'),
      tipo:        valOf('pub-tipo'),
      cantidad:    valOf('pub-cantidad') || '1',
      duracion:    valOf('pub-duracion'),
      fechaInicio: valOf('pub-fecha-inicio'),
      requisitos:  requisitos,
      tags:        tags,
      urgente:     urgente,
    });

    cerrarModalPublicar();
    calcularContadoresOf();
    aplicarFiltrosOf();
    mostrarToast('✅ Oferta "' + nueva.titulo + '" publicada. Los trabajadores ya pueden verla.', 'verde');

    // Resetear form
    btn.disabled = false;
    btn.innerHTML = '📋 Publicar Oferta Gratis';
    ['pub-titulo','pub-categoria','pub-zona','pub-salario','pub-tipo',
     'pub-cantidad','pub-duracion','pub-fecha-inicio','pub-descripcion',
     'pub-requisitos','pub-tags'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var pu = document.getElementById('pub-urgente');
    if (pu) pu.checked = false;
  }, 900);
}

// ── CERRAR OFERTA ─────────────────────────────────────────────
function cerrarOferta(id) {
  var ok = confirm('¿Seguro que deseas cerrar esta oferta? Ya no aparecerá en el feed.');
  if (!ok) return;
  var o = OFERTAS.find(function(x) { return x.id === id; });
  if (o) o.activa = false;
  calcularContadoresOf();
  aplicarFiltrosOf();
  mostrarToast('🗑️ Oferta cerrada y eliminada del feed.', 'azul');
}

// ── HELPERS ──────────────────────────────────────────────────
function valOf(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setTxtOf(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

function mostrarErrorOf(id, msg) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
}

function limpiarErrorOf(id) {
  var el = document.getElementById(id);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}