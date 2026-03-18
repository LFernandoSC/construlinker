// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — feed.js  v2.0
//  6 acciones con crédito, semáforo, 3 estados, packs reales
// ═══════════════════════════════════════════════════════════════

let filtroCategoria = '';
let filtroTexto     = '';
let targetId        = null;
let targetAccion    = null;

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  if (!initPage('empresa')) return;
  marcarNavActivo();
  renderCards(TRABAJADORES);
  configurarBuscador();
  configurarModales();
  renderPacksModal();
  actualizarSidebar();
  verificarSemaforo();
});

// ── RENDER CARDS ──────────────────────────────────────────────
function renderCards(lista) {
  var container = document.getElementById('cards-container');
  var countEl   = document.getElementById('results-count');
  if (!container) return;

  var n = lista.length;
  if (countEl) countEl.textContent = n + ' perfil' + (n !== 1 ? 'es' : '') + ' encontrado' + (n !== 1 ? 's' : '');

  if (!n) {
    container.innerHTML =
      '<div class="empty-state">'
      + '<div class="empty-icon">🔍</div>'
      + '<div class="empty-title">Sin resultados</div>'
      + '<div class="empty-sub">Intenta con otra búsqueda o categoría</div>'
      + '<button class="btn-secondary" onclick="limpiarFiltros()">🗑️ Limpiar filtros</button>'
      + '</div>';
    return;
  }

  container.innerHTML = '';
  lista.forEach(function(t, i) {
    var card = crearCard(t);
    card.style.animationDelay = (i * 0.06) + 's';
    container.appendChild(card);
  });
}

function crearCard(t) {
  var revelado    = estaRevelado(t.id);
  var conOferta   = tieneOferta(t.id);
  var sinCred     = getCreditos() <= 0;
  var estadoInfo  = getEstadoTrabajador(t);
  var chips       = t.habilidades.slice(0, 3).map(function(h) {
    return '<span class="chip">' + h + '</span>';
  }).join('') + (t.habilidades.length > 3
    ? '<span class="chip chip-more">+' + (t.habilidades.length - 3) + '</span>'
    : '');

  // Botones de acciones en la card
  var botonesAcciones = construirBotonesCard(t, revelado, conOferta, sinCred);

  var card = document.createElement('article');
  card.className = 'worker-card fade-in' + (revelado ? ' card-revelada' : '') + (conOferta ? ' card-con-oferta' : '');
  card.id = 'card-' + t.id;

  card.innerHTML =
    '<div class="card-accent" style="background:' + t.color + '"></div>'
    + '<div class="card-inner">'

    // HEAD
    + '<div class="card-head">'
    +   '<div class="avatar-wrap">'
    +     '<div class="avatar" style="background:' + t.color + '20;border-color:' + t.color + '">'
    +       '<span class="avatar-emoji">' + t.emoji + '</span>'
    +     '</div>'
    +     '<span class="badge-estado ' + estadoInfo.badge + '">' + estadoInfo.label + '</span>'
    +   '</div>'
    +   '<div class="card-identity">'
    +     '<h3 class="worker-name">' + t.nombre + '</h3>'
    +     '<p class="worker-oficio">🔧 ' + t.oficio + '</p>'
    +     '<div class="worker-stars">' + renderEstrellas(t.rating)
    +       ' <span class="rating-num">' + t.rating + '.0</span>'
    +       ' <span class="rating-count">(' + t.reseñas_count + ' reseñas)</span>'
    +     '</div>'
    +   '</div>'
    +   '<a href="perfil.html?id=' + t.id + '" class="btn-ver-perfil" title="Ver perfil completo">👤</a>'
    + '</div>'

    // META
    + '<div class="card-meta-grid">'
    +   '<div class="meta-item"><span>📍</span> ' + t.zona + '</div>'
    +   '<div class="meta-item"><span>📅</span> ' + t.exp + ' años exp.</div>'
    +   '<div class="meta-item"><span>📁</span> ' + t.categoria + '</div>'
    +   '<div class="meta-item"><span>✅</span> Verificado</div>'
    + '</div>'

    // CHIPS
    + '<div class="card-chips">' + chips + '</div>'

    // CONTACT BOX (si contacto revelado)
    + '<div class="contact-box" id="contact-' + t.id + '" style="display:' + (revelado ? 'flex' : 'none') + '">'
    +   '<span class="contact-icon">💬</span>'
    +   '<div class="contact-info">'
    +     '<span class="contact-label">WhatsApp Verificado</span>'
    +     '<span class="contact-num">' + t.whatsapp_display + '</span>'
    +   '</div>'
    +   '<a href="https://wa.me/' + t.whatsapp + '?text=' + encodeURIComponent('Hola ' + t.nombre + ', te contacto desde Construlinker 🏗️') + '"'
    +      ' target="_blank" class="btn-wsp">📲 Chatear</a>'
    + '</div>'

    // OFERTA BOX (si oferta enviada)
    + '<div class="oferta-box" id="oferta-' + t.id + '" style="display:' + (conOferta ? 'flex' : 'none') + '">'
    +   '<span>📨</span>'
    +   '<div class="contact-info">'
    +     '<span class="contact-label">Oferta Enviada</span>'
    +     '<span class="contact-num" style="font-size:.9rem">Pendiente de respuesta</span>'
    +   '</div>'
    + '</div>'

    // ACCIONES
    + '<div class="card-acciones" id="acciones-' + t.id + '">'
    +   botonesAcciones
    + '</div>'

    // FOOTER
    + '<div class="card-footer">'
    +   '<a href="perfil.html?id=' + t.id + '" class="btn-perfil-link">Ver perfil completo →</a>'
    + '</div>'
    + '</div>';

  return card;
}

