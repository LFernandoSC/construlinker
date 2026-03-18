// ═══════════════════════════════════════════════════════════════
//  CONSTRULINKER — app.js  v2.0
//  Estado global, datos, créditos, semáforo, 6 acciones
// ═══════════════════════════════════════════════════════════════

// ── CUENTAS DEMO ─────────────────────────────────────────────
const CUENTAS = {
    'empresa@demo.com':    { pass: '1234', tipo: 'empresa',    nombre: 'Constructora Andina SAC',  id: 'e1' },
    'trabajador@demo.com': { pass: '1234', tipo: 'trabajador', nombre: 'Carlos Ramos Huanca',      id: 't1' },
  };
  
  // ── EMPRESA DEMO ─────────────────────────────────────────────
  const EMPRESA_DEMO = {
    id: 'e1',
    nombre: 'Constructora Inmobiliaria Andina S.A.C.',
    ruc: '20512345678',
    representante: 'Ing. Roberto Medina Soto',
    cargo: 'Gerente de Operaciones',
    email: 'empresa@demo.com',
    telefono: '+51 01 234-5678',
    web: 'www.constructoraandina.pe',
    ubicacion: 'San Isidro, Lima',
    descripcion: 'Empresa líder en construcción residencial y comercial con más de 15 años de experiencia en el mercado peruano. Ejecutamos proyectos de alta envergadura con estándares internacionales de calidad.',
    especialidades: ['Edificios Multifamiliares', 'Centros Comerciales', 'Infraestructura Vial', 'Habilitaciones Urbanas'],
    proyectosActivos: 7,
    proyectosCompletados: 47,
    trabajadoresContratados: 312,
    fundacion: 2008,
    empleados: '50-200',
    certificaciones: ['ISO 9001:2015', 'OHSAS 18001', 'Registro OSCE Categoría A'],
    emoji: '🏢',
  };
  
  // ── PACKS DE CRÉDITOS (precios reales del PDF) ────────────────
  const PACKS_CREDITOS = [
    {
      id: 'pack-1',
      creditos: 1,
      precio: 5,
      moneda: 'S/.',
      label: '1 Crédito',
      descripcion: 'Necesidades puntuales',
      validez: '12 meses',
      emoji: '🪙',
      popular: false,
      bonus: null,
    },
    {
      id: 'pack-20',
      creditos: 20,
      precio: 59,
      moneda: 'S/.',
      label: 'Pack 20',
      descripcion: 'Reformistas y pequeñas subcontratas',
      validez: '12 meses',
      emoji: '💼',
      popular: false,
      bonus: null,
    },
    {
      id: 'pack-50',
      creditos: 50,
      precio: 149,
      moneda: 'S/.',
      label: 'Pack 50',
      descripcion: 'Empresas con rotación mensual',
      validez: '12 meses',
      emoji: '💰',
      popular: true,
      bonus: null,
    },
    {
      id: 'pack-200',
      creditos: 200,
      precio: 499,
      moneda: 'S/.',
      label: 'Pack 200',
      descripcion: 'Constructoras medianas y grandes',
      validez: '12 meses',
      emoji: '🏦',
      popular: false,
      bonus: '+10 créditos gratis',
    },
  ];
  
  // ── ACCIONES QUE CONSUMEN CRÉDITOS ───────────────────────────
  const ACCIONES = {
    VER_CONTACTO:       { id: 'ver_contacto',       label: 'Ver Contacto',            emoji: '📞', costo: 1 },
    DESCARGAR_DOC:      { id: 'descargar_doc',       label: 'Descargar Documentación', emoji: '📄', costo: 1 },
    ENVIAR_OFERTA:      { id: 'enviar_oferta',       label: 'Enviar Oferta Directa',   emoji: '📨', costo: 1 },
    VER_DISPONIBILIDAD: { id: 'ver_disponibilidad',  label: 'Ver Disponibilidad',      emoji: '📅', costo: 1 },
    PERFIL_COMPLETO:    { id: 'perfil_completo',     label: 'Perfil Completo',         emoji: '👤', costo: 1 },
    CANDIDATO_URGENTE:  { id: 'candidato_urgente',   label: 'Candidato Urgente',       emoji: '⚡', costo: 1 },
  };
  
  // ── SEMÁFORO DE CRÉDITOS ──────────────────────────────────────
  const SEMAFORO_NIVELES = {
    vacio:    { clase: 'semaforo-vacio',    msg: '⛔ No tienes créditos. Compra un pack para continuar contactando trabajadores.' },
    critico:  { clase: 'semaforo-critico',  msg: '⛔ Último crédito disponible. Compra un pack antes de quedarte sin acceso a candidatos.' },
    bajo:     { clase: 'semaforo-bajo',     msg: '⚠️ Solo te quedan {n} créditos. Puedes quedarte sin acceso pronto.' },
    precauto: { clase: 'semaforo-precauto', msg: '💡 Te quedan {n} créditos. Compra un pack para evitar interrupciones.' },
    normal:   { clase: 'semaforo-normal',   msg: '' },
  };
  
  // ── ESTADOS DEL TRABAJADOR (3 estados según reglas) ──────────
  const ESTADOS_TRABAJADOR = {
    disponible:    { label: '● Disponible',              clase: 'estado-disponible',    badge: 'badge-disponible' },
    limitado:      { label: '◐ Disponibilidad Limitada', clase: 'estado-limitado',      badge: 'badge-limitado'   },
    no_disponible: { label: '● No Disponible',           clase: 'estado-no-disponible', badge: 'badge-no-disponible' },
  };
  
  // ── TRABAJADORES ─────────────────────────────────────────────
  const TRABAJADORES = [
    {
      id: 1,
      nombre: 'Carlos Ramos Huanca',
      oficio: 'Albañil Oficial de Primera',
      categoria: 'Obra Gruesa',
      zona: 'San Juan de Lurigancho',
      exp: 12,
      rating: 5,
      reseñas_count: 18,
      estado: 'disponible',
      whatsapp: '+51987654321',
      whatsapp_display: '+51 987 654 321',
      email: 'c.ramos@gmail.com',
      habilidades: ['Tarrajeo', 'Encofrado', 'Muros portantes', 'Concreto armado', 'Nivelación'],
      descripcion: 'Albañil con 12 años de experiencia en obras de mediana y gran envergadura en Lima Metropolitana. Especializado en tarrajeo fino, encofrado metálico y construcción de muros portantes con concreto armado.',
      emoji: '👷',
      color: '#FFB800',
      documentos: [
        { tipo: 'PRL',  nombre: 'Certificado PRL 2024',  fecha: 'Enero 2024',      icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',       fecha: 'Actualizado 2024', icono: '📋' },
        { tipo: 'CERT', nombre: 'Certificado SENCICO',    fecha: 'Marzo 2023',      icono: '🎓' },
      ],
      proyectos: [
        { nombre: 'Torres Residenciales El Sol – San Borja',       año: '2023-2024', rol: 'Oficial Albañil Jefe',  empresa: 'Inmobiliaria Líder SAC' },
        { nombre: 'Centro Comercial Plaza Mega – San Miguel',       año: '2022-2023', rol: 'Encofrador Principal',  empresa: 'Constructora Lima SA' },
        { nombre: 'Conjunto Residencial Las Palmas',                año: '2021',      rol: 'Albañil Oficial',       empresa: 'JRC Construcciones' },
      ],
      reseñas: [
        { autor: 'Constructora Lima S.A.',   cargo: 'Jefe de Obra',         cal: 5, texto: 'Excelente trabajador. Muy puntual, responsable y con gran conocimiento técnico. Lo volveríamos a contratar sin dudarlo.', fecha: 'Enero 2024' },
        { autor: 'Inmobiliaria del Pacífico', cargo: 'Residente de Obra',   cal: 5, texto: 'Trabajo impecable en el tarrajeo de los 120 departamentos. Terminó antes del plazo acordado.', fecha: 'Agosto 2023' },
        { autor: 'JRC Construcciones SAC',   cargo: 'Gerente de Proyectos', cal: 4, texto: 'Muy buen profesional. Conocimiento sólido y actitud colaborativa con el equipo.', fecha: 'Marzo 2023' },
      ],
    },
    {
      id: 2,
      nombre: 'Pedro Quispe Flores',
      oficio: 'Electricista de Obra',
      categoria: 'Instalaciones',
      zona: 'Los Olivos',
      exp: 8,
      rating: 5,
      reseñas_count: 14,
      estado: 'disponible',
      whatsapp: '+51976543210',
      whatsapp_display: '+51 976 543 210',
      email: 'p.quispe@gmail.com',
      habilidades: ['Tableros eléctricos', 'Cableado BT/AT', 'Instalaciones domiciliarias', 'Sistemas puesta a tierra', 'INDECI'],
      descripcion: 'Electricista con habilitación técnica y 8 años de experiencia en proyectos residenciales, comerciales e industriales. Certificado en normas EM.010 y capacitado en INDECI.',
      emoji: '⚡',
      color: '#F39C12',
      documentos: [
        { tipo: 'PRL',  nombre: 'Certificado PRL 2024',       fecha: 'Febrero 2024',    icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',             fecha: 'Actualizado 2024', icono: '📋' },
        { tipo: 'CERT', nombre: 'Habilitación Técnica MEM',     fecha: 'Vigente',          icono: '⚡' },
      ],
      proyectos: [
        { nombre: 'Edificio Corporativo Torre Lima – Miraflores', año: '2024',  rol: 'Electricista Jefe',             empresa: 'Techcorp Construcciones' },
        { nombre: 'Planta Industrial Lurín – Sector Logístico',   año: '2023',  rol: 'Jefe de Instalaciones Eléctricas', empresa: 'IESA Perú' },
      ],
      reseñas: [
        { autor: 'Techcorp Construcciones', cargo: 'Supervisor Eléctrico', cal: 5, texto: 'Conocimiento excepcional. Resolvió problemas complejos de tableros con rapidez y seguridad.', fecha: 'Febrero 2024' },
        { autor: 'IESA Perú SAC',           cargo: 'Gerente Técnico',      cal: 5, texto: 'Profesional de primer nivel. Entregó la instalación eléctrica completa sin observaciones.', fecha: 'Noviembre 2023' },
      ],
    },
    {
      id: 3,
      nombre: 'Jorge Mamani Coila',
      oficio: 'Fontanero / Instalador de Tuberías',
      categoria: 'Instalaciones',
      zona: 'Ate Vitarte',
      exp: 6,
      rating: 4,
      reseñas_count: 9,
      estado: 'limitado',
      whatsapp: '+51965432109',
      whatsapp_display: '+51 965 432 109',
      email: 'j.mamani@gmail.com',
      habilidades: ['Tuberías CPVC/HDPE', 'Red de desagüe', 'Instalaciones sanitarias', 'Redes contra incendio', 'Gas natural'],
      descripcion: 'Fontanero certificado con experiencia en instalaciones sanitarias y redes de gas natural. Actualmente en contrato parcial — disponible fines de semana y tardes.',
      emoji: '🔧',
      color: '#2980B9',
      documentos: [
        { tipo: 'PRL', nombre: 'Certificado PRL 2023', fecha: 'Junio 2023',       icono: '🦺' },
        { tipo: 'CV',  nombre: 'Currículum Vitae',      fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Hospital Regional Ate – Sector B', año: '2023', rol: 'Gasfitero Oficial', empresa: 'Constructora Salud Perú' },
      ],
      reseñas: [
        { autor: 'Constructora Salud Perú', cargo: 'Jefe de Proyecto', cal: 4, texto: 'Buen desempeño en las instalaciones sanitarias. Cumplió con los plazos establecidos.', fecha: 'Diciembre 2023' },
      ],
    },
    {
      id: 4,
      nombre: 'Luis Torres Condori',
      oficio: 'Gruista (Torre y Móvil)',
      categoria: 'Maquinaria y Transporte',
      zona: 'Callao',
      exp: 15,
      rating: 5,
      reseñas_count: 22,
      estado: 'no_disponible',
      whatsapp: '+51954321098',
      whatsapp_display: '+51 954 321 098',
      email: 'l.torres@gmail.com',
      habilidades: ['Grúa Torre Liebherr', 'Grúa Móvil Potain', 'Inspección ITM', 'Señalero Certificado', 'PETS/IPERC'],
      descripcion: 'Operador de grúa con 15 años de trayectoria y licencia ITM vigente. Experiencia en torres de más de 30 pisos. Certificado en seguridad OSHA.',
      emoji: '🏗️',
      color: '#E67E22',
      documentos: [
        { tipo: 'LIC',  nombre: 'Licencia ITM Vigente',    fecha: 'Vigente 2025',    icono: '🏗️' },
        { tipo: 'PRL',  nombre: 'Certificado OSHA 30h',    fecha: 'Marzo 2024',      icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',         fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Torre Empresarial Central Park – San Isidro', año: '2023-2024', rol: 'Operador Principal Grúa Torre', empresa: 'COSAPI SA' },
        { nombre: 'Condominio Ribera del Río – Surco',            año: '2022',      rol: 'Operador Grúa Móvil',           empresa: 'Graña y Montero' },
      ],
      reseñas: [
        { autor: 'COSAPI SA', cargo: 'Jefe de Equipos', cal: 5, texto: 'El mejor operador de grúa que hemos tenido. Precisión, seguridad y profesionalismo en cada maniobra.', fecha: 'Marzo 2024' },
      ],
    },
    {
      id: 5,
      nombre: 'Ana Villanueva Ríos',
      oficio: 'Arquitecta / Jefa de Obra',
      categoria: 'Técnicos y Gestión',
      zona: 'Miraflores',
      exp: 9,
      rating: 5,
      reseñas_count: 16,
      estado: 'disponible',
      whatsapp: '+51943210987',
      whatsapp_display: '+51 943 210 987',
      email: 'a.villanueva@gmail.com',
      habilidades: ['AutoCAD 2024', 'Revit BIM', 'S10 Presupuestos', 'Gestión de obra', 'Control de calidad', 'MS Project'],
      descripcion: 'Arquitecta colegiada con 9 años de experiencia en residencia y supervisión de obra. Manejo avanzado de BIM y herramientas de gestión de proyectos.',
      emoji: '📐',
      color: '#8E44AD',
      documentos: [
        { tipo: 'COLE', nombre: 'Colegiatura CAP Vigente',      fecha: 'Vigente 2025',    icono: '📐' },
        { tipo: 'PRL',  nombre: 'Coordinadora S&S en obra',      fecha: 'Enero 2024',      icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',               fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Proyecto VIS Los Jardines – Villa El Salvador', año: '2023-2024', rol: 'Arquitecta Residente', empresa: 'Ministerio de Vivienda' },
        { nombre: 'Hotel Boutique Barranco – Restauración',        año: '2022',      rol: 'Supervisora de Obra',  empresa: 'Inversiones Gastronómicas SAC' },
      ],
      reseñas: [
        { autor: 'Ministerio de Vivienda', cargo: 'Director de Proyectos', cal: 5, texto: 'Profesional de altísimo nivel. Excelente manejo del presupuesto y los plazos. Muy recomendada.', fecha: 'Junio 2024' },
      ],
    },
    {
      id: 6,
      nombre: 'Miguel Sánchez Vega',
      oficio: 'Pintor de Obra',
      categoria: 'Acabados',
      zona: 'San Isidro',
      exp: 7,
      rating: 4,
      reseñas_count: 11,
      estado: 'disponible',
      whatsapp: '+51932109876',
      whatsapp_display: '+51 932 109 876',
      email: 'm.sanchez@gmail.com',
      habilidades: ['Pintura látex', 'Barniz y esmalte', 'Drywall', 'Empastado fino', 'Pintura epóxica', 'Temple'],
      descripcion: 'Pintor especializado en acabados de alta calidad para proyectos residenciales y de oficinas. Manejo de sistemas epóxicos para pisos industriales.',
      emoji: '🎨',
      color: '#27AE60',
      documentos: [
        { tipo: 'PRL', nombre: 'Certificado PRL 2024', fecha: 'Mayo 2024',       icono: '🦺' },
        { tipo: 'CV',  nombre: 'Currículum Vitae',      fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Edificio Corporativo Pacífico – Surquillo', año: '2024', rol: 'Pintor Jefe', empresa: 'Multiprojects SA' },
      ],
      reseñas: [
        { autor: 'Multiprojects SA', cargo: 'Supervisor de Acabados', cal: 4, texto: 'Trabajo prolijo y terminado de primer nivel. Muy ordenado y respetuoso en el trato.', fecha: 'Mayo 2024' },
      ],
    },
    {
      id: 7,
      nombre: 'Rosa Condori Apaza',
      oficio: 'Auxiliar de Obra / Logística',
      categoria: 'Auxiliares',
      zona: 'Independencia',
      exp: 3,
      rating: 4,
      reseñas_count: 7,
      estado: 'disponible',
      whatsapp: '+51921098765',
      whatsapp_display: '+51 921 098 765',
      email: 'r.condori@gmail.com',
      habilidades: ['Acarreo de materiales', 'Mezclado de concreto', 'Limpieza de obra', 'Ayudante de encofrador', 'Señalización'],
      descripcion: 'Auxiliar de obra con 3 años de experiencia. Persona responsable y trabajadora. Manejo de almacén y logística básica de materiales de construcción.',
      emoji: '🦺',
      color: '#7F8C8D',
      documentos: [
        { tipo: 'PRL', nombre: 'Certificado PRL básico', fecha: 'Abril 2024',      icono: '🦺' },
        { tipo: 'CV',  nombre: 'Currículum Vitae',        fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Residencial Los Álamos – Independencia', año: '2024', rol: 'Auxiliar General', empresa: 'Constructora Norte SAC' },
      ],
      reseñas: [
        { autor: 'Constructora Norte SAC', cargo: 'Maestro de Obra', cal: 4, texto: 'Muy trabajadora y proactiva. Siempre dispuesta a apoyar en lo que se necesite.', fecha: 'Abril 2024' },
      ],
    },
    {
      id: 8,
      nombre: 'Antonio Pérez Lazo',
      oficio: 'Soldador Especializado en Obra',
      categoria: 'Maquinaria y Transporte',
      zona: 'Surco',
      exp: 11,
      rating: 5,
      reseñas_count: 19,
      estado: 'disponible',
      whatsapp: '+51910987654',
      whatsapp_display: '+51 910 987 654',
      email: 'a.perez@gmail.com',
      habilidades: ['Soldadura MIG', 'Soldadura TIG', 'Acero inoxidable', 'Aluminio', 'Habilitación metálica', 'Lectura de planos'],
      descripcion: 'Soldador certificado AWS con 11 años en estructuras metálicas, minería y construcción civil. Especializado en acero inoxidable y uniones de precisión.',
      emoji: '🔩',
      color: '#E74C3C',
      documentos: [
        { tipo: 'CERT', nombre: 'Certificación AWS D1.1',  fecha: 'Vigente 2025',    icono: '🔩' },
        { tipo: 'PRL',  nombre: 'Certificado PRL 2024',    fecha: 'Enero 2024',      icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',         fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Planta Minera Toquepala – Estructura de Soporte', año: '2023', rol: 'Soldador Senior', empresa: 'Southern Copper' },
        { nombre: 'Puente Peatonal La Molina',                        año: '2022', rol: 'Soldador Jefe',   empresa: 'MTC Infraestructura' },
      ],
      reseñas: [
        { autor: 'Southern Copper', cargo: 'Supervisor de Planta', cal: 5, texto: 'Calidad de soldadura excepcional. Cumple normas AWS al 100%. Muy recomendado.', fecha: 'Enero 2024' },
      ],
    },
    {
      id: 9,
      nombre: 'Fernando Huaylla Quispe',
      oficio: 'Encofrador',
      categoria: 'Obra Gruesa',
      zona: 'Villa El Salvador',
      exp: 10,
      rating: 5,
      reseñas_count: 13,
      estado: 'disponible',
      whatsapp: '+51909876543',
      whatsapp_display: '+51 909 876 543',
      email: 'f.huaylla@gmail.com',
      habilidades: ['Encofrado metálico', 'Encofrado madera', 'Losas aligeradas', 'Vigas y columnas', 'Lectura de planos'],
      descripcion: 'Encofrador con 10 años de experiencia en proyectos de gran envergadura. Especialista en encofrado metálico para edificios de hasta 20 pisos.',
      emoji: '🧱',
      color: '#795548',
      documentos: [
        { tipo: 'PRL',  nombre: 'Certificado PRL 2024',  fecha: 'Marzo 2024',      icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',       fecha: 'Actualizado 2024', icono: '📋' },
        { tipo: 'CERT', nombre: 'Certificado SENCICO',    fecha: 'Diciembre 2022',  icono: '🎓' },
      ],
      proyectos: [
        { nombre: 'Edificio Multifamiliar Torre Verde – Barranco', año: '2024', rol: 'Encofrador Jefe',    empresa: 'Inmobiliaria Sur SAC' },
        { nombre: 'Centro Empresarial Lima Norte',                  año: '2023', rol: 'Encofrador Oficial', empresa: 'JRC Construcciones' },
      ],
      reseñas: [
        { autor: 'Inmobiliaria Sur SAC', cargo: 'Residente de Obra', cal: 5, texto: 'Excelente encofrador. Muy prolijo y rápido. El trabajo quedó perfecto.', fecha: 'Abril 2024' },
      ],
    },
    {
      id: 10,
      nombre: 'Carmen Paucar Llanos',
      oficio: 'Técnico en Prevención de Riesgos (PRL)',
      categoria: 'Técnicos y Gestión',
      zona: 'San Miguel',
      exp: 7,
      rating: 5,
      reseñas_count: 12,
      estado: 'limitado',
      whatsapp: '+51898765432',
      whatsapp_display: '+51 898 765 432',
      email: 'c.paucar@gmail.com',
      habilidades: ['IPERC/PETS', 'SSOMA', 'Simulacros de emergencia', 'Inspección de obra', 'Normativa G.050', 'Primeros auxilios'],
      descripcion: 'Técnica en PRL con 7 años coordinando seguridad en obras de construcción. Conocimiento avanzado de la norma G.050 y legislación SUNAFIL. Disponible part-time.',
      emoji: '🦺',
      color: '#E74C3C',
      documentos: [
        { tipo: 'CERT', nombre: 'Certificación PRL Nivel Avanzado', fecha: 'Vigente 2025',    icono: '🦺' },
        { tipo: 'CERT', nombre: 'SSOMA – TECSUP',                   fecha: 'Enero 2023',      icono: '🎓' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',                  fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Proyecto Vivienda Masiva Pachacámac', año: '2023-2024', rol: 'Coordinadora de Seguridad', empresa: 'Besco SAC' },
      ],
      reseñas: [
        { autor: 'Besco SAC', cargo: 'Gerente de Obra', cal: 5, texto: 'Carmen es un activo fundamental en cualquier obra. Cero accidentes en 14 meses de proyecto.', fecha: 'Febrero 2024' },
      ],
    },
    {
      id: 11,
      nombre: 'Raúl Ccama Huanca',
      oficio: 'Operador de Maquinaria Pesada',
      categoria: 'Maquinaria y Transporte',
      zona: 'Lurín',
      exp: 13,
      rating: 4,
      reseñas_count: 10,
      estado: 'disponible',
      whatsapp: '+51887654321',
      whatsapp_display: '+51 887 654 321',
      email: 'r.ccama@gmail.com',
      habilidades: ['Retroexcavadora', 'Pala cargadora', 'Motoniveladora', 'Compactadora', 'Dumper', 'Movimiento de tierras'],
      descripcion: 'Operador de maquinaria pesada con 13 años de experiencia en movimiento de tierras, excavaciones y explanaciones para proyectos viales y de edificación.',
      emoji: '🚜',
      color: '#FF9800',
      documentos: [
        { tipo: 'LIC',  nombre: 'Licencia MTC Cat. A IIIc',    fecha: 'Vigente 2026', icono: '🚜' },
        { tipo: 'PRL',  nombre: 'Certificado Manejo Defensivo', fecha: 'Abril 2024',   icono: '🦺' },
        { tipo: 'CV',   nombre: 'Currículum Vitae',              fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Ampliación Vía Evitamiento Sur – Lurín', año: '2023-2024', rol: 'Operador Principal', empresa: 'MTC Infraestructura' },
      ],
      reseñas: [
        { autor: 'MTC Infraestructura', cargo: 'Supervisor de Equipos', cal: 4, texto: 'Muy experimentado y responsable con la maquinaria. Cumplió con los plazos sin incidentes.', fecha: 'Marzo 2024' },
      ],
    },
    {
      id: 12,
      nombre: 'Sofía Tapia Mendoza',
      oficio: 'Colocadora de Porcelanato y Revestimientos',
      categoria: 'Acabados',
      zona: 'Jesús María',
      exp: 5,
      rating: 5,
      reseñas_count: 8,
      estado: 'disponible',
      whatsapp: '+51876543210',
      whatsapp_display: '+51 876 543 210',
      email: 's.tapia@gmail.com',
      habilidades: ['Porcelanato rectificado', 'Mármol y granito', 'Alicatado', 'Mortero adhesivo', 'Junta epóxica', 'Nivelación láser'],
      descripcion: 'Especialista en colocación de revestimientos de alta gama para proyectos residenciales premium. Trabajo con nivelación láser y adhesivos de calidad profesional.',
      emoji: '🪟',
      color: '#009688',
      documentos: [
        { tipo: 'PRL', nombre: 'Certificado PRL 2024', fecha: 'Junio 2024',       icono: '🦺' },
        { tipo: 'CV',  nombre: 'Currículum Vitae',      fecha: 'Actualizado 2024', icono: '📋' },
      ],
      proyectos: [
        { nombre: 'Penthouse Torre Miraflores – Acabados Premium', año: '2024', rol: 'Colocadora Jefa', empresa: 'Premium Inmobiliaria SAC' },
      ],
      reseñas: [
        { autor: 'Premium Inmobiliaria SAC', cargo: 'Arquitecta de Interiores', cal: 5, texto: 'Trabajo impecable. El porcelanato quedó perfecto, sin ninguna junta irregular.', fecha: 'Julio 2024' },
      ],
    },
  ];
  
  // ── ESTADO INICIAL ────────────────────────────────────────────
  let ESTADO = {
    autenticado: false,
    tipoUsuario: null,
    nombreUsuario: null,
    userId: null,
    creditos: 10,
    revelados: [],
    ofertas: [],
    disponibilidades: [],
    historial: [],
  };
  
  // ── PERSISTENCIA ─────────────────────────────────────────────
  function guardarEstado() {
    localStorage.setItem('cl_estado', JSON.stringify(ESTADO));
  }
  
  function cargarEstado() {
    const saved = localStorage.getItem('cl_estado');
    if (saved) {
      try { Object.assign(ESTADO, JSON.parse(saved)); } catch (e) { /* ignore */ }
    }
    if (!ESTADO.ofertas)          ESTADO.ofertas = [];
    if (!ESTADO.disponibilidades) ESTADO.disponibilidades = [];
    if (!ESTADO.historial)        ESTADO.historial = [];
  }
  
  // ── AUTH ──────────────────────────────────────────────────────
  function requireAuth() {
    cargarEstado();
    if (!ESTADO.autenticado) { window.location.href = 'index.html'; return false; }
    return true;
  }
  
  function requireEmpresa() {
    if (!requireAuth()) return false;
    if (ESTADO.tipoUsuario !== 'empresa') { window.location.href = 'index.html'; return false; }
    return true;
  }
  
  function logout() {
    ESTADO.autenticado   = false;
    ESTADO.tipoUsuario   = null;
    ESTADO.nombreUsuario = null;
    ESTADO.userId        = null;
    guardarEstado();
    window.location.href = 'index.html';
  }
  
  // ── CRÉDITOS ─────────────────────────────────────────────────
  function getCreditos() { return ESTADO.creditos; }
  
  function gastarCredito(trabajadorId, accion) {
    accion = accion || ACCIONES.VER_CONTACTO;
    if (ESTADO.creditos <= 0) return false;
    ESTADO.creditos--;
  
    const t = TRABAJADORES.find(x => x.id === trabajadorId);
  
    if (accion.id === ACCIONES.VER_CONTACTO.id && !ESTADO.revelados.includes(trabajadorId))
      ESTADO.revelados.push(trabajadorId);
    if (accion.id === ACCIONES.ENVIAR_OFERTA.id && !ESTADO.ofertas.includes(trabajadorId))
      ESTADO.ofertas.push(trabajadorId);
    if (accion.id === ACCIONES.VER_DISPONIBILIDAD.id && !ESTADO.disponibilidades.includes(trabajadorId))
      ESTADO.disponibilidades.push(trabajadorId);
  
    ESTADO.historial.unshift({
      id:          Date.now(),
      trabajadorId,
      accionId:    accion.id,
      accionLabel: accion.label,
      accionEmoji: accion.emoji,
      nombre:      t ? t.nombre : '—',
      oficio:      t ? t.oficio : '—',
      whatsapp:    t ? t.whatsapp_display : '—',
      fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      hora:  new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      costo: accion.costo,
    });
  
    guardarEstado();
    verificarSemaforo();
    return true;
  }
  
  function agregarCreditos(cantidad) {
    ESTADO.creditos += cantidad;
    guardarEstado();
    verificarSemaforo();
  }
  
  function estaRevelado(id)        { return ESTADO.revelados.includes(id); }
  function tieneOferta(id)         { return ESTADO.ofertas.includes(id); }
  function tieneDisponibilidad(id) { return ESTADO.disponibilidades.includes(id); }
  
  // ── SEMÁFORO ──────────────────────────────────────────────────
  function getNivelSemaforo(n) {
    if (n <= 0)  return 'vacio';
    if (n === 1) return 'critico';
    if (n <= 3)  return 'bajo';
    if (n <= 10) return 'precauto';
    return 'normal';
  }
  
  function getMensajeSemaforo(n) {
    const nivel = getNivelSemaforo(n);
    const s = SEMAFORO_NIVELES[nivel];
    return s.msg.replace('{n}', n);
  }
  
  function verificarSemaforo() {
    const n     = getCreditos();
    const nivel = getNivelSemaforo(n);
    const msg   = getMensajeSemaforo(n);
  
    const banner = document.getElementById('semaforo-banner');
    if (banner) {
      banner.className  = `semaforo-banner semaforo-${nivel}`;
      banner.style.display = (msg && nivel !== 'normal') ? 'flex' : 'none';
      const msgEl = document.getElementById('semaforo-msg');
      if (msgEl) msgEl.textContent = msg;
    }
  
    const bannerViejo = document.getElementById('banner-sin-creditos');
    if (bannerViejo) bannerViejo.classList.toggle('visible', n === 0);
  
    const chip = document.querySelector('.wallet-chip');
    if (chip) {
      chip.classList.remove('wallet-vacio', 'wallet-bajo', 'wallet-critico');
      if (n === 0)       chip.classList.add('wallet-vacio');
      else if (n <= 3)   chip.classList.add('wallet-critico');
      else if (n <= 10)  chip.classList.add('wallet-bajo');
    }
  }
  
  // ── HELPER ESTADO TRABAJADOR ──────────────────────────────────
  function getEstadoTrabajador(t) {
    return ESTADOS_TRABAJADOR[t.estado] || ESTADOS_TRABAJADOR.disponible;
  }
  
  // ── TOAST ─────────────────────────────────────────────────────
  function mostrarToast(mensaje, tipo) {
    tipo = tipo || 'verde';
    let el = document.getElementById('global-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-toast';
      document.body.appendChild(el);
    }
    el.textContent = mensaje;
    el.className   = 'toast toast-' + tipo + ' toast-show';
    clearTimeout(el._timer);
    el._timer = setTimeout(function() { el.classList.remove('toast-show'); }, 3800);
  }
  
  // ── WALLET ────────────────────────────────────────────────────
  function sincronizarWallet() {
    const el = document.getElementById('creditos-count');
    if (!el) return;
    el.textContent = ESTADO.creditos;
    el.classList.remove('pulsing');
    void el.offsetWidth;
    el.classList.add('pulsing');
    verificarSemaforo();
  }
  
  // ── INIT PAGE ─────────────────────────────────────────────────
  function initPage(tipo) {
    cargarEstado();
    if (!ESTADO.autenticado) { window.location.href = 'index.html'; return false; }
    if (tipo === 'empresa' && ESTADO.tipoUsuario !== 'empresa') { window.location.href = 'index.html'; return false; }
    const nameEl = document.getElementById('header-username');
    if (nameEl) nameEl.textContent = ESTADO.nombreUsuario || 'Usuario';
    sincronizarWallet();
    return true;
  }
  
  // ── NAV ACTIVO ────────────────────────────────────────────────
  function marcarNavActivo() {
    const page = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === page);
    });
  }
  
  // ── RENDER PACKS (reutilizable) ───────────────────────────────
  function renderPacks(containerId, callbackFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = PACKS_CREDITOS.map(function(p) {
      return '<div class="pkg-card ' + (p.popular ? 'pkg-popular' : '') + '" onclick="' + callbackFn + '(' + p.creditos + ',' + p.precio + ')">'
        + (p.popular ? '<div class="pkg-badge">⭐ Más popular</div>' : '')
        + (p.bonus   ? '<div class="pkg-bonus">🎁 ' + p.bonus + '</div>' : '')
        + '<div class="pkg-icon">' + p.emoji + '</div>'
        + '<div class="pkg-num">' + p.creditos + '</div>'
        + '<div class="pkg-cred">Crédito' + (p.creditos > 1 ? 's' : '') + '</div>'
        + '<div class="pkg-precio">' + p.moneda + ' ' + p.precio + ' <span>/ pack</span></div>'
        + '<div class="pkg-desc">' + p.descripcion + '</div>'
        + '<div class="pkg-validez">⏱ Válido ' + p.validez + '</div>'
        + '<button class="btn-pkg ' + (p.popular ? 'btn-pkg-popular' : '') + '" onclick="event.stopPropagation();' + callbackFn + '(' + p.creditos + ',' + p.precio + ')">Comprar ahora</button>'
        + '</div>';
    }).join('');
  }
  
  // ── ESTRELLAS ─────────────────────────────────────────────────
  function renderEstrellas(n) {
    return '⭐'.repeat(n) + '<span style="opacity:.3">☆</span>'.repeat(5 - n);
  }