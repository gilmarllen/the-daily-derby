// Spanish. Typed as `Dictionary` so any missing/renamed key fails typecheck.

import type { Dictionary } from "./en";

const es: Dictionary = {
  common: {
    login: "Iniciar sesión",
    signup: "Registrarse",
    backToHome: "Volver al inicio",
    backToLogin: "Volver a iniciar sesión",
    backToGame: "Volver al juego",
  },

  language: {
    label: "Idioma",
  },

  seo: {
    description:
      "Un juego diario de predicciones de fútbol — acierta ganadores, gestiona tu Football Money, gana trofeos y escala en la clasificación global.",
    ogEyebrow: "Predicciones de Fútbol Diarias",
    ogSubtitle:
      "Acierta ganadores, gestiona tu Football Money, gana trofeos y escala en la clasificación global.",
    ogImageAlt: "The Daily Derby — predicciones de fútbol diarias",
  },

  error: {
    reconnecting: "Reconectando…",
    title: "Algo salió mal",
    description:
      "No pudimos cargar el juego ahora mismo. Esto puede pasar tras un rato de inactividad — inténtalo de nuevo.",
    retry: "Reintentar",
  },

  home: {
    badge: "Predicciones de fútbol diarias",
    tagline:
      "Acierta un ganador al día en partidos reales, haz crecer tu Football Money y escala en la clasificación global. Sin estrés, solo por diversión.",
    playFree: "Jugar gratis",
    playFreeSub:
      "Sin tarjeta, sin trampa — crea una cuenta gratis y elige el partido de hoy.",
    howToPlay: "Cómo funciona",
    features: {
      pickTitle: "Elige un ganador",
      pickText:
        "Una elección al día entre cinco partidos reales. Fácil de empezar.",
      moneyTitle: "Haz crecer tus F$",
      moneyText:
        "Football Money es dinero de juego — gasta con cabeza y arriésgate.",
      climbTitle: "Escala en la tabla",
      climbText:
        "Gana trofeos y persigue lo más alto de la clasificación global.",
    },
    reassure: {
      heading: "Solo un juego — seamos sinceros",
      freeTitle: "100% gratis",
      freeText: "Sin pagos, sin suscripciones, sin anuncios persiguiéndote.",
      notBettingTitle: "No son apuestas",
      notBettingText:
        "Nada que apostar, nada que perder. Solo predicciones por diversión.",
      playMoneyTitle: "Solo dinero de juego",
      playMoneyText:
        "F$ es moneda ficticia del juego. Nunca hay dinero real de por medio.",
    },
    preview: {
      heading: "Echa un vistazo por dentro",
      subheading: "Así es un día.",
      pickTitle: "Tu elección diaria",
      pickCaption: "Elige un ganador entre cinco partidos reales.",
      leaderboardTitle: "Clasificación global",
      leaderboardCaption: "Escala en la tabla a medida que sumas trofeos.",
      sampleNote: "Vista de ejemplo — regístrate para jugar de verdad.",
      scrollCta: "Ver un ejemplo",
    },
    privacyPolicy: "Política de Privacidad",
  },

  nav: {
    pick: "Elegir",
    missions: "Misiones",
    leaderboard: "Clasificación",
    pastPicks: "Historial",
  },

  header: {
    trophies: "Trofeos",
    footballMoney: "Football Money",
    winStreak: "Racha de victorias",
    help: "Cómo jugar",
    dailyIncomeTooltip: (income: string) =>
      `Ingreso diario: +${income} cada día entre las 00:00 UTC y la 01:00 UTC`,
  },

  userMenu: {
    openMenu: "Abrir menú",
    signedInAs: "Sesión iniciada como",
    howToPlay: "Cómo jugar",
    gameGuide: "Guía del juego",
    settings: "Ajustes",
    about: "Acerca de",
    logout: "Cerrar sesión",
  },

  about: {
    title: "Acerca de The Daily Derby",
    description:
      "Un juego diario y gratuito de pronósticos de fútbol. F$ es moneda del juego únicamente — no tiene valor en el mundo real.",
    terms: "Términos de uso",
    privacy: "Política de privacidad",
  },

  settings: {
    title: "Ajustes",
    description: "Elige tu idioma y apariencia.",
    language: "Idioma",
    appearance: "Apariencia",
    themeSystem: "Sistema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    deleteAccount: "Eliminar cuenta",
    deleteAccountTitle: "¿Eliminar tu cuenta?",
    deleteAccountWarning:
      "Esto borra permanentemente tu cuenta y todos tus datos: pronósticos, trofeos, misiones y saldo. No se puede deshacer. Te enviaremos un código por correo para confirmar.",
    deleteAccountSendCode: "Enviarme un código",
    deleteAccountCodeSentBefore: "Enviamos un código de 6 dígitos a ",
    deleteAccountCodeSentAfter:
      ". Ingrésalo abajo para eliminar tu cuenta permanentemente.",
    deleteAccountCodeLabel: "Código de confirmación",
    deleteAccountResend: "Reenviar código",
    deleteAccountConfirm: "Eliminar mi cuenta",
    cancel: "Cancelar",
  },

  selection: {
    title: "Partidos de mañana",
    descA:
      "Elige un equipo ganador entre tus cinco partidos. Cada opción muestra su ",
    descPriceLabel: "precio en F$",
    descB: " — puedes cambiar tu elección hasta las ",
    noSelection: "Sin elección",
    noSelectionDesc: (cost: string) =>
      `Quédate fuera hoy — cuesta ${cost}, pero saltarte un día son −2 trofeos.`,
    emptyTitle: "Aún no hay partidos para mañana",
    emptyDesc: "El grupo se llena cada día — vuelve pronto.",
    vs: "VS",
    savedTitle: "Elección guardada",
    clearedTitle: "Hoy te quedas fuera",
    savedDesc: (time: string) => `Puedes cambiarla hasta las ${time}`,
  },

  selectionBanner: {
    picking: "Eligiendo",
    noSelection: "Sin elección",
    pickPrompt: "Elige un equipo para entrar en el derbi de hoy.",
    locksIn: "Se cierra en",
    goToPick: "Ir a tu elección",
  },

  todayPick: {
    badge: "Elección de hoy",
    noPickTitle: "No hay elección fijada para hoy",
    noPickDesc: "Te quedaste fuera hoy — no hay equipo al que animar.",
    vs: "vs",
    results: {
      win: "Ganó",
      draw: "Empate",
      loss: "Perdió",
      none: "Sin resultado",
    },
  },

  missions: {
    title: "Misiones",
    progress: (done: number, total: number) =>
      `${done} de ${total} completadas`,
    completed: "Completada",
    open: "Pendiente",
    comingSoon: "Las misiones están en desarrollo — vuelve pronto.",
    items: {
      "first-blood": {
        title: "Primera Sangre",
        description: "Gana tu primer derbi.",
      },
      "budget-player": {
        title: "Jugador Ahorrador",
        description: "Gana un día gastando menos de F$ 5.00.",
      },
      sharpshooter: {
        title: "Francotirador",
        description: "Gana 5 días en total.",
      },
      "hot-streak": {
        title: "Racha Caliente",
        description: "Gana 10 días seguidos.",
      },
      "la-liga-loyalist": {
        title: "Fiel a La Liga",
        description: "Gana 3 días eligiendo equipos de La Liga.",
      },
      "high-roller": {
        title: "Gran Apostador",
        description: "Gasta más de F$ 50.00 en una sola semana.",
      },
      "perfect-week": {
        title: "Semana Perfecta",
        description: "Gana todos los días durante una semana entera.",
      },
      "table-topper": {
        title: "Líder de la Tabla",
        description: "Llega al puesto n.º 1 de la clasificación global.",
      },
      centurion: {
        title: "Centurión",
        description: "Acumula 100 trofeos.",
      },
    },
  },

  leaderboard: {
    title: "Clasificación",
    description: "Ranking global por total de trofeos.",
    empty: "Aún no hay jugadores en la tabla — sé el primero en elegir.",
    player: "Jugador",
    you: "(tú)",
    prev: "Anterior",
    next: "Siguiente",
    page: (current: number, total: number) => `Página ${current} de ${total}`,
    jumpToMe: "Ir a mí",
    ariaTodayPick: "Elección de hoy",
    ariaTrophies: "Trofeos",
    ariaMoneySpent: "Dinero gastado",
    ariaWinStreak: "Racha de victorias",
  },

  pastPicks: {
    title: "Historial",
    description: "Tus elecciones diarias recientes y cómo puntuaron.",
    empty: "Aún no hay elecciones — tus días resueltos aparecerán aquí.",
    noSelection: "Sin elección",
    results: {
      win: "Victoria",
      draw: "Empate",
      loss: "Derrota",
      none: "Omitido",
      pending: "Pendiente",
    },
  },

  profile: {
    backToLeaderboard: "Clasificación",
    trophies: "Trofeos",
    winStreak: "Racha de victorias",
    balance: "Saldo",
    moneySpent: "Dinero gastado",
    winRate: "Tasa de victorias",
    winRateSub: (wins: number, total: number) =>
      `${wins} de ${total} victorias`,
    predictions: "Predicciones",
    predictionsSub: "elecciones resueltas",
    bestLeague: "Mejor liga",
    bestLeagueSub: (wins: number) =>
      `${wins} ${wins === 1 ? "victoria" : "victorias"}`,
    noSettledPicksSub: "sin elecciones resueltas",
    pastPicksTitle: "Elecciones",
    emptyPicks: "Aún no hay elecciones resueltas.",
  },

  welcome: {
    title: "Bienvenido a The Daily Derby ⚽",
    description:
      "Un juego diario de predicciones de fútbol. Aquí va la versión rápida.",
    fact1Title: "Una elección al día",
    fact1Body:
      "Apuesta por un solo equipo ganador entre tus cinco partidos reales — o quédate fuera. Cambia de idea cuando quieras antes del cierre diario.",
    fact2Title: "Gestiona tus F$",
    fact2Pre: "Empieza con ",
    fact2Mid: " y gana ",
    fact2Post: " al día. Los favoritos más fuertes cuestan más.",
    fact3Title: "Gana trofeos",
    fact3Body:
      "Los resultados de las elecciones no te devuelven dinero, sino trofeos.",
    readGuide: "Leer la guía completa",
    gotIt: "Entendido",
  },

  guide: {
    home: "Inicio",
    badge: "Guía del juego",
    heroTitle: "Cómo jugar",
    heroDesc:
      "Una elección al día. Apuesta por un ganador, gasta con cabeza y escala en la clasificación global. Esto es todo lo que necesitas saber.",
    gistTitle: "La idea",
    gistP1a:
      "The Daily Derby es un juego diario de predicciones de fútbol. Cada día recibes cinco partidos reales y eliges un equipo ganador. Los aciertos ganan ",
    gistTrophies: "trofeos",
    gistP1b:
      " y te impulsan en la clasificación; por el camino gestionas una reserva de ",
    gistMoney: "Football Money (F$)",
    gistP1c: " mientras juegas. Es un juego — F$ no es dinero real.",
    gistP2a: "Empiezas con ",
    gistP2b: " y ganas ",
    gistP2c: " cada día.",
    loopTitle: "El ciclo diario",
    moneyTitle: "Football Money (F$)",
    moneyP1a:
      "Cada equipo tiene un precio en F$ según sus cuotas — un gran favorito cuesta más, un tapado es más barato (la fórmula es ",
    moneyP1b:
      "). Elegir un equipo descuenta esa cantidad de tu saldo; cambiar de elección reembolsa la anterior y cobra la nueva. Las opciones que no puedes pagar quedan deshabilitadas.",
    moneyNoSel: "Sin elección",
    moneyCalloutBody:
      " siempre es gratis y está seleccionada por defecto — pero quedarte fuera te cuesta trofeos (ver abajo).",
    scoringTitle: "Puntuación",
    scoringIntro:
      "Los trofeos son tu puntuación y tu posición en la clasificación. Pueden ser negativos. Cada día resuelto mueve tu total:",
    streakTitle: "Racha de victorias y clasificación",
    streakA: "Gana días consecutivos para construir una ",
    streakLabel: "racha de victorias",
    streakB:
      " — solo una derrota la reinicia, mientras que los empates y los días fuera la dejan intacta. La clasificación global ordena a cada jugador por total de trofeos, junto a su dinero gastado y su mejor racha.",
    resetTitle: "Reinicio diario",
    resetA: "Todo se reinicia a las ",
    resetB:
      ": un nuevo grupo de partidos, tu ingreso diario y un borrón y cuenta nueva para la siguiente elección. Si te saltas un día, cuenta como Sin elección.",
    ctaTitle: "¿Listo para jugar?",
    ctaDesc: "Haz tu primera elección hoy y empieza a escalar en la tabla.",
  },

  scoring: {
    win: {
      outcome: "Victoria",
      detail: "El equipo que elegiste ganó su partido.",
    },
    draw: {
      outcome: "Empate",
      detail: "El partido acabó en tablas — ni daño ni recompensa.",
    },
    loss: {
      outcome: "Derrota",
      detail: "Tu equipo perdió. Solo una derrota rompe tu racha de victorias.",
    },
    none: {
      outcome: "Sin elección",
      detail: "Te quedaste fuera ese día y no hiciste ninguna elección.",
    },
    mission: {
      outcome: "Nueva misión",
      detail: "Un trofeo extra cada vez que completas una misión.",
    },
  },

  dailyLoop: {
    getMatches: {
      title: "Recibe tus partidos",
      detail:
        "Cada día recibes cinco próximos partidos reales, sorteados solo para ti del grupo global.",
    },
    makePick: {
      title: "Haz una elección",
      detail:
        "Elige un único equipo que creas que ganará — o quédate fuera con Sin elección. Puedes cambiarla libremente hasta el cierre diario.",
    },
    payPrice: {
      title: "Paga el precio",
      detail:
        "Cada equipo cuesta F$ según sus cuotas (los equipos más caros son mayores favoritos). El coste sale de tu saldo al elegir.",
    },
    matchesPlay: {
      title: "Los partidos se juegan",
      detail:
        "Tras el inicio, los resultados se resuelven automáticamente y tus trofeos cambian según el resultado.",
    },
    resetRepeat: {
      title: "Reinicia y repite",
      detail:
        "En el reinicio diario recibes partidos nuevos, tu ingreso recarga tu saldo y empieza una nueva ronda.",
    },
  },

  auth: {
    backToHome: "Volver al inicio",
    backToLogin: "Volver a iniciar sesión",
    usernameLabel: "Nombre de usuario",
    usernamePlaceholder: "goleador",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    passwordLabel: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    legalPrefix: "Al registrarte, aceptas nuestros",
    legalTerms: "Términos",
    legalAnd: "y la",
    legalPrivacy: "Política de Privacidad",
    login: {
      title: "Bienvenido de nuevo",
      description: "Inicia sesión para hacer la elección de hoy.",
      submit: "Iniciar sesión",
      cta: "¿Eres nuevo?",
      ctaLabel: "Crear una cuenta",
    },
    signup: {
      title: "Únete al Derby",
      description: "Crea una cuenta y empieza con F$ 10.00.",
      submit: "Registrarse",
      cta: "¿Ya juegas?",
      ctaLabel: "Iniciar sesión",
    },
    forgot: {
      title: "Restablece tu contraseña",
      description:
        "Introduce tu correo y te enviaremos un enlace para restablecerla.",
      submit: "Enviar enlace",
      sentTitle: "Revisa tu bandeja de entrada",
      sentDescription:
        "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer tu contraseña.",
    },
    update: {
      title: "Establece una nueva contraseña",
      description: "Elige una nueva contraseña para tu cuenta.",
      newPasswordLabel: "Nueva contraseña",
      confirmLabel: "Confirma la nueva contraseña",
      submit: "Actualizar contraseña",
    },
    checkEmail: {
      title: "Revisa tu bandeja de entrada",
      description:
        "Te enviamos un enlace de confirmación. Haz clic para activar tu cuenta y luego inicia sesión para hacer tu primera elección.",
    },
    spamHint: "¿No lo ves? Revisa tu carpeta de spam o correo no deseado.",
    orContinueWith: "o continúa con",
    providers: {
      apple: "Apple",
      azure: "Microsoft",
      discord: "Discord",
      facebook: "Facebook",
      google: "Google",
      x: "X",
    },
    onboarding: {
      title: "Elige tu nombre de usuario",
      description: "Así te verán los demás jugadores en la clasificación.",
      submit: "Continuar",
    },
    errors: {
      missingCredentials: "Introduce tu correo y contraseña.",
      missingSignupCredentials:
        "Elige un nombre de usuario e introduce tu correo y contraseña.",
      passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
      passwordMismatch: "Las contraseñas no coinciden.",
      invalidResetLink:
        "Tu enlace de restablecimiento no es válido o ha caducado.",
      missingEmail: "Introduce tu correo.",
      missingUsername: "Introduce un nombre de usuario.",
      invalidUsername: "Usa de 3 a 24 letras, números o guiones bajos.",
      usernameTaken: "Ese nombre de usuario ya existe. Prueba con otro.",
      invalidCode: "Ese código es incorrecto o ha caducado.",
    },
  },

  footer: {
    thanks: "¡Gracias por jugar! ⚽",
    beta: "Beta",
    betaText:
      "Esta es una versión beta — puede contener errores y no todas las funciones están implementadas todavía. Los datos pueden reiniciarse en cualquier momento.",
    contribute: "Contribuir en GitHub",
    suggestIdea: "Sugerir una idea",
    or: "o",
    reportBug: "reportar un error",
  },
};

export default es;