// ── BOTONES DE ACCIONES POR CARD ──────────────────────────────
function construirBotonesCard(t, revelado, conOferta, sinCred) {
  var id = t.id;
  var html = '';

  // 1. Ver Contacto
  if (revelado) {
    html += '<button class="btn-accion btn-accion-done" disabled>✅ Contacto desbloqueado</button>';
  } else if (sinCred) {
    html += '<button class="btn-accion btn-accion-blocked" onclick="abrirModalCompra()">'
          + '📞 Ver Contacto <span class="accion-tag accion-tag-blocked">Sin créditos</span></button>';
  } else {
    html += '<button class="btn-accion btn-accion-principal" onclick="pedirAccion(' + id + ',\'ver_contacto\')">'
          + '📞 Ver Contacto <span class="accion-tag">🪙 1 crédito</span></button>';
  }

  // 2. Enviar Oferta
  if (conOferta) {
    html += '<button class="btn-accion btn-accion-done" disabled>📨 Oferta enviada</button>';
  } else if (sinCred) {
    html += '<button class="btn-accion btn-accion-sec btn-accion-blocked" onclick="abrirModalCompra()">'
          + '📨 Enviar Oferta <span class="accion-tag accion-tag-blocked">Sin créditos</span></button>';
  } else {
    html += '<button class="btn-accion btn-accion-sec" onclick="pedirAccion(' + id + ',\'enviar_oferta\')">'
          + '📨 Enviar Oferta <span class="accion-tag">🪙 1 crédito</span></button>';
  }

  // 3. Ver Disponibilidad
  var yaDisp = tieneDisponibilidad(id);
  if (yaDisp) {
    html += '<button class="btn-accion btn-accion-done" disabled>📅 Disponibilidad consultada</button>';
  } else if (sinCred) {
    html += '<button class="btn-accion btn-accion-sec btn-accion-blocked" onclick="abrirModalCompra()">'
          + '📅 Ver Disponibilidad <span class="accion-tag accion-tag-blocked">Sin créditos</span></button>';
  } else {
    html += '<button class="btn-accion btn-accion-sec" onclick="pedirAccion(' + id + ',\'ver_disponibilidad\')">'
          + '📅 Ver Disponibilidad <span class="accion-tag">🪙 1 crédito</span></button>';
  }

  // 4. Descargar Docs
  var docsCount = t.documentos ? t.documentos.length : 0;
  if (docsCount > 0) {
    html += '<button class="btn-accion btn-accion-sec" onclick="pedirAccion(' + id + ',\'descargar_doc\')">'
          + '📄 Descargar Docs <span class="accion-tag">🪙 1 crédito</span></button>';
  }

  return html;
}

