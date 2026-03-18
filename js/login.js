// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — login.js
//  Lógica de inicio de sesión
// ═══════════════════════════════════════════════════════════════

let tipoSeleccionado = 'empresa';

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  cargarEstado();
  // Si ya está autenticado, redirigir
  if (ESTADO.autenticado) {
    redirigirPorTipo(ESTADO.tipoUsuario);
    return;
  }
  seleccionarTipo('empresa');
  configurarFormulario();
  configurarTablas();
  animarEntrada();
});

// ── SELECCIÓN DE TIPO ─────────────────────────────────────────
function seleccionarTipo(tipo) {
  tipoSeleccionado = tipo;

  document.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tipo === tipo);
  });

  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');

  if (tipo === 'empresa') {
    emailInput.placeholder = 'correo@tuempresa.com';
    document.getElementById('label-email').textContent = '📧 Correo de la empresa';
    document.getElementById('demo-hint').innerHTML =
      `<span class="hint-label">Demo rápido:</span>
       <button type="button" class="demo-btn" onclick="loginDemo('empresa')">🏢 Entrar como Empresa</button>`;
  } else {
    emailInput.placeholder = 'tu.correo@gmail.com';
    document.getElementById('label-email').textContent = '📧 Tu correo';
    document.getElementById('demo-hint').innerHTML =
      `<span class="hint-label">Demo rápido:</span>
       <button type="button" class="demo-btn" onclick="loginDemo('trabajador')">👷 Entrar como Trabajador</button>`;
  }
}

// ── CONFIGURAR FORMULARIO ─────────────────────────────────────
function configurarFormulario() {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    intentarLogin();
  });

  // Enter en campos
  ['email', 'password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') intentarLogin();
    });
  });

  // Toggle contraseña visible
  document.getElementById('toggle-pass').addEventListener('click', () => {
    const input = document.getElementById('password');
    const icon = document.getElementById('toggle-icon');
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁️';
    }
  });
}

// ── CONFIGURAR TABS ───────────────────────────────────────────
function configurarTablas() {
  document.querySelectorAll('.tipo-btn').forEach(btn => {
    btn.addEventListener('click', () => seleccionarTipo(btn.dataset.tipo));
  });
}

// ── INTENTAR LOGIN ────────────────────────────────────────────
function intentarLogin() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  const pass  = document.getElementById('password').value;
  const btn   = document.getElementById('btn-login');

  // Limpiar error
  mostrarError('');

  if (!email || !pass) {
    mostrarError('⚠️ Ingresa tu correo y contraseña.');
    return;
  }

  // Estado de carga
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Ingresando...';

  setTimeout(() => {
    const cuenta = CUENTAS[email];

    if (!cuenta) {
      mostrarError('❌ Correo no encontrado. Usa las cuentas demo.');
      btn.disabled = false;
      btn.innerHTML = '🔐 Ingresar';
      return;
    }

    if (cuenta.pass !== pass) {
      mostrarError('❌ Contraseña incorrecta. Intenta de nuevo.');
      document.getElementById('password').value = '';
      btn.disabled = false;
      btn.innerHTML = '🔐 Ingresar';
      sacudirFormulario();
      return;
    }

    // Login exitoso
    ESTADO.autenticado  = true;
    ESTADO.tipoUsuario  = cuenta.tipo;
    ESTADO.nombreUsuario = cuenta.nombre;
    ESTADO.userId       = cuenta.id;
    // No resetear créditos si ya hay estado guardado
    if (!ESTADO.creditos && ESTADO.creditos !== 0) ESTADO.creditos = 10;
    guardarEstado();

    btn.innerHTML = '✅ ¡Bienvenido!';
    btn.style.background = 'var(--verde)';

    setTimeout(() => redirigirPorTipo(cuenta.tipo), 700);
  }, 800);
}

// ── LOGIN DEMO ────────────────────────────────────────────────
function loginDemo(tipo) {
  seleccionarTipo(tipo);
  const email = tipo === 'empresa' ? 'empresa@demo.com' : 'trabajador@demo.com';
  document.getElementById('email').value    = email;
  document.getElementById('password').value = '1234';
  setTimeout(() => intentarLogin(), 200);
}

// ── REDIRIGIR ─────────────────────────────────────────────────
function redirigirPorTipo(tipo) {
  if (tipo === 'empresa')    window.location.href = 'feed.html';
  else                       window.location.href = 'mi-perfil.html';
}

// ── HELPERS ──────────────────────────────────────────────────
function mostrarError(msg) {
  const el = document.getElementById('login-error');
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function sacudirFormulario() {
  const card = document.querySelector('.login-card');
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

function animarEntrada() {
  const card = document.querySelector('.login-card');
  if (card) { card.style.opacity = '0'; card.style.transform = 'translateY(30px)'; }
  setTimeout(() => {
    if (card) { card.style.transition = 'all .5s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }
  }, 100);
}