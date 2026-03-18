// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — registro.js  v1.0
//  Lógica de registro multi-paso para empresa y trabajador
// ═══════════════════════════════════════════════════════════════

// ── ESTADO DEL REGISTRO ───────────────────────────────────────
var REG = {
    tipo:       null,   // 'empresa' | 'trabajador'
    pasoEmpresa: 1,
    pasoTrabajador: 1,
    avatarSeleccionado: '👷',
    dispSeleccionada: 'disponible',
  
    // Datos empresa
    empresa: {},
  
    // Datos trabajador
    trabajador: {},
  };
  
  // ── INIT ──────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    cargarEstado();
    // Si ya está autenticado redirigir
    if (ESTADO.autenticado) {
      redirigirTras(ESTADO.tipoUsuario);
      return;
    }
    mostrarPasoTipo();
  });
  
  // ── SELECCIÓN DE TIPO ─────────────────────────────────────────
  function seleccionarTipoReg(tipo) {
    REG.tipo = tipo;
    document.getElementById('paso-tipo').style.display      = 'none';
    document.getElementById('link-login-bottom').style.display = 'none';
  
    if (tipo === 'empresa') {
      document.getElementById('form-empresa').style.display    = 'block';
      document.getElementById('form-trabajador').style.display = 'none';
      irPasoEmpresa(1);
    } else {
      document.getElementById('form-empresa').style.display    = 'none';
      document.getElementById('form-trabajador').style.display = 'block';
      irPasoTrabajador(1);
    }
  }
  
  function volverATipos() {
    REG.tipo = null;
    mostrarPasoTipo();
  }
  
  function mostrarPasoTipo() {
    document.getElementById('paso-tipo').style.display         = 'block';
    document.getElementById('form-empresa').style.display      = 'none';
    document.getElementById('form-trabajador').style.display   = 'none';
    document.getElementById('reg-exito').style.display         = 'none';
    document.getElementById('link-login-bottom').style.display = 'block';
  }
  
  // ═══════════════════════════════════════════════════════════════
  //  FLUJO EMPRESA (3 pasos)
  // ═══════════════════════════════════════════════════════════════
  
  function irPasoEmpresa(n) {
    REG.pasoEmpresa = n;
    for (var i = 1; i <= 3; i++) {
      var paso = document.getElementById('paso-e-' + i);
      var prog = document.getElementById('prog-e-' + i);
      if (paso) paso.style.display = (i === n) ? 'block' : 'none';
      if (prog) {
        prog.classList.toggle('active',    i === n);
        prog.classList.toggle('completado', i < n);
      }
    }
    limpiarError('error-empresa');
  }
  
  function siguientePasoEmpresa(pasoActual) {
    limpiarError('error-empresa');
  
    if (pasoActual === 1) {
      var nombre         = val('e-nombre');
      var ruc            = val('e-ruc');
      var representante  = val('e-representante');
      var cargo          = val('e-cargo');
  
      if (!nombre)        { mostrarErrorForm('error-empresa', '⚠️ Ingresa la razón social de tu empresa.'); return; }
      if (!ruc || ruc.length !== 11 || !/^\d+$/.test(ruc)) {
        mostrarErrorForm('error-empresa', '⚠️ El RUC debe tener exactamente 11 dígitos numéricos.'); return;
      }
      if (!representante) { mostrarErrorForm('error-empresa', '⚠️ Ingresa el nombre del representante legal.'); return; }
      if (!cargo)         { mostrarErrorForm('error-empresa', '⚠️ Ingresa el cargo del representante.'); return; }
  
      // Guardar datos parciales
      REG.empresa.nombre        = nombre;
      REG.empresa.ruc           = ruc;
      REG.empresa.representante = representante;
      REG.empresa.cargo         = cargo;
      REG.empresa.sector        = val('e-sector');
      REG.empresa.tamaño        = val('e-tamaño');
      REG.empresa.ubicacion     = val('e-ubicacion');
  
      irPasoEmpresa(2);
  
    } else if (pasoActual === 2) {
      var email    = val('e-email');
      var telefono = val('e-telefono');
  
      if (!email || !email.includes('@')) {
        mostrarErrorForm('error-empresa', '⚠️ Ingresa un correo electrónico válido.'); return;
      }
      // Verificar si el correo ya existe
      if (CUENTAS[email.toLowerCase()]) {
        mostrarErrorForm('error-empresa', '❌ Este correo ya está registrado. Inicia sesión.'); return;
      }
      if (!telefono) {
        mostrarErrorForm('error-empresa', '⚠️ Ingresa un teléfono de contacto.'); return;
      }
  
      REG.empresa.email    = email.toLowerCase();
      REG.empresa.telefono = telefono;
      REG.empresa.web      = val('e-web');
      REG.empresa.desc     = val('e-desc');
  
      irPasoEmpresa(3);
    }
  }
  
  function registrarEmpresa() {
    limpiarError('error-empresa');
  
    var pass  = val('e-pass');
    var pass2 = val('e-pass2');
    var terms = document.getElementById('e-terminos').checked;
  
    if (!pass || pass.length < 6) {
      mostrarErrorForm('error-empresa', '⚠️ La contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (pass !== pass2) {
      mostrarErrorForm('error-empresa', '❌ Las contraseñas no coinciden.'); return;
    }
    if (!terms) {
      mostrarErrorForm('error-empresa', '⚠️ Debes aceptar los términos de uso para continuar.'); return;
    }
  
    // Animación carga
    var btn = document.getElementById('btn-reg-empresa');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creando cuenta…';
  
    setTimeout(function() {
      // Guardar nueva cuenta en CUENTAS (memoria de sesión)
      var id = 'e_' + Date.now();
      CUENTAS[REG.empresa.email] = {
        pass:   pass,
        tipo:   'empresa',
        nombre: REG.empresa.nombre,
        id:     id,
      };
  
      // Auto-login
      ESTADO.autenticado   = true;
      ESTADO.tipoUsuario   = 'empresa';
      ESTADO.nombreUsuario = REG.empresa.nombre;
      ESTADO.userId        = id;
      ESTADO.creditos      = 5; // créditos de bienvenida
      guardarEstado();
  
      mostrarExito('empresa', REG.empresa.nombre);
    }, 1200);
  }
  
  // ═══════════════════════════════════════════════════════════════
  //  FLUJO TRABAJADOR (3 pasos)
  // ═══════════════════════════════════════════════════════════════
  
  function irPasoTrabajador(n) {
    REG.pasoTrabajador = n;
    for (var i = 1; i <= 3; i++) {
      var paso = document.getElementById('paso-t-' + i);
      var prog = document.getElementById('prog-t-' + i);
      if (paso) paso.style.display = (i === n) ? 'block' : 'none';
      if (prog) {
        prog.classList.toggle('active',    i === n);
        prog.classList.toggle('completado', i < n);
      }
    }
    limpiarError('error-trabajador');
    if (n === 3) renderPreviewTrabajador();
  }
  
  function siguientePasoTrabajador(pasoActual) {
    limpiarError('error-trabajador');
  
    if (pasoActual === 1) {
      var nombre   = val('t-nombre');
      var dni      = val('t-dni');
      var whatsapp = val('t-whatsapp');
      var zona     = val('t-zona');
  
      if (!nombre)           { mostrarErrorForm('error-trabajador', '⚠️ Ingresa tu nombre completo.'); return; }
      if (!dni || dni.length !== 8 || !/^\d+$/.test(dni)) {
        mostrarErrorForm('error-trabajador', '⚠️ El DNI debe tener exactamente 8 dígitos.'); return;
      }
      if (!whatsapp)         { mostrarErrorForm('error-trabajador', '⚠️ Ingresa tu número de WhatsApp.'); return; }
      if (!zona)             { mostrarErrorForm('error-trabajador', '⚠️ Ingresa la zona donde trabajas.'); return; }
  
      REG.trabajador.nombre   = nombre;
      REG.trabajador.dni      = dni;
      REG.trabajador.whatsapp = whatsapp;
      REG.trabajador.zona     = zona;
      REG.trabajador.avatar   = REG.avatarSeleccionado;
  
      irPasoTrabajador(2);
  
    } else if (pasoActual === 2) {
      var oficio = val('t-oficio');
      var exp    = val('t-exp');
  
      if (!oficio) { mostrarErrorForm('error-trabajador', '⚠️ Selecciona tu oficio principal.'); return; }
      if (!exp || isNaN(exp) || parseInt(exp) < 0) {
        mostrarErrorForm('error-trabajador', '⚠️ Ingresa los años de experiencia (puede ser 0).'); return;
      }
  
      REG.trabajador.oficio       = oficio;
      REG.trabajador.exp          = parseInt(exp);
      REG.trabajador.disponibilidad = REG.dispSeleccionada;
      REG.trabajador.habilidades  = parsearHabilidades(val('t-habilidades'));
      REG.trabajador.desc         = val('t-desc');
  
      // Determinar categoría según oficio
      REG.trabajador.categoria = detectarCategoria(oficio);
  
      irPasoTrabajador(3);
    }
  }
  
  function registrarTrabajador() {
    limpiarError('error-trabajador');
  
    var email = val('t-email');
    var pass  = val('t-pass');
    var pass2 = val('t-pass2');
    var terms = document.getElementById('t-terminos').checked;
  
    if (!email || !email.includes('@')) {
      mostrarErrorForm('error-trabajador', '⚠️ Ingresa un correo electrónico válido.'); return;
    }
    if (CUENTAS[email.toLowerCase()]) {
      mostrarErrorForm('error-trabajador', '❌ Este correo ya está registrado. Inicia sesión.'); return;
    }
    if (!pass || pass.length < 6) {
      mostrarErrorForm('error-trabajador', '⚠️ La contraseña debe tener al menos 6 caracteres.'); return;
    }
    if (pass !== pass2) {
      mostrarErrorForm('error-trabajador', '❌ Las contraseñas no coinciden.'); return;
    }
    if (!terms) {
      mostrarErrorForm('error-trabajador', '⚠️ Debes aceptar los términos de uso para continuar.'); return;
    }
  
    var btn = document.getElementById('btn-reg-trabajador');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creando perfil…';
  
    setTimeout(function() {
      var id = 't_' + Date.now();
      REG.trabajador.email = email.toLowerCase();
  
      // Guardar cuenta
      CUENTAS[email.toLowerCase()] = {
        pass:   pass,
        tipo:   'trabajador',
        nombre: REG.trabajador.nombre,
        id:     id,
      };
  
      // Agregar al array de trabajadores (sesión)
      var nuevoTrabajador = {
        id:          TRABAJADORES.length + 100,
        nombre:      REG.trabajador.nombre,
        oficio:      REG.trabajador.oficio,
        categoria:   REG.trabajador.categoria,
        zona:        REG.trabajador.zona,
        exp:         REG.trabajador.exp,
        rating:      0,
        reseñas_count: 0,
        estado:      REG.trabajador.disponibilidad,
        whatsapp:    REG.trabajador.whatsapp.replace(/\s/g,''),
        whatsapp_display: REG.trabajador.whatsapp,
        email:       REG.trabajador.email,
        habilidades: REG.trabajador.habilidades,
        descripcion: REG.trabajador.desc || 'Trabajador recién registrado en Construlinker.',
        emoji:       REG.trabajador.avatar,
        color:       coloresCategoria(REG.trabajador.categoria),
        documentos:  [],
        proyectos:   [],
        reseñas:     [],
        nuevo:       true,
      };
      TRABAJADORES.push(nuevoTrabajador);
  
      // Auto-login
      ESTADO.autenticado   = true;
      ESTADO.tipoUsuario   = 'trabajador';
      ESTADO.nombreUsuario = REG.trabajador.nombre;
      ESTADO.userId        = id;
      ESTADO.creditos      = 0;
      guardarEstado();
  
      mostrarExito('trabajador', REG.trabajador.nombre);
    }, 1200);
  }
  
  // ── PREVIEW TRABAJADOR (paso 3) ───────────────────────────────
  function renderPreviewTrabajador() {
    var el = document.getElementById('t-preview');
    if (!el) return;
    var t = REG.trabajador;
    var estadoInfo = ESTADOS_TRABAJADOR[t.disponibilidad] || ESTADOS_TRABAJADOR.disponible;
  
    el.innerHTML =
      '<div class="preview-header">'
      + '<div class="preview-avatar">' + (t.avatar || '👷') + '</div>'
      + '<div class="preview-info">'
      +   '<div class="preview-nombre">' + (t.nombre || '—') + '</div>'
      +   '<div class="preview-oficio">' + (t.oficio || '—') + '</div>'
      +   '<div style="display:flex;gap:8px;margin-top:5px;flex-wrap:wrap">'
      +     '<span class="badge-estado ' + estadoInfo.badge + '" style="font-size:.72rem">' + estadoInfo.label + '</span>'
      +     '<span style="font-size:.8rem;color:var(--gris-med)">📍 ' + (t.zona || '—') + '</span>'
      +     '<span style="font-size:.8rem;color:var(--gris-med)">📅 ' + (t.exp || 0) + ' años</span>'
      +   '</div>'
      + '</div>'
      + '</div>'
      + '<div class="preview-label">Así te verán las empresas 👆</div>';
  }
  
  // ── ÉXITO ─────────────────────────────────────────────────────
  function mostrarExito(tipo, nombre) {
    document.getElementById('form-empresa').style.display    = 'none';
    document.getElementById('form-trabajador').style.display = 'none';
    document.getElementById('link-login-bottom').style.display = 'none';
  
    var exito = document.getElementById('reg-exito');
    exito.style.display = 'block';
  
    if (tipo === 'empresa') {
      document.getElementById('exito-ico').textContent    = '🏢';
      document.getElementById('exito-titulo').textContent = '¡Cuenta de empresa creada!';
      document.getElementById('exito-sub').textContent    = 'Bienvenida a Construlinker, ' + nombre;
      document.getElementById('exito-creditos').style.display = 'flex';
      document.getElementById('btn-exito').textContent    = '🔍 Ir a buscar trabajadores';
    } else {
      document.getElementById('exito-ico').textContent    = '👷';
      document.getElementById('exito-titulo').textContent = '¡Perfil creado con éxito!';
      document.getElementById('exito-sub').textContent    = 'Bienvenido a Construlinker, ' + nombre;
      document.getElementById('exito-creditos').style.display = 'none';
      document.getElementById('btn-exito').textContent    = '👤 Ver mi perfil';
    }
  
    // Animación confetti simple
    animarExito();
  }
  
  function irAlApp() {
    if (ESTADO.tipoUsuario === 'empresa')    window.location.href = 'feed.html';
    else                                     window.location.href = 'mi-perfil.html';
  }
  
  function animarExito() {
    var exito = document.getElementById('exito-ico');
    if (!exito) return;
    exito.style.animation = 'none';
    void exito.offsetWidth;
    exito.style.animation = 'bounce 0.6s ease 3';
  }
  
  // ── HELPERS UI ────────────────────────────────────────────────
  function seleccionarAvatar(el, emoji) {
    document.querySelectorAll('.avatar-opt').forEach(function(o) { o.classList.remove('active'); });
    el.classList.add('active');
    REG.avatarSeleccionado = emoji;
  }
  
  function seleccionarDisp(el) {
    document.querySelectorAll('.disp-reg-opt').forEach(function(o) { o.classList.remove('active'); });
    el.classList.add('active');
    REG.dispSeleccionada = el.dataset.val;
  }
  
  function togglePass(inputId, iconId) {
    var input = document.getElementById(inputId);
    var icon  = document.getElementById(iconId);
    if (!input || !icon) return;
    if (input.type === 'password') { input.type = 'text';     icon.textContent = '🙈'; }
    else                           { input.type = 'password'; icon.textContent = '👁️'; }
  }
  
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  
  function mostrarErrorForm(id, msg) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    // Scroll hacia el error
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  function limpiarError(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }
  
  // ── HELPERS DATOS ─────────────────────────────────────────────
  function parsearHabilidades(str) {
    if (!str) return [];
    return str.split(',').map(function(h) { return h.trim(); }).filter(function(h) { return h.length > 0; }).slice(0, 6);
  }
  
  function detectarCategoria(oficio) {
    var map = {
      'Albañil': 'Obra Gruesa', 'Encofrador': 'Obra Gruesa', 'Ferrallista': 'Obra Gruesa',
      'Yesero': 'Obra Gruesa', 'Peón': 'Obra Gruesa',
      'Pintor': 'Acabados', 'Solador': 'Acabados', 'Alicatador': 'Acabados',
      'Pladur': 'Acabados', 'Pavimentos': 'Acabados', 'Piedra': 'Acabados',
      'Cristalero': 'Acabados', 'Rehabilitador': 'Acabados',
      'Electricista': 'Instalaciones', 'Fontanero': 'Instalaciones',
      'Climatización': 'Instalaciones', 'Gas': 'Instalaciones',
      'Solar': 'Instalaciones', 'Soldador': 'Instalaciones',
      'Gruista': 'Maquinaria y Transporte', 'Maquinaria': 'Maquinaria y Transporte',
      'Andamios': 'Maquinaria y Transporte', 'Transportista': 'Maquinaria y Transporte',
      'Hormigonera': 'Maquinaria y Transporte',
      'Arquitecto': 'Técnicos y Gestión', 'Ingeniero': 'Técnicos y Gestión',
      'Jefe de Obra': 'Técnicos y Gestión', 'Encargado': 'Técnicos y Gestión',
      'PRL': 'Técnicos y Gestión', 'Topógrafo': 'Técnicos y Gestión',
      'Auxiliar': 'Auxiliares', 'Almacén': 'Auxiliares',
      'Logística': 'Auxiliares', 'Limpieza': 'Auxiliares',
    };
    for (var key in map) {
      if (oficio.includes(key)) return map[key];
    }
    return 'Auxiliares';
  }
  
  function coloresCategoria(cat) {
    var colores = {
      'Obra Gruesa':          '#FFB800',
      'Acabados':             '#27AE60',
      'Instalaciones':        '#2980B9',
      'Maquinaria y Transporte': '#E67E22',
      'Técnicos y Gestión':   '#8E44AD',
      'Auxiliares':           '#7F8C8D',
    };
    return colores[cat] || '#FFB800';
  }
  
  function redirigirTras(tipo) {
    if (tipo === 'empresa') window.location.href = 'feed.html';
    else                    window.location.href = 'mi-perfil.html';
  }