// ── PEDIR ACCIÓN (entrada unificada) ─────────────────────────
function pedirAccion(id, accionId) {
  if (getCreditos() <= 0) {
    mostrarToastUrgente();
    abrirModalCompra();
    return;
  }

  var accion = null;
  for (var key in ACCIONES) {
    if (ACCIONES[key].id === accionId) { accion = ACCIONES[key]; break; }
  }
  if (!accion) return;

  // Si ya realizó esa acción antes, no gastar otro crédito
  if (accionId === 'ver_contacto' && estaRevelado(id))        return;
  if (accionId === 'enviar_oferta' && tieneOferta(id))        return;
  if (accionId === 'ver_disponibilidad' && tieneDisponibilidad(id)) return;

  var t = TRABAJADORES.find(function(x) { return x.id === id; });
  if (!t) return;

  targetId     = id;
  targetAccion = accion;

  // Rellenar modal de confirmación
  document.getElementById('modal-nombre').textContent   = t.nombre;
  document.getElementById('modal-oficio').textContent   = t.oficio;
  document.getElementById('modal-accion-label').textContent = accion.emoji + ' ' + accion.label;
  document.getElementById('modal-saldo').textContent    = getCreditos();
  document.getElementById('modal-saldo-post').textContent = getCreditos() - 1;

  // Mensaje específico por acción (del PDF)
  var mensajes = {
    'ver_contacto':      '❗ Necesitas 1 crédito para ver el teléfono y WhatsApp de este trabajador.',
    'enviar_oferta':     'Esta acción requiere 1 crédito. Se enviará una notificación inmediata al trabajador.',
    'ver_disponibilidad':'Necesitas 1 crédito para consultar si este trabajador puede empezar hoy o mañana.',
    'descargar_doc':     'Para descargar la documentación (PRL, CV, certificados) necesitas 1 crédito.',
  };
  var msgEl = document.getElementById('modal-accion-desc');
  if (msgEl) msgEl.textContent = mensajes[accionId] || 'Esta acción consume 1 crédito.';

  var overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'flex';
  setTimeout(function() { overlay.classList.add('open'); }, 10);
}

// Alias para compatibilidad con código anterior
function pedirContacto(id) { pedirAccion(id, 'ver_contacto'); }

// ── CONFIRMAR ACCIÓN ──────────────────────────────────────────
function confirmarAccion() {
  if (targetId === null || !targetAccion) return;
  var id     = targetId;
  var accion = targetAccion;
  cerrarModal();

  var ok = gastarCredito(id, accion);
  if (!ok) { mostrarToast('❌ No tienes créditos suficientes.', 'rojo'); return; }

  sincronizarWallet();
  actualizarSidebar();

  var t = TRABAJADORES.find(function(x) { return x.id === id; });

  // Efectos visuales según acción
  if (accion.id === 'ver_contacto') {
    var box = document.getElementById('contact-' + id);
    if (box) { box.style.display = 'flex'; box.classList.add('reveal-anim'); }
    mostrarToast('✅ Contacto de ' + t.nombre + ' desbloqueado. Saldo: ' + getCreditos() + ' créditos', 'verde');
  } else if (accion.id === 'enviar_oferta') {
    var oBox = document.getElementById('oferta-' + id);
    if (oBox) { oBox.style.display = 'flex'; oBox.classList.add('reveal-anim'); }
    mostrarToast('📨 Oferta enviada a ' + t.nombre + '. Saldo: ' + getCreditos() + ' créditos', 'verde');
  } else if (accion.id === 'ver_disponibilidad') {
    var dispEstado = t.estado === 'disponible'
      ? '✅ Disponible para empezar esta semana'
      : t.estado === 'limitado'
      ? '◐ Disponible en horario parcial'
      : '❌ No disponible actualmente';
    mostrarToast('📅 ' + t.nombre + ': ' + dispEstado + '. Saldo: ' + getCreditos(), 'verde');
  } else if (accion.id === 'descargar_doc') {
    mostrarToast('📄 Documentación de ' + t.nombre + ' descargada. Saldo: ' + getCreditos(), 'verde');
  }

  // Re-render botones de esa card
  var accionesEl = document.getElementById('acciones-' + id);
  if (accionesEl) {
    accionesEl.innerHTML = construirBotonesCard(
      t,
      estaRevelado(id),
      tieneOferta(id),
      getCreditos() <= 0
    );
  }

  // Agregar clase a la card si corresponde
  var card = document.getElementById('card-' + id);
  if (card) {
    if (accion.id === 'ver_contacto') card.classList.add('card-revelada');
    if (accion.id === 'enviar_oferta') card.classList.add('card-con-oferta');
  }

  // Verificar semáforo
  verificarSemaforo();
}

