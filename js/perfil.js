// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — perfil.js  v2.0
//  Perfil trabajador con 6 acciones, docs, 3 estados
//  Dashboard empresa con historial mejorado y packs reales
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
//  PERFIL DE TRABAJADOR (vista empresa)
// ══════════════════════════════════════════════════════════════

function initPerfil() {
    if (!initPage('empresa')) return;
    marcarNavActivo();
  
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));
    var t  = TRABAJADORES.find(function(x) { return x.id === id; });
  
    if (!t) {
      document.getElementById('perfil-container').innerHTML =
        '<div style="text-align:center;padding:80px 20px;">'
        + '<div style="font-size:56px">😕</div>'
        + '<h2>Trabajador no encontrado</h2>'
        + '<a href="feed.html" class="btn-primary" style="display:inline-block;margin-top:20px;">← Volver al feed</a>'
        + '</div>';
      return;
    }
  
    renderPerfil(t);
    iniciarTabs();
  }
  
  // ── RENDER CABECERA + TABS ────────────────────────────────────
  function renderPerfil(t) {
    var estadoInfo = getEstadoTrabajador(t);
  
    // Cover color
    var cover = document.getElementById('cover-color');
    if (cover) cover.style.background = 'linear-gradient(135deg, ' + t.color + '60, ' + t.color + '20)';
  
    // Datos básicos
    setTxt('perfil-emoji',  t.emoji);
    setTxt('perfil-nombre', t.nombre);
    setTxt('perfil-oficio', '🔧 ' + t.oficio + ' · ' + t.categoria);
    setTxt('perfil-zona',   '📍 ' + t.zona);
    setTxt('perfil-exp',    '📅 ' + t.exp + ' años de experiencia');
  
    var starsEl = document.getElementById('perfil-stars');
    if (starsEl) starsEl.innerHTML = renderEstrellas(t.rating)
      + ' <span style="font-weight:700;color:#111">' + t.rating + '.0</span>'
      + ' <span style="color:#888;font-size:.9rem">(' + t.reseñas_count + ' reseñas)</span>';
  
    var badge = document.getElementById('perfil-estado');
    if (badge) {
      badge.textContent = estadoInfo.label;
      badge.className   = 'estado-badge ' + estadoInfo.badge;
    }
  
    // Rellenar tabs
    renderTabSobre(t);
    renderTabDocumentos(t);
    renderTabProyectos(t);
    renderTabReseñas(t);
  
    // Sidebar de acciones
    renderSidebarAcciones(t);
  }
  
  // ── TAB: SOBRE MÍ ─────────────────────────────────────────────
  function renderTabSobre(t) {
    var el = document.getElementById('tab-sobre');
    if (!el) return;
    var estadoInfo = getEstadoTrabajador(t);
  
    el.innerHTML =
      '<p class="desc-text">' + t.descripcion + '</p>'
      + '<div class="info-grid">'
      +   '<div class="info-row"><span class="info-label">🔧 Oficio</span><span>' + t.oficio + '</span></div>'
      +   '<div class="info-row"><span class="info-label">📁 Categoría</span><span>' + t.categoria + '</span></div>'
      +   '<div class="info-row"><span class="info-label">📍 Zona</span><span>' + t.zona + '</span></div>'
      +   '<div class="info-row"><span class="info-label">📅 Experiencia</span><span>' + t.exp + ' años</span></div>'
      +   '<div class="info-row"><span class="info-label">⭐ Calificación</span><span>' + t.rating + '/5 (' + t.reseñas_count + ' reseñas)</span></div>'
      +   '<div class="info-row"><span class="info-label">📊 Estado</span>'
      +     '<span class="estado-badge ' + estadoInfo.badge + '" style="font-size:.78rem">' + estadoInfo.label + '</span></div>'
      + '</div>'
      + '<h4 class="section-label">🛠️ Habilidades y especialidades</h4>'
      + '<div class="chips-big">'
      + t.habilidades.map(function(h) { return '<span class="chip-big">' + h + '</span>'; }).join('')
      + '</div>';
  }
  
  // ── TAB: DOCUMENTACIÓN ────────────────────────────────────────
  function renderTabDocumentos(t) {
    var el = document.getElementById('tab-documentos');
    if (!el) return;
  
    if (!t.documentos || !t.documentos.length) {
      el.innerHTML = '<div class="empty-state-small"><span>📄</span><p>Este trabajador aún no ha subido documentación.</p></div>';
      return;
    }
  
    el.innerHTML =
      '<div class="docs-intro">'
      + '<p>Descarga la documentación verificada de <strong>' + t.nombre + '</strong>. Cada descarga consume <strong>1 crédito</strong>.</p>'
      + '</div>'
      + '<div class="docs-grid">'
      + t.documentos.map(function(d) {
          return '<div class="doc-card">'
            + '<div class="doc-icon">' + d.icono + '</div>'
            + '<div class="doc-info">'
            +   '<div class="doc-nombre">' + d.nombre + '</div>'
            +   '<div class="doc-tipo">' + d.tipo + '</div>'
            +   '<div class="doc-fecha">📅 ' + d.fecha + '</div>'
            + '</div>'
            + '<button class="btn-doc" onclick="pedirAccionPerfil(' + t.id + ',\'descargar_doc\',\'' + d.nombre + '\')">'
            +   '📥 Descargar <span class="accion-tag" style="font-size:.7rem">🪙 1</span>'
            + '</button>'
            + '</div>';
        }).join('')
      + '</div>'
      + '<div class="docs-nota">'
      + '⏱ Los créditos no vencen — validez 12 meses. 🔒 Documentación verificada por Construlinker.'
      + '</div>';
  }
  
  // ── TAB: PROYECTOS ────────────────────────────────────────────
  function renderTabProyectos(t) {
    var el = document.getElementById('tab-proyectos');
    if (!el) return;
  
    if (!t.proyectos || !t.proyectos.length) {
      el.innerHTML = '<div class="empty-state-small"><span>🏗️</span><p>Sin proyectos registrados aún.</p></div>';
      return;
    }
  
    el.innerHTML = t.proyectos.map(function(p) {
      return '<div class="proyecto-card">'
        + '<div class="proyecto-icon">🏗️</div>'
        + '<div class="proyecto-info">'
        +   '<div class="proyecto-nombre">' + p.nombre + '</div>'
        +   '<div class="proyecto-meta"><strong>' + p.rol + '</strong> · ' + p.empresa + '</div>'
        +   '<div class="proyecto-año">📅 ' + p.año + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
  }
  
  // ── TAB: RESEÑAS ──────────────────────────────────────────────
  function renderTabReseñas(t) {
    var el = document.getElementById('tab-reseñas');
    if (!el) return;
  
    if (!t.reseñas || !t.reseñas.length) {
      el.innerHTML = '<div class="empty-state-small"><span>⭐</span><p>Sin reseñas aún.</p></div>';
      return;
    }
  
    el.innerHTML = t.reseñas.map(function(r) {
      return '<div class="reseña-card">'
        + '<div class="reseña-head">'
        +   '<div class="reseña-autor">'
        +     '<div class="reseña-empresa">' + r.autor + '</div>'
        +     '<div class="reseña-cargo">' + r.cargo + '</div>'
        +   '</div>'
        +   '<div class="reseña-stars">' + renderEstrellas(r.cal) + '</div>'
        +   '<div class="reseña-fecha">' + r.fecha + '</div>'
        + '</div>'
        + '<p class="reseña-texto">"' + r.texto + '"</p>'
        + '</div>';
    }).join('');
  }
  
  // ── SIDEBAR DE 6 ACCIONES ─────────────────────────────────────
  function renderSidebarAcciones(t) {
    var sidebar = document.getElementById('sidebar-cta');
    if (!sidebar) return;
  
    var revelado  = estaRevelado(t.id);
    var conOferta = tieneOferta(t.id);
    var yaDisp    = tieneDisponibilidad(t.id);
    var sinCred   = getCreditos() <= 0;
    var n         = getCreditos();
    var estadoInfo = getEstadoTrabajador(t);
  
    var html = '';
  
    // ── Bloque estado del trabajador ──
    html += '<div class="sidebar-estado-bloque">'
      + '<span class="estado-badge ' + estadoInfo.badge + '">' + estadoInfo.label + '</span>'
      + '<span style="font-size:.78rem;color:var(--gris-med);margin-left:6px">'
      + (t.estado === 'disponible'    ? 'Listo para incorporarse'
         : t.estado === 'limitado'    ? 'Disponibilidad parcial'
         : 'No disponible actualmente')
      + '</span>'
      + '</div>';
  
    // ── Saldo de créditos ──
    html += '<div class="sidebar-saldo-chip">'
      + '<span>🪙</span>'
      + '<span>Tienes <strong>' + n + ' crédito' + (n !== 1 ? 's' : '') + '</strong></span>'
      + (sinCred ? '<a href="dashboard.html#creditos" class="chip chip-more" style="margin-left:auto;font-size:.72rem">Recargar →</a>' : '')
      + '</div>';
  
    // ── ACCIÓN 1: Ver Contacto ──
    html += '<div class="sidebar-accion-bloque">';
    if (revelado) {
      html += '<div class="sidebar-accion-done">'
        + '<div class="unlock-icon">✅</div>'
        + '<div class="unlock-title">Contacto Desbloqueado</div>'
        + '<div class="contact-box-full">'
        +   '<span>💬</span>'
        +   '<div>'
        +     '<div class="contact-label">WhatsApp Verificado</div>'
        +     '<div class="contact-num">' + t.whatsapp_display + '</div>'
        +   '</div>'
        + '</div>'
        + '<a href="https://wa.me/' + t.whatsapp + '?text=' + encodeURIComponent('Hola ' + t.nombre + ', te contacto desde Construlinker 🏗️') + '"'
        +    ' target="_blank" class="btn-wsp-full">📲 Escribir por WhatsApp</a>'
        + '</div>';
    } else {
      html += '<div class="sidebar-accion-locked">'
        + '<div class="lock-title">📞 Ver Contacto</div>'
        + '<p class="lock-desc">Accede al teléfono y WhatsApp verificado de ' + t.nombre + '.</p>'
        + (sinCred
          ? '<button class="btn-comprar-cta" onclick="window.location.href=\'dashboard.html#creditos\'">⚠️ Sin créditos · Recargar</button>'
          : '<button class="btn-desbloquear" onclick="pedirAccionPerfil(' + t.id + ',\'ver_contacto\',null)">'
            + '<span>👁️ Ver Contacto · <span style="color:var(--amarillo)">1 Crédito</span></span>'
            + '</button>')
        + '</div>';
    }
    html += '</div>';
  
    html += '<hr class="sidebar-divider"/>';
  
    // ── ACCIONES 2-4 ──
    html += '<div class="sidebar-acciones-extra">';
    html += '<div class="sidebar-acciones-titulo">Más acciones · 1 crédito c/u</div>';
  
    // Enviar oferta
    if (conOferta) {
      html += '<div class="sidebar-accion-mini done">📨 Oferta enviada <span class="check-mini">✅</span></div>';
    } else if (sinCred) {
      html += '<button class="sidebar-accion-mini blocked" onclick="window.location.href=\'dashboard.html#creditos\'">📨 Enviar Oferta · Sin créditos</button>';
    } else {
      html += '<button class="sidebar-accion-mini" onclick="pedirAccionPerfil(' + t.id + ',\'enviar_oferta\',null)">📨 Enviar Oferta Directa <span class="accion-tag" style="font-size:.7rem">🪙 1</span></button>';
    }
  
    // Ver disponibilidad
    if (yaDisp) {
      var dispTxt = t.estado === 'disponible'    ? '✅ Disponible esta semana'
                  : t.estado === 'limitado'      ? '◐ Disponibilidad parcial'
                  : '❌ No disponible ahora';
      html += '<div class="sidebar-accion-mini done">📅 ' + dispTxt + ' <span class="check-mini">✅</span></div>';
    } else if (sinCred) {
      html += '<button class="sidebar-accion-mini blocked" onclick="window.location.href=\'dashboard.html#creditos\'">📅 Ver Disponibilidad · Sin créditos</button>';
    } else {
      html += '<button class="sidebar-accion-mini" onclick="pedirAccionPerfil(' + t.id + ',\'ver_disponibilidad\',null)">📅 Ver Disponibilidad <span class="accion-tag" style="font-size:.7rem">🪙 1</span></button>';
    }
  
    // Descargar docs
    var docsCount = t.documentos ? t.documentos.length : 0;
    if (docsCount > 0) {
      html += '<button class="sidebar-accion-mini" onclick="activarTabPerfil(\'documentos\')">📄 Ver Documentación (' + docsCount + ' docs) <span class="accion-tag" style="font-size:.7rem">🪙 1 c/u</span></button>';
    }
  
    html += '</div>'; // sidebar-acciones-extra
  
    sidebar.innerHTML = html;
  }
  
  // ── PEDIR ACCIÓN DESDE PERFIL ─────────────────────────────────
  function pedirAccionPerfil(id, accionId, extra) {
    if (getCreditos() <= 0) {
      mostrarToast('⛔ Sin créditos. Compra un pack para continuar.', 'rojo');
      setTimeout(function() { window.location.href = 'dashboard.html#creditos'; }, 1500);
      return;
    }
  
    var accion = null;
    var keys = Object.keys(ACCIONES);
    for (var i = 0; i < keys.length; i++) {
      if (ACCIONES[keys[i]].id === accionId) { accion = ACCIONES[keys[i]]; break; }
    }
    if (!accion) return;
  
    if (accionId === 'ver_contacto'      && estaRevelado(id))        return;
    if (accionId === 'enviar_oferta'     && tieneOferta(id))         return;
    if (accionId === 'ver_disponibilidad'&& tieneDisponibilidad(id)) return;
  
    var t = TRABAJADORES.find(function(x) { return x.id === id; });
    if (!t) return;
  
    var mensajes = {
      'ver_contacto':       '❗ Necesitas 1 crédito para ver el WhatsApp de ' + t.nombre + '.',
      'enviar_oferta':      '📨 Se enviará una notificación directa a ' + t.nombre + ' con tu oferta.',
      'ver_disponibilidad': '📅 Consulta si ' + t.nombre + ' puede incorporarse hoy o esta semana.',
      'descargar_doc':      '📄 Descarga la documentación "' + (extra || 'documento') + '" de ' + t.nombre + '.',
    };
  
    var confirma = confirm(
      (mensajes[accionId] || 'Esta acción consume 1 crédito.')
      + '\n\nSaldo actual: ' + getCreditos() + ' crédito' + (getCreditos() !== 1 ? 's' : '')
      + '\nQuedarás con: ' + (getCreditos() - 1) + ' crédito' + ((getCreditos() - 1) !== 1 ? 's' : '')
      + '\n\n¿Confirmar?'
    );
    if (!confirma) return;
  
    var ok = gastarCredito(id, accion);
    if (!ok) { mostrarToast('❌ No hay créditos suficientes.', 'rojo'); return; }
  
    sincronizarWallet();
  
    if (accionId === 'ver_contacto') {
      mostrarToast('✅ Contacto de ' + t.nombre + ' desbloqueado. Saldo: ' + getCreditos(), 'verde');
    } else if (accionId === 'enviar_oferta') {
      mostrarToast('📨 Oferta enviada a ' + t.nombre + '. Saldo: ' + getCreditos(), 'verde');
    } else if (accionId === 'ver_disponibilidad') {
      var disp = t.estado === 'disponible'  ? '✅ Disponible esta semana'
               : t.estado === 'limitado'    ? '◐ Disponibilidad parcial'
               : '❌ No disponible ahora';
      mostrarToast('📅 ' + t.nombre + ': ' + disp + '. Saldo: ' + getCreditos(), 'verde');
    } else if (accionId === 'descargar_doc') {
      mostrarToast('📄 "' + (extra || 'Documento') + '" descargado. Saldo: ' + getCreditos(), 'verde');
    }
  
    // Re-render sidebar y tab docs
    setTimeout(function() { renderSidebarAcciones(t); }, 300);
  }
  
  // ── TABS ──────────────────────────────────────────────────────
  function iniciarTabs() {
    document.querySelectorAll('.tab-btn').forEach(function(tab) {
      tab.addEventListener('click', function() {
        activarTabPerfil(tab.dataset.tab);
      });
    });
  }
  
  function activarTabPerfil(nombre) {
    document.querySelectorAll('.tab-btn').forEach(function(t)    { t.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p)  { p.classList.remove('active'); });
    var tabBtn = document.querySelector('.tab-btn[data-tab="' + nombre + '"]');
    var tabPanel = document.getElementById('tab-' + nombre);
    if (tabBtn)   tabBtn.classList.add('active');
    if (tabPanel) tabPanel.classList.add('active');
  }
  
  // ══════════════════════════════════════════════════════════════
  //  DASHBOARD EMPRESA
  // ══════════════════════════════════════════════════════════════
  
  function initDashboard() {
    if (!initPage('empresa')) return;
    marcarNavActivo();
    renderDashboard();
    configurarTabsDashboard();
    renderPacksDashboard();
  
    var hash = window.location.hash;
    if      (hash === '#creditos')  activarTabDash('creditos');
    else if (hash === '#historial') activarTabDash('historial');
    else                            activarTabDash('perfil');
  }
  
  function renderDashboard() {
    var e = EMPRESA_DEMO;
  
    setTxt('emp-nombre',         e.nombre);
    setTxt('emp-ruc',            'RUC: ' + e.ruc);
    setTxt('emp-representante',  '👤 ' + e.representante + ' · ' + e.cargo);
    setTxt('emp-ubicacion',      '📍 ' + e.ubicacion);
    setTxt('emp-fundacion',      '🗓️ Fundada en ' + e.fundacion);
    setTxt('emp-empleados',      e.empleados);
  
    var descEl = document.getElementById('emp-desc');
    if (descEl) descEl.textContent = e.descripcion;
  
    // Stats
    setTxt('stat-creditos',    getCreditos());
    setTxt('stat-revelados',   ESTADO.revelados.length);
    setTxt('stat-acciones',    ESTADO.historial.length);
    setTxt('stat-proyectos',   e.proyectosActivos);
    setTxt('stat-completados', e.proyectosCompletados);
  
    // Chips especialidades
    var especEl = document.getElementById('emp-especialidades');
    if (especEl) especEl.innerHTML = e.especialidades.map(function(s) {
      return '<span class="chip">' + s + '</span>';
    }).join('');
  
    // Chips certificaciones
    var certEl = document.getElementById('emp-certificaciones');
    if (certEl) certEl.innerHTML = e.certificaciones.map(function(c) {
      return '<span class="chip chip-cert">✅ ' + c + '</span>';
    }).join('');
  
    renderHistorial();
  
    setTxt('wallet-saldo-main', getCreditos());
  }
  
  // ── HISTORIAL MEJORADO ────────────────────────────────────────
  function renderHistorial() {
    var container = document.getElementById('historial-container');
    if (!container) return;
  
    if (!ESTADO.historial || !ESTADO.historial.length) {
      container.innerHTML =
        '<div class="empty-state-small">'
        + '<span>📋</span>'
        + '<p>Aún no has realizado acciones.<br>'
        + 'Ve al <a href="feed.html">buscador</a> para encontrar trabajadores.</p>'
        + '</div>';
      return;
    }
  
    // Resumen de acciones
    var resumen = {};
    ESTADO.historial.forEach(function(h) {
      var key = h.accionId || 'ver_contacto';
      resumen[key] = (resumen[key] || 0) + 1;
    });
  
    var resumenHtml = '<div class="historial-resumen">';
    var accionKeys = Object.keys(resumen);
    for (var i = 0; i < accionKeys.length; i++) {
      var k = accionKeys[i];
      var ac = null;
      var akeys = Object.keys(ACCIONES);
      for (var j = 0; j < akeys.length; j++) {
        if (ACCIONES[akeys[j]].id === k) { ac = ACCIONES[akeys[j]]; break; }
      }
      resumenHtml += '<div class="hist-resumen-item">'
        + '<span>' + (ac ? ac.emoji : '🔹') + '</span>'
        + '<span>' + resumen[k] + ' ' + (ac ? ac.label : k) + '</span>'
        + '</div>';
    }
    resumenHtml += '<div class="hist-resumen-item hist-resumen-total">'
      + '<span>🪙</span>'
      + '<span>−' + ESTADO.historial.length + ' créditos gastados en total</span>'
      + '</div></div>';
  
    // Filas de historial
    var filasHtml = ESTADO.historial.map(function(h) {
      return '<div class="historial-row">'
        + '<div class="hist-accion-emoji">' + (h.accionEmoji || '🔹') + '</div>'
        + '<div class="hist-info">'
        +   '<div class="hist-nombre">' + h.nombre + '</div>'
        +   '<div class="hist-oficio">' + h.oficio + '</div>'
        + '</div>'
        + '<div class="hist-accion-label">' + (h.accionLabel || 'Ver Contacto') + '</div>'
        + '<div class="hist-contacto" style="' + (h.accionId === 'ver_contacto' ? '' : 'display:none') + '">'
        +   '💬 ' + (h.whatsapp || '—')
        + '</div>'
        + '<div class="hist-fecha">' + h.fecha + ' · ' + h.hora + '</div>'
        + '<div class="hist-costo">🪙 −' + (h.costo || 1) + '</div>'
        + '</div>';
    }).join('');
  
    container.innerHTML = resumenHtml + filasHtml;
  }
  
  // ── TABS DASHBOARD ────────────────────────────────────────────
  function configurarTabsDashboard() {
    document.querySelectorAll('.dash-tab').forEach(function(tab) {
      tab.addEventListener('click', function() { activarTabDash(tab.dataset.tab); });
    });
  }
  
  function activarTabDash(nombre) {
    document.querySelectorAll('.dash-tab').forEach(function(t)  { t.classList.remove('active'); });
    document.querySelectorAll('.dash-panel').forEach(function(p){ p.classList.remove('active'); });
    var btn   = document.querySelector('.dash-tab[data-tab="' + nombre + '"]');
    var panel = document.getElementById('dash-' + nombre);
    if (btn)   btn.classList.add('active');
    if (panel) panel.classList.add('active');
    history.replaceState(null, '', '#' + nombre);
  }
  
  // ── PACKS EN DASHBOARD ────────────────────────────────────────
  function renderPacksDashboard() {
    var container = document.getElementById('packs-dashboard-container');
    if (!container) return;
    renderPacks('packs-dashboard-container', 'comprarCreditosDash');
  }
  
  function comprarCreditosDash(cantidad, precio) {
    agregarCreditos(cantidad);
    sincronizarWallet();
    setTxt('wallet-saldo-main', getCreditos());
    setTxt('stat-creditos',     getCreditos());
    setTxt('stat-acciones',     ESTADO.historial.length);
    mostrarToast('🎉 ¡' + cantidad + ' créditos añadidos! Nuevo saldo: ' + getCreditos(), 'verde');
  }
  
  // ══════════════════════════════════════════════════════════════
  //  MI PERFIL (trabajador)
  // ══════════════════════════════════════════════════════════════
  
  function initMiPerfil() {
    cargarEstado();
    if (!ESTADO.autenticado) { window.location.href = 'index.html'; return; }
    marcarNavActivo();
    sincronizarWallet();
  
    var t = TRABAJADORES.find(function(x) { return x.id === 1; });
    if (!t) return;
  
    var estadoInfo = getEstadoTrabajador(t);
  
    setTxt('mp-nombre', t.nombre);
    setTxt('mp-oficio', '🔧 ' + t.oficio);
    setTxt('mp-zona',   '📍 ' + t.zona);
    setTxt('mp-desc',   t.descripcion);
    setTxt('mp-exp',    t.exp + ' años de experiencia');
    setTxt('mp-emoji',  t.emoji);
  
    var estadoEl = document.getElementById('mp-estado');
    if (estadoEl) {
      estadoEl.textContent = estadoInfo.label;
      estadoEl.className   = 'estado-badge ' + estadoInfo.badge;
    }
  
    var starsEl = document.getElementById('mp-stars');
    if (starsEl) starsEl.innerHTML = renderEstrellas(t.rating);
  
    // Habilidades
    var habsEl = document.getElementById('mp-habilidades');
    if (habsEl) habsEl.innerHTML = t.habilidades.map(function(h) {
      return '<span class="chip chip-big" style="cursor:pointer" title="Clic para eliminar" onclick="this.remove()">' + h + ' ✕</span>';
    }).join('');
  
    // Documentos del trabajador
    var docsEl = document.getElementById('mp-documentos');
    if (docsEl && t.documentos) {
      docsEl.innerHTML = t.documentos.map(function(d) {
        return '<div class="doc-card">'
          + '<div class="doc-icon">' + d.icono + '</div>'
          + '<div class="doc-info">'
          +   '<div class="doc-nombre">' + d.nombre + '</div>'
          +   '<div class="doc-tipo">' + d.tipo + '</div>'
          +   '<div class="doc-fecha">📅 ' + d.fecha + '</div>'
          + '</div>'
          + '<span class="chip chip-cert" style="flex-shrink:0">✅ Verificado</span>'
          + '</div>';
      }).join('');
    }
  
    // Proyectos
    var proyEl = document.getElementById('mp-proyectos');
    if (proyEl) proyEl.innerHTML = t.proyectos.map(function(p) {
      return '<div class="proyecto-card">'
        + '<div class="proyecto-icon">🏗️</div>'
        + '<div class="proyecto-info">'
        +   '<div class="proyecto-nombre">' + p.nombre + '</div>'
        +   '<div class="proyecto-meta"><strong>' + p.rol + '</strong> · ' + p.empresa + '</div>'
        +   '<div class="proyecto-año">📅 ' + p.año + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
  
    // Estado de disponibilidad (3 estados)
    marcarDispActual(t.estado);
  }
  
  function marcarDispActual(estado) {
    document.querySelectorAll('.disp-btn').forEach(function(b) { b.classList.remove('active'); });
    var btn = document.querySelector('.disp-btn[data-estado="' + estado + '"]');
    if (btn) btn.classList.add('active');
  }
  
  function setDisp(btn, val) {
    document.querySelectorAll('.disp-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var badge = document.getElementById('mp-estado');
    var info  = ESTADOS_TRABAJADOR[val] || ESTADOS_TRABAJADOR.disponible;
    if (badge) {
      badge.textContent = info.label;
      badge.className   = 'estado-badge ' + info.badge;
    }
    var msgs = {
      disponible:     '✅ Ahora apareces como Disponible para las empresas.',
      limitado:       '◐ Ahora apareces con Disponibilidad Limitada.',
      no_disponible:  '🔴 Ahora apareces como No Disponible. No recibirás contactos.',
    };
    mostrarToast(msgs[val] || '✅ Estado actualizado.', 'verde');
  }
  
  // ══════════════════════════════════════════════════════════════
  //  UTILIDADES
  // ══════════════════════════════════════════════════════════════
  
  function setTxt(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  
  function renderEstrellas(n) {
    return '⭐'.repeat(n) + '<span style="opacity:.3">☆</span>'.repeat(5 - n);
  }