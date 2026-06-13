// English — the source-of-truth dictionary. `Dictionary = typeof en` drives the
// shape every other locale must satisfy, so a missing or mistyped key fails
// `npm run typecheck`. Brand strings ("The Daily Derby", "F$") are intentionally
// not translated and stay inline in the components.

const en = {
  common: {
    login: "Log in",
    signup: "Sign up",
    backToHome: "Back to home",
    backToLogin: "Back to log in",
    backToGame: "Back to the game",
  },

  language: {
    label: "Language",
  },

  home: {
    badge: "Daily football predictions",
    tagline:
      "Pick winners, manage your Football Money, earn trophies, and climb the global leaderboard. One pick a day — make it count.",
    howToPlay: "How to play",
    features: {
      pickTitle: "Pick a winner",
      pickText: "One pick a day from five real matches.",
      moneyTitle: "Manage your F$",
      moneyText: "Spend smart — cheaper picks, bigger risk.",
      climbTitle: "Climb the table",
      climbText: "Earn trophies and top the global board.",
    },
  },

  nav: {
    pick: "Pick",
    missions: "Missions",
    leaderboard: "Leaderboard",
    pastPicks: "Past Picks",
  },

  header: {
    trophies: "Trophies",
    footballMoney: "Football Money",
    winStreak: "Win streak",
    help: "How to play",
    dailyIncomeTooltip: (income: string) =>
      `Daily income: +${income} added every day between 00:00 UTC - 01:00 UTC`,
  },

  userMenu: {
    openMenu: "Open menu",
    signedInAs: "Signed in as",
    howToPlay: "How to play",
    gameGuide: "Game guide",
    settings: "Settings",
    logout: "Log out",
  },

  settings: {
    title: "Settings",
    description: "Choose your language and appearance.",
    language: "Language",
    appearance: "Appearance",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },

  selection: {
    title: "Tomorrow's Match Pool",
    descA:
      "Pick one team to win from your five matches. Each option shows its ",
    descPriceLabel: "F$ price",
    descB: " — you can change your pick until ",
    noSelection: "No selection",
    noSelectionDesc: (cost: string) =>
      `Sit today out — costs ${cost} but skipping a day is −2 trophies.`,
    emptyTitle: "No matches yet for tomorrow",
    emptyDesc: "The pool is filled daily — check back soon.",
    vs: "VS",
    savedTitle: "Pick saved",
    clearedTitle: "Sitting today out",
    savedDesc: (time: string) => `You can change it until ${time}`,
  },

  selectionBanner: {
    picking: "Picking",
    noSelection: "No selection",
    pickPrompt: "Pick a team to enter today's derby.",
    locksIn: "Locks in",
    goToPick: "Go to your pick",
  },

  todayPick: {
    badge: "Today's pick",
    noPickTitle: "No pick locked for today",
    noPickDesc: "You sat today out — no team to cheer for.",
    vs: "vs",
    results: {
      win: "Won",
      draw: "Draw",
      loss: "Lost",
      none: "No result",
    },
  },

  missions: {
    title: "Missions",
    progress: (done: number, total: number) => `${done} of ${total} completed`,
    completed: "Completed",
    open: "Open",
    comingSoon: "Missions are under development — check back soon.",
    items: {
      "first-blood": {
        title: "First Blood",
        description: "Win your very first derby.",
      },
      "budget-player": {
        title: "Budget Player",
        description: "Win a day spending under F$ 5.00.",
      },
      sharpshooter: {
        title: "Sharpshooter",
        description: "Win 5 days in total.",
      },
      "hot-streak": {
        title: "Hot Streak",
        description: "Win 10 days in a row.",
      },
      "la-liga-loyalist": {
        title: "La Liga Loyalist",
        description: "Win 3 days picking La Liga teams.",
      },
      "high-roller": {
        title: "High Roller",
        description: "Spend over F$ 50.00 in a single week.",
      },
      "perfect-week": {
        title: "Perfect Week",
        description: "Win every day for a full week.",
      },
      "table-topper": {
        title: "Table Topper",
        description: "Reach #1 on the global leaderboard.",
      },
      centurion: {
        title: "Centurion",
        description: "Collect 100 trophies.",
      },
    },
  },

  leaderboard: {
    title: "Leaderboard",
    description: "Global standings by total trophies.",
    empty: "No players on the board yet — be the first to make a pick.",
    player: "Player",
    you: "(you)",
    prev: "Prev",
    next: "Next",
    page: (current: number, total: number) => `Page ${current} of ${total}`,
    jumpToMe: "Jump to me",
    ariaTodayPick: "Today's pick",
    ariaTrophies: "Trophies",
    ariaMoneySpent: "Money spent",
    ariaWinStreak: "Win streak",
  },

  pastPicks: {
    title: "Past Picks",
    description: "Your recent daily picks and how they scored.",
    empty: "No past picks yet — your settled days will show up here.",
    noSelection: "No selection",
    results: {
      win: "Win",
      draw: "Draw",
      loss: "Loss",
      none: "Skipped",
      pending: "Pending",
    },
  },

  profile: {
    backToLeaderboard: "Leaderboard",
    trophies: "Trophies",
    winStreak: "Win streak",
    balance: "Balance",
    moneySpent: "Money spent",
    winRate: "Win rate",
    winRateSub: (wins: number, total: number) => `${wins} of ${total} wins`,
    predictions: "Predictions",
    predictionsSub: "settled picks",
    bestLeague: "Best league",
    bestLeagueSub: (wins: number) => `${wins} ${wins === 1 ? "win" : "wins"}`,
    noSettledPicksSub: "no settled picks",
    pastPicksTitle: "Past picks",
    emptyPicks: "No settled picks yet.",
  },

  welcome: {
    title: "Welcome to The Daily Derby ⚽",
    description: "A daily football prediction game. Here's the quick version.",
    fact1Title: "One pick a day",
    fact1Body:
      "Back a single team to win from your five real matches — or sit the day out. Change your mind any time before the daily lock.",
    fact2Title: "Manage your F$",
    fact2Pre: "Start with ",
    fact2Mid: " and earn ",
    fact2Post: " daily. Stronger favourites cost more to back.",
    fact3Title: "Earn trophies",
    fact3Body: "Picks results don't give you money back, but trophies instead.",
    readGuide: "Read the full guide",
    gotIt: "Got it",
  },

  guide: {
    home: "Home",
    badge: "Game guide",
    heroTitle: "How to play",
    heroDesc:
      "One pick a day. Back a winner, spend smart, and climb the global leaderboard. Here's everything you need to know.",
    gistTitle: "The gist",
    gistP1a:
      "The Daily Derby is a daily football prediction game. Every day you get five real matches and pick one team to win. Good calls earn ",
    gistTrophies: "trophies",
    gistP1b: " and push you up the leaderboard; you manage a stash of in-game ",
    gistMoney: "Football Money (F$)",
    gistP1c: " along the way. It's a game — F$ is not real money.",
    gistP2a: "You start with ",
    gistP2b: " and earn ",
    gistP2c: " every day.",
    loopTitle: "The daily loop",
    moneyTitle: "Football Money (F$)",
    moneyP1a:
      "Every team option has an F$ price set by its odds — a strong favourite costs more, a long shot is cheaper (the formula is ",
    moneyP1b:
      "). Picking a team spends that amount from your balance; switching picks refunds the old one and charges the new. Options you can't afford are disabled.",
    moneyNoSel: "No selection",
    moneyCalloutBody:
      " is always free and selected by default — but sitting a day out costs you trophies (see below).",
    scoringTitle: "Scoring",
    scoringIntro:
      "Trophies are your score and your leaderboard rank. They can go negative. Each settled day moves your total:",
    streakTitle: "Win streak & leaderboard",
    streakA: "Win on consecutive days to build a ",
    streakLabel: "win streak",
    streakB:
      " — only a loss resets it, while draws and sat-out days leave it untouched. The global leaderboard ranks every player by total trophies, alongside their money spent and best streak.",
    resetTitle: "Daily reset",
    resetA: "Everything resets at ",
    resetB:
      ": a fresh set of matches, your daily income, and a clean slate to make the next pick. Miss a day and it counts as No selection.",
    ctaTitle: "Ready to play?",
    ctaDesc: "Make your first pick today and start climbing the table.",
  },

  scoring: {
    win: { outcome: "Win", detail: "Your picked team won its match." },
    draw: {
      outcome: "Draw",
      detail: "The match ended level — no harm, no reward.",
    },
    loss: {
      outcome: "Loss",
      detail: "Your team lost. Only a loss breaks your win streak.",
    },
    none: {
      outcome: "No selection",
      detail: "You sat the day out and made no pick.",
    },
    mission: {
      outcome: "New mission",
      detail: "Bonus trophy each time you complete a mission.",
    },
  },

  dailyLoop: {
    getMatches: {
      title: "Get your matches",
      detail:
        "Each day you're dealt five real upcoming matches, drawn just for you from the global pool.",
    },
    makePick: {
      title: "Make one pick",
      detail:
        "Choose a single team you think will win — or sit the day out with No selection. You can change it freely until the daily lock.",
    },
    payPrice: {
      title: "Pay the price",
      detail:
        "Each team costs F$ based on its odds (pricier teams are bigger favourites). The cost leaves your balance when you pick.",
    },
    matchesPlay: {
      title: "Matches play out",
      detail:
        "After kickoff, results settle automatically and your trophies move by the outcome.",
    },
    resetRepeat: {
      title: "Reset & repeat",
      detail:
        "At the daily reset you get fresh matches, your income tops up your balance, and a new round begins.",
    },
  },

  auth: {
    backToHome: "Back to home",
    backToLogin: "Back to log in",
    usernameLabel: "Username",
    usernamePlaceholder: "goal_machine",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    forgotPassword: "Forgot password?",
    login: {
      title: "Welcome back",
      description: "Log in to make today's pick.",
      submit: "Log in",
      cta: "New here?",
      ctaLabel: "Create an account",
    },
    signup: {
      title: "Join the Derby",
      description: "Create an account and start with F$ 10.00.",
      submit: "Sign up",
      cta: "Already playing?",
      ctaLabel: "Log in",
    },
    forgot: {
      title: "Reset your password",
      description: "Enter your email and we'll send you a reset link.",
      submit: "Send reset link",
      sentTitle: "Check your inbox",
      sentDescription:
        "If an account exists for that email, we've sent a link to reset your password.",
    },
    update: {
      title: "Set a new password",
      description: "Choose a new password for your account.",
      newPasswordLabel: "New password",
      confirmLabel: "Confirm new password",
      submit: "Update password",
    },
    checkEmail: {
      title: "Check your inbox",
      description:
        "We sent you a confirmation link. Click it to activate your account, then log in to make your first pick.",
    },
    errors: {
      missingCredentials: "Enter your email and password.",
      missingSignupCredentials:
        "Pick a username and enter your email and password.",
      passwordTooShort: "Password must be at least 6 characters.",
      passwordMismatch: "Those passwords don't match.",
      invalidResetLink: "Your reset link is invalid or has expired.",
      missingEmail: "Enter your email.",
    },
  },

  footer: {
    thanks: "Thanks for playing! ⚽",
    beta: "Beta",
    betaText:
      "This is a beta version — it may contain bugs and not all features are implemented yet. Data can be reset at any moment.",
    contribute: "Contribute on GitHub",
    suggestIdea: "Suggest an idea",
    or: "or",
    reportBug: "report a bug",
  },
};

export type Dictionary = typeof en;

export default en;
