const en = {
  common: {
    appName: "Ruh Compass",
    tagline: "Discover Yourself",
    loading: "Loading...",
    coins: "coins",
    language: {
      label: "Language",
      en: "EN",
      ru: "RU",
      kk: "KZ",
    },
  },
  header: {
    nav: {
      home: "Home",
      tests: "Tests",
      games: "Games",
      community: "Community",
      chat: "Chat",
    },
    signIn: "Sign in",
    startTest: "Start Test",
    communityRequests: "Community",
    profileAlt: "Profile",
    logoAlt: "Ruh Compass logo",
  },
  home: {
    eyebrow: "About Ruh Compass",
    title:
      "A cultural journey through Kazakh archetypes, symbols, and stories",
    description:
      "Ruh Compass explores personality through steppe-inspired storytelling instead of generic labels.",
    heroTags: [
      "Kazakh storytelling",
      "Interactive experience",
      "Personality insights",
    ],
    exploreGames: "Explore Games",
    heroBadge: "Steppe spirit, modern play",
    features: [
      {
        value: "5",
        label: "test journeys",
        description:
          "Personality, animal-temperament, conflict-style, scenario-road, and mythic-enemy journeys inspired by Kazakh motifs.",
      },
      {
        value: "5-10 min",
        label: "to complete",
        description:
          "Short, playful sessions built for curiosity, reflection, and shareable results.",
      },
      {
        value: "100%",
        label: "culture-centered",
        description:
          "Every path is shaped by symbols, stories, and emotional tones from the steppe.",
      },
    ],
    storyEyebrow: "Why we made it",
    storyTitle: "Personality feels richer when it is cultural",
    storyDescription:
      "Built to make self-discovery warm, symbolic, and memorable.",
    paths: [
      {
        title: "Archetype stories",
        description:
          "Batyr, Zhyrau, Aldar Kose, Shanyraq Keeper archetypes.",
      },
      {
        title: "Animal temperament lens",
        description:
          "Eagle, horse, wolf, snow leopard psychology mapping.",
      },
      {
        title: "Weapon symbolism",
        description: "Bow, spear, saber, shield conflict styles.",
      },
    ],
    stepsTitle: "How it works",
    steps: [
      {
        number: "01",
        title: "Choose a path",
        description:
          "Pick personality, animal, weapon, road, or enemy journey.",
      },
      {
        number: "02",
        title: "Answer questions",
        description: "Symbolic scenarios and choices.",
      },
      {
        number: "03",
        title: "Get result",
        description: "A personal profile card, role reading, and insights.",
      },
    ],
    ctaEyebrow: "Ready to try",
    ctaTitle: "Start your archetype journey today",
    ctaButton: "Go To Tests",
  },
  games: {
    title: "Choose what Game you want to start",
    items: [
      {
        title: "Bauyrsaq's adventure",
        desc: "A playful platformer where bauyrsaq jumps, rolls and avoids obstacles.",
      },
      {
        title: "Tulpar Dash",
        desc: "A fast-paced steppe runner game inspired by legendary horses.",
      },
    ],
  },
  tests: {
    title: "Choose which test you want to start",
    loading: "Loading tests...",
    errorPrefix: "Error:",
    balanceLabel: "Your balance:",
    notEnoughHint: "— not enough for a test. Play a game to earn more!",
  },
  auth: {
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    signInToContinue: "Sign in to continue",
    fillDetails: "Fill in your details to register",
    signIn: "Sign in",
    register: "Register",
    username: "Username",
    nickname: "Nickname",
    email: "Email",
    password: "Password",
    loading: "Loading...",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    somethingWrong: "Something went wrong",
  },
  community: {
    section: "Community",
    title: "Meet the community",
    description:
      "See how others passed the tests, connect with people, build your circle.",
    searchPlaceholder: "Search by name or username…",
    noUsersFound: "No users found.",
    incomingRequests: "Friend Requests · {{count}}",
    viewResults: "View Results",
    addFriend: "Add Friend",
    pending: "Pending…",
    accept: "Accept",
    decline: "Decline",
    friends: "Friends ✓",
    testResults: "Test Results",
    noTestsCompletedYet: "No tests completed yet.",
    noFriendsYet: "No friends yet.",
    findPeople: "Find people",
  },
  profile: {
    logout: "Log out",
    resultsTab: "Test Results",
    friendsTab: "Friends",
    myResults: "My Test Results",
    myFriends: "My Friends",
    recommendationsTitle: "Recommendations From AI",
    noRecommendationsYet: "No recommendations yet.",
    recommendationsHint:
      "Complete more tests to unlock personalized suggestions.",
    recommendationWhy: "Why",
    recommendationTypes: {
      book: "Book",
      movie: "Movie",
      activity: "Activity",
      game: "Game",
      music: "Music",
    },
    noTestsCompletedYet: "No tests completed yet.",
    takeTest: "Take a Test",
    noFriendsYet: "No friends yet.",
    meetCommunity: "Meet the Community",
    strengths: "Strengths",
    growthAreas: "Growth Areas",
    removeFriend: "Remove",
    removeFriendTitle: "Remove friend",
    expand: "Expand",
    collapse: "Collapse",
  },
  chat: {
    channels: "Channels",
    globalChat: "Global Chat",
    directMessages: "Direct Messages",
    noFriendsYet: "No friends yet.",
    findPeople: "Find people",
    everyoneCanSeeThis: "Everyone can see this",
    connected: "Connected",
    connecting: "Connecting…",
    beFirst: "Be the first to say something!",
    startConversation: "Start a conversation with {{name}}",
    messageGlobal: "Message global chat…",
    messageUser: "Message {{name}}…",
    enterToSend: "Enter to send · Shift+Enter for new line",
  },
  testIntro: {
    loading: "Loading...",
    notFound: "Test not found",
    step: "Step 1 · Before you begin",
    testCost: "Test cost",
    yourBalance: "Your balance",
    notEnoughCoins: "Not enough coins",
    notEnoughDescription:
      "You need {{cost}} coins to start this test. Play a game to earn more coins and come back!",
    goToGames: "Go to Games →",
    startTest: "START TEST",
    needCoins: "NEED {{cost}} COINS",
    startTooltip: "Start the test",
    needTooltip: "You need {{cost}} coins to start",
  },
  testQuestions: {
    loading: "Loading...",
    notFound: "Test not found",
    questionOf: "QUESTION {{current}} OF {{total}}",
    typeTest: "{{type}} test",
    defaultPrompt:
      "Think about your usual pattern across time, not your ideal self.",
    question: "Question",
    back: "BACK",
    next: "NEXT",
    seeResult: "SEE RESULT",
    submitting: "SUBMITTING...",
    answerOptions: "Answer options",
  },
  testResult: {
    loading: "Loading your result...",
    errorLoading: "Error loading result",
    noResultYet: "No result yet",
    takeTestFirst: "Please take the test first.",
    goToTest: "GO TO TEST",
    yourResult: "YOUR RESULT:",
    coreTraits: "Core traits",
    description: "Description",
    strengths: "Strengths",
    growthAreas: "Growth areas",
    bigFive: "Big Five Breakdown",
    shadowArchetype: "Shadow archetype",
    developmentFocus: "Development focus",
    temperament: "Temperament",
    scores: "Scores",
    eysenckAxes: "Eysenck Axes",
    temperamentQuadrant: "Temperament quadrant",
    weaponScores: "Weapon scores",
    retake: "RETAKE TEST",
    failedToLoad: "Failed to load result",
  },
  altynAdam: {
    name: "Altyn Adam",
    actions: {
      continue: "Continue",
      goToProfile: "Go to Profile",
    },
    welcome: {
      imageAlt: "Altyn Adam welcomes the user",
      message:
        "Welcome back! Shall we continue the journey through Kazakh culture?",
    },
    reminder: {
      imageAlt: "Altyn Adam suggests visiting the profile",
      message:
        "I prepared personal book and movie recommendations for you. Take a look at your profile — there may be works there that you will enjoy.",
    },
  },
};

export default en;
