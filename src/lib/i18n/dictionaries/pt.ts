// Portuguese. Typed as `Dictionary` so any missing/renamed key fails typecheck.

import type { Dictionary } from "./en";

const pt: Dictionary = {
  common: {
    login: "Entrar",
    signup: "Cadastrar",
    backToHome: "Voltar ao início",
    backToLogin: "Voltar ao login",
    backToGame: "Voltar ao jogo",
  },

  language: {
    label: "Idioma",
  },

  home: {
    badge: "Palpites de futebol diários",
    tagline:
      "Escolha vencedores, gerencie seu Football Money, ganhe troféus e suba no ranking global. Um palpite por dia — faça valer!",
    howToPlay: "Como jogar",
    features: {
      pickTitle: "Escolha um vencedor",
      pickText: "Um palpite por dia entre cinco partidas reais.",
      moneyTitle: "Gerencie seus F$",
      moneyText: "Gaste com cabeça — opções mais baratas, mais risco.",
      climbTitle: "Suba na tabela",
      climbText: "Ganhe troféus e lidere o ranking global.",
    },
  },

  nav: {
    pick: "Palpite",
    missions: "Missões",
    leaderboard: "Ranking",
    pastPicks: "Histórico",
  },

  header: {
    trophies: "Troféus",
    footballMoney: "Football Money",
    winStreak: "Sequência de vitórias",
    help: "Como jogar",
    dailyIncomeTooltip: (income: string) =>
      `Renda diária: +${income} todo dia entre 00:00 UTC e 01:00 UTC`,
  },

  userMenu: {
    openMenu: "Abrir menu",
    signedInAs: "Conectado como",
    howToPlay: "Como jogar",
    gameGuide: "Guia do jogo",
    settings: "Configurações",
    logout: "Sair",
  },

  settings: {
    title: "Configurações",
    description: "Escolha seu idioma e aparência.",
    language: "Idioma",
    appearance: "Aparência",
    themeSystem: "Sistema",
    themeLight: "Claro",
    themeDark: "Escuro",
  },

  selection: {
    title: "Partidas de amanhã",
    descA:
      "Escolha um time para vencer entre suas cinco partidas. Cada opção mostra seu ",
    descPriceLabel: "preço em F$",
    descB: " — você pode mudar seu palpite até as ",
    noSelection: "Sem palpite",
    noSelectionDesc: (cost: string) =>
      `Fique de fora hoje — custa ${cost}, mas pular um dia são −2 troféus.`,
    emptyTitle: "Ainda não há partidas para amanhã",
    emptyDesc: "O grupo é preenchido todo dia — volte em breve.",
    vs: "VS",
    savedTitle: "Palpite salvo",
    clearedTitle: "Você fica de fora hoje",
    savedDesc: (time: string) => `Você pode mudar até as ${time}`,
  },

  selectionBanner: {
    picking: "Palpitando",
    noSelection: "Sem palpite",
    pickPrompt: "Escolha um time para entrar no derby de hoje.",
    locksIn: "Fecha em",
    goToPick: "Ir ao seu palpite",
  },

  todayPick: {
    badge: "Palpite de hoje",
    noPickTitle: "Nenhum palpite definido para hoje",
    noPickDesc: "Você ficou de fora hoje — nenhum time para torcer.",
    vs: "vs",
    results: {
      win: "Venceu",
      draw: "Empate",
      loss: "Perdeu",
      none: "Sem resultado",
    },
  },

  missions: {
    title: "Missões",
    progress: (done: number, total: number) => `${done} de ${total} concluídas`,
    completed: "Concluída",
    open: "Pendente",
    comingSoon: "As missões estão em desenvolvimento — volte em breve.",
    items: {
      "first-blood": {
        title: "Primeiro Sangue",
        description: "Vença seu primeiro derby.",
      },
      "budget-player": {
        title: "Jogador Econômico",
        description: "Vença um dia gastando menos de F$ 5.00.",
      },
      sharpshooter: {
        title: "Atirador de Elite",
        description: "Vença 5 dias no total.",
      },
      "hot-streak": {
        title: "Sequência Quente",
        description: "Vença 10 dias seguidos.",
      },
      "la-liga-loyalist": {
        title: "Fiel à La Liga",
        description: "Vença 3 dias escolhendo times da La Liga.",
      },
      "high-roller": {
        title: "Grande Apostador",
        description: "Gaste mais de F$ 50.00 em uma única semana.",
      },
      "perfect-week": {
        title: "Semana Perfeita",
        description: "Vença todos os dias de uma semana inteira.",
      },
      "table-topper": {
        title: "Líder da Tabela",
        description: "Chegue ao 1º lugar do ranking global.",
      },
      centurion: {
        title: "Centurião",
        description: "Acumule 100 troféus.",
      },
    },
  },

  leaderboard: {
    title: "Ranking",
    description: "Classificação global por total de troféus.",
    empty: "Ainda não há jogadores na tabela — seja o primeiro a palpitar.",
    player: "Jogador",
    you: "(você)",
    prev: "Anterior",
    next: "Próximo",
    page: (current: number, total: number) => `Página ${current} de ${total}`,
    jumpToMe: "Ir para mim",
    ariaTodayPick: "Palpite de hoje",
    ariaTrophies: "Troféus",
    ariaMoneySpent: "Dinheiro gasto",
    ariaWinStreak: "Sequência de vitórias",
  },

  pastPicks: {
    title: "Histórico",
    description: "Seus palpites diários recentes e como pontuaram.",
    empty: "Ainda não há palpites — seus dias resolvidos aparecerão aqui.",
    noSelection: "Sem palpite",
    results: {
      win: "Vitória",
      draw: "Empate",
      loss: "Derrota",
      none: "Pulado",
      pending: "Pendente",
    },
  },

  profile: {
    backToLeaderboard: "Ranking",
    trophies: "Troféus",
    winStreak: "Sequência de vitórias",
    balance: "Saldo",
    moneySpent: "Dinheiro gasto",
    winRate: "Taxa de vitórias",
    winRateSub: (wins: number, total: number) => `${wins} de ${total} vitórias`,
    predictions: "Palpites",
    predictionsSub: "palpites resolvidos",
    bestLeague: "Melhor liga",
    bestLeagueSub: (wins: number) =>
      `${wins} ${wins === 1 ? "vitória" : "vitórias"}`,
    noSettledPicksSub: "sem palpites resolvidos",
    pastPicksTitle: "Palpites",
    emptyPicks: "Ainda não há palpites resolvidos.",
  },

  welcome: {
    title: "Bem-vindo ao The Daily Derby ⚽",
    description: "Um jogo diário de palpites de futebol. Aqui vai o resumo.",
    fact1Title: "Um palpite por dia",
    fact1Body:
      "Aposte em um único time para vencer entre suas cinco partidas reais — ou fique de fora. Mude de ideia quando quiser antes do fechamento diário.",
    fact2Title: "Gerencie seus F$",
    fact2Pre: "Comece com ",
    fact2Mid: " e ganhe ",
    fact2Post: " por dia. Favoritos mais fortes custam mais para apostar.",
    fact3Title: "Ganhe troféus",
    fact3Body:
      "Os resultados dos palpites não te devolvem dinheiro, mas sim troféus.",
    readGuide: "Ler o guia completo",
    gotIt: "Entendi",
  },

  guide: {
    home: "Início",
    badge: "Guia do jogo",
    heroTitle: "Como jogar",
    heroDesc:
      "Um palpite por dia. Aposte em um vencedor, gaste com cabeça e suba no ranking global. Aqui está tudo o que você precisa saber.",
    gistTitle: "A ideia",
    gistP1a:
      "The Daily Derby é um jogo diário de palpites de futebol. Todo dia você recebe cinco partidas reais e escolhe um time para vencer. Bons palpites ganham ",
    gistTrophies: "troféus",
    gistP1b:
      " e te empurram no ranking; pelo caminho você gerencia uma reserva de ",
    gistMoney: "Football Money (F$)",
    gistP1c: " enquanto joga. É um jogo — F$ não é dinheiro real.",
    gistP2a: "Você começa com ",
    gistP2b: " e ganha ",
    gistP2c: " todo dia.",
    loopTitle: "O ciclo diário",
    moneyTitle: "Football Money (F$)",
    moneyP1a:
      "Cada time tem um preço em F$ definido por suas odds — um grande favorito custa mais, um azarão é mais barato (a fórmula é ",
    moneyP1b:
      "). Escolher um time gasta esse valor do seu saldo; trocar de palpite devolve o antigo e cobra o novo. As opções que você não pode pagar ficam desabilitadas.",
    moneyNoSel: "Sem palpite",
    moneyCalloutBody:
      " é sempre grátis e vem selecionada por padrão — mas ficar de fora um dia custa troféus (veja abaixo).",
    scoringTitle: "Pontuação",
    scoringIntro:
      "Os troféus são sua pontuação e sua posição no ranking. Podem ficar negativos. Cada dia resolvido move seu total:",
    streakTitle: "Sequência de vitórias e ranking",
    streakA: "Vença em dias consecutivos para construir uma ",
    streakLabel: "sequência de vitórias",
    streakB:
      " — só uma derrota a reinicia, enquanto empates e dias de fora a deixam intacta. O ranking global classifica cada jogador por total de troféus, junto com seu dinheiro gasto e sua melhor sequência.",
    resetTitle: "Reinício diário",
    resetA: "Tudo reinicia às ",
    resetB:
      ": um novo grupo de partidas, sua renda diária e um recomeço para o próximo palpite. Pular um dia conta como Sem palpite.",
    ctaTitle: "Pronto para jogar?",
    ctaDesc: "Faça seu primeiro palpite hoje e comece a subir na tabela.",
  },

  scoring: {
    win: {
      outcome: "Vitória",
      detail: "O time que você escolheu venceu a partida.",
    },
    draw: {
      outcome: "Empate",
      detail: "A partida terminou empatada — sem dano, sem recompensa.",
    },
    loss: {
      outcome: "Derrota",
      detail:
        "Seu time perdeu. Só uma derrota quebra sua sequência de vitórias.",
    },
    none: {
      outcome: "Sem palpite",
      detail: "Você ficou de fora no dia e não fez nenhum palpite.",
    },
    mission: {
      outcome: "Nova missão",
      detail: "Um troféu extra cada vez que você conclui uma missão.",
    },
  },

  dailyLoop: {
    getMatches: {
      title: "Receba suas partidas",
      detail:
        "Todo dia você recebe cinco próximas partidas reais, sorteadas só para você do grupo global.",
    },
    makePick: {
      title: "Faça um palpite",
      detail:
        "Escolha um único time que você acha que vai vencer — ou fique de fora com Sem palpite. Você pode mudá-lo livremente até o fechamento diário.",
    },
    payPrice: {
      title: "Pague o preço",
      detail:
        "Cada time custa F$ conforme suas odds (times mais caros são maiores favoritos). O custo sai do seu saldo ao palpitar.",
    },
    matchesPlay: {
      title: "As partidas acontecem",
      detail:
        "Após o apito inicial, os resultados são resolvidos automaticamente e seus troféus mudam conforme o resultado.",
    },
    resetRepeat: {
      title: "Reinicie e repita",
      detail:
        "No reinício diário você recebe partidas novas, sua renda recarrega seu saldo e uma nova rodada começa.",
    },
  },

  auth: {
    backToHome: "Voltar ao início",
    backToLogin: "Voltar ao login",
    usernameLabel: "Nome de usuário",
    usernamePlaceholder: "artilheiro",
    emailLabel: "E-mail",
    emailPlaceholder: "voce@exemplo.com",
    passwordLabel: "Senha",
    forgotPassword: "Esqueceu a senha?",
    login: {
      title: "Bem-vindo de volta",
      description: "Entre para fazer o palpite de hoje.",
      submit: "Entrar",
      cta: "É novo por aqui?",
      ctaLabel: "Criar uma conta",
    },
    signup: {
      title: "Junte-se ao Derby",
      description: "Crie uma conta e comece com F$ 10.00.",
      submit: "Cadastrar",
      cta: "Já joga?",
      ctaLabel: "Entrar",
    },
    forgot: {
      title: "Redefina sua senha",
      description: "Informe seu e-mail e enviaremos um link para redefinir.",
      submit: "Enviar link",
      sentTitle: "Verifique sua caixa de entrada",
      sentDescription:
        "Se existir uma conta com esse e-mail, enviamos um link para redefinir sua senha.",
    },
    update: {
      title: "Defina uma nova senha",
      description: "Escolha uma nova senha para sua conta.",
      newPasswordLabel: "Nova senha",
      confirmLabel: "Confirme a nova senha",
      submit: "Atualizar senha",
    },
    checkEmail: {
      title: "Verifique sua caixa de entrada",
      description:
        "Enviamos um link de confirmação. Clique nele para ativar sua conta e depois entre para fazer seu primeiro palpite.",
    },
    spamHint: "Não encontrou? Verifique sua caixa de spam ou lixo eletrônico.",
    orContinueWith: "ou continue com",
    providers: {
      apple: "Apple",
      azure: "Microsoft",
      discord: "Discord",
      facebook: "Facebook",
      google: "Google",
      x: "X",
    },
    onboarding: {
      title: "Escolha seu nome de usuário",
      description: "É assim que os outros jogadores verão você no ranking.",
      submit: "Continuar",
    },
    errors: {
      missingCredentials: "Informe seu e-mail e senha.",
      missingSignupCredentials:
        "Escolha um nome de usuário e informe seu e-mail e senha.",
      passwordTooShort: "A senha deve ter pelo menos 6 caracteres.",
      passwordMismatch: "As senhas não coincidem.",
      invalidResetLink: "Seu link de redefinição é inválido ou expirou.",
      missingEmail: "Informe seu e-mail.",
      missingUsername: "Informe um nome de usuário.",
      invalidUsername: "Use de 3 a 24 letras, números ou sublinhados.",
      usernameTaken: "Esse nome de usuário já existe. Tente outro.",
    },
  },

  footer: {
    thanks: "Obrigado por jogar! ⚽",
    beta: "Beta",
    betaText:
      "Esta é uma versão beta — pode conter bugs e nem todas as funções estão implementadas ainda. Os dados podem ser reiniciados a qualquer momento.",
    contribute: "Contribuir no GitHub",
    suggestIdea: "Sugerir uma ideia",
    or: "ou",
    reportBug: "reportar um bug",
  },
};

export default pt;