// Alias legacy
function confirmarContacto() { confirmarAccion(); }

// ── CERRAR MODAL ──────────────────────────────────────────────
function cerrarModal() {
  var overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  setTimeout(function() { overlay.style.display = 'none'; }, 250);
  targetId     = null;
  targetAccion = null;
}

// ── MODAL COMPRA ──────────────────────────────────────────────
function abrirModalCompra() {
  var el = document.getElementById('modal-compra-overlay');
  if (!el) return;
  el.style.display = 'flex';
  setTimeout(function() { el.classList.add('open'); }, 10);
}

function cerrarModalCompra() {
  var el = document.getElementById('modal-compra-overlay');
  if (!el) return;
  el.classList.remove('open');
  setTimeout(function() { el.style.display = 'none'; }, 250);
}

function comprarPaquete(cantidad, precio) {
  cerrarModalCompra();
  agregarCreditos(cantidad);
  sincronizarWallet();
  actualizarSidebar();
  mostrarToast('🎉 ¡' + cantidad + ' créditos añadidos! Nuevo saldo: ' + getCreditos(), 'verde');
  // Re-render cards para actualizar botones bloqueados
  setTimeout(function() { aplicarFiltros(); }, 300);
}

// Render packs dentro del modal de compra del feed
function renderPacksModal() {
  var container = document.getElementById('packs-modal-container');
  if (!container) return;
  container.innerHTML = PACKS_CREDITOS.map(function(p) {
    return '<div class="paquete-card ' + (p.popular ? 'popular' : '') + '" style="position:relative;margin-top:' + (p.popular ? '14px' : '0') + '">'
      + (p.popular ? '<div class="popular-badge">⭐ Más popular</div>' : '')
      + (p.bonus   ? '<div style="font-size:.7rem;color:var(--verde);font-weight:800;margin-bottom:3px">🎁 ' + p.bonus + '</div>' : '')
      + '<div style="font-size:28px;margin-bottom:4px">' + p.emoji + '</div>'
      + '<div class="paquete-cred">' + p.creditos + '</div>'
      + '<div class="paquete-label">créditos</div>'
      + '<div class="paquete-precio">' + p.moneda + ' ' + p.precio + '</div>'
      + '<div style="font-size:.72rem;color:#999;margin:3px 0 8px">' + p.descripcion + '</div>'
      + '<button onclick="comprarPaquete(' + p.creditos + ',' + p.precio + ')" '
      +   'class="' + (p.popular ? 'btn-primary' : 'btn-dark') + '" '
      +   'style="width:100%;padding:9px;font-size:.88rem;justify-content:center">'
      +   'Comprar</button>'
      + '</div>';
  }).join('');
}

// ── TOAST URGENTE (mensajes del PDF) ──────────────────────────
function mostrarToastUrgente() {
  var n = getCreditos();
  if (n === 0) {
    mostrarToast('⛔ Sin créditos. Compra un pack para contactar trabajadores.', 'rojo');
  } else if (n === 1) {
    mostrarToast('⚠️ Último crédito. Compra un pack antes de quedarte sin acceso.', 'rojo');
  }
}

// ── FILTROS ───────────────────────────────────────────────────
function configurarBuscador() {
  var input = document.getElementById('search-input');
  if (!input) return;
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') aplicarFiltros();
  });
  input.addEventListener('input', function() {
    clearTimeout(input._timer);
    input._timer = setTimeout(function() { aplicarFiltros(); }, 350);
  });
}

function aplicarFiltros() {
  filtroTexto = (document.getElementById('search-input').value || '').toLowerCase().trim();
  var catSel  = document.getElementById('cat-select').value;
  if (catSel !== undefined) filtroCategoria = catSel;

  var lista = TRABAJADORES.filter(function(t) {
    var matchCat  = !filtroCategoria || t.categoria === filtroCategoria;
    var matchText = !filtroTexto
      || t.nombre.toLowerCase().includes(filtroTexto)
      || t.oficio.toLowerCase().includes(filtroTexto)
      || t.zona.toLowerCase().includes(filtroTexto)
      || t.habilidades.some(function(h) { return h.toLowerCase().includes(filtroTexto); });
    return matchCat && matchText;
  });

  var titulo = filtroCategoria ? filtroCategoria : 'Todos los Trabajadores';
  var titleEl = document.getElementById('results-title');
  if (titleEl) titleEl.textContent = titulo;
  renderCards(lista);
  actualizarSidebar();
}

function filtrarTag(el, cat) {
  document.querySelectorAll('.filter-tag').forEach(function(t) { t.classList.remove('active'); });
  document.querySelectorAll('.cat-item').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  filtroCategoria = cat;
  var sel = document.getElementById('cat-select');
  if (sel) sel.value = cat;
  // Sincronizar sidebar cat-item
  var catItem = document.querySelector('.cat-item[data-cat="' + cat + '"]');
  if (catItem) catItem.classList.add('active');
  aplicarFiltros();
}

function limpiarFiltros() {
  filtroCategoria = '';
  filtroTexto     = '';
  var si = document.getElementById('search-input');
  var sc = document.getElementById('cat-select');
  if (si) si.value = '';
  if (sc) sc.value = '';
  document.querySelectorAll('.filter-tag').forEach(function(t) { t.classList.remove('active'); });
  var tagTodo = document.querySelector('.filter-tag[data-cat=""]');
  if (tagTodo) tagTodo.classList.add('active');
  renderCards(TRABAJADORES);
}

// ── CONFIGURAR MODALES ────────────────────────────────────────
function configurarModales() {
  var overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target.id === 'modal-overlay') cerrarModal();
    });
  }
  var overlayCompra = document.getElementById('modal-compra-overlay');
  if (overlayCompra) {
    overlayCompra.addEventListener('click', function(e) {
      if (e.target.id === 'modal-compra-overlay') cerrarModalCompra();
    });
  }
}

// ── ACTUALIZAR SIDEBAR ────────────────────────────────────────
function actualizarSidebar() {
  var wNum = document.getElementById('wallet-sidebar-num');
  var wProg = document.getElementById('wallet-progreso');
  var qCred = document.getElementById('qs-creditos');
  var qRev  = document.getElementById('qs-revelados');
  var qAcc  = document.getElementById('qs-acciones');
  var n = getCreditos();

  if (wNum)  wNum.textContent  = n;
  if (wProg) wProg.style.width = Math.min(100, (n / 50) * 100) + '%';
  if (qCred) qCred.textContent = n;
  if (qRev)  qRev.textContent  = ESTADO.revelados.length;
  if (qAcc)  qAcc.textContent  = ESTADO.historial.length;
}

// ── ACTUALIZAR BANNER LEGACY ──────────────────────────────────
function actualizarBannerCreditos() {
  verificarSemaforo();
  actualizarSidebar();
}