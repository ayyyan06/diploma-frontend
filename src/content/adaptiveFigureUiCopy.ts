type AdaptiveFigureLanguage = "en" | "ru" | "kk";

type AdaptiveFigureUiCopy = {
  card: {
    eyebrow: string;
    title: string;
    description: string;
    coverPlaceholder: string;
    start: string;
  };
  intro: {
    eyebrow: string;
    badge: string;
    hint: string;
  };
  question: {
    questionOf: (current: number) => string;
    hostHint: string;
    thinking: string;
    factsBadge: string;
    adaptiveBadge: string;
    yes: string;
    fiftyFifty: string;
    no: string;
    answersAriaLabel: string;
    hostAlt: string;
  };
  result: {
    title: string;
    note: string;
    matchingPercentage: string;
    matchedTraits: string;
    restart: string;
    fallbackTrait: string;
    successAlt: string;
  };
  errors: {
    load: string;
    start: string;
    answer: string;
  };
};

const COPY: Record<AdaptiveFigureLanguage, AdaptiveFigureUiCopy> = {
  en: {
    card: {
      eyebrow: "Featured adaptive test",
      title: "Who are you from Kazakh cultural figures?",
      description:
        "An adaptive test based on facts about you. It gradually matches you with the Kazakh cultural figure you are closest to.",
      coverPlaceholder: "Cover image coming soon",
      start: "Start test",
    },
    intro: {
      eyebrow: "Adaptive figure test",
      badge: "Based on facts about you",
      hint: "Adaptive length: usually 4-12 questions, depending on how quickly your profile becomes clear.",
    },
    question: {
      questionOf: (current) => `QUESTION ${current}`,
      hostHint:
        "Altyn Adam keeps refining your result based on facts about you, not random guessing.",
      thinking: "Thinking...",
      factsBadge: "Based on facts about you",
      adaptiveBadge: "Adaptive length, not fixed",
      yes: "Yes",
      fiftyFifty: "50/50",
      no: "No",
      answersAriaLabel: "Adaptive answer choices",
      hostAlt: "Altyn Adam, the test host",
    },
    result: {
      title: "Your closest Kazakh cultural figure is:",
      note: "This result is based on facts about you and the pattern of your answers.",
      matchingPercentage: "Matching percentage",
      matchedTraits: "Matched traits",
      restart: "Restart",
      fallbackTrait: "Best overall fit after your answers",
      successAlt: "Altyn Adam celebrating the result",
    },
    errors: {
      load: "Failed to load the adaptive test.",
      start: "Failed to start the adaptive test.",
      answer: "Failed to submit the answer.",
    },
  },
  ru: {
    card: {
      eyebrow: "Особый адаптивный тест",
      title: "Кто вы из казахских культурных деятелей?",
      description:
        "Адаптивный тест, основанный на фактах о вас. Он постепенно определяет, к какому казахскому культурному деятелю вы ближе всего.",
      coverPlaceholder: "Обложка появится позже",
      start: "Начать тест",
    },
    intro: {
      eyebrow: "Адаптивный тест",
      badge: "Основано на фактах о вас",
      hint: "Адаптивная длина: обычно 4-12 вопросов, в зависимости от того, как быстро проясняется ваш профиль.",
    },
    question: {
      questionOf: (current) => `ВОПРОС ${current}`,
      hostHint:
        "Алтын Адам уточняет ваш результат по фактам о вас, а не угадывает случайно.",
      thinking: "Думаю...",
      factsBadge: "Факты о вас",
      adaptiveBadge: "Длина не фиксирована",
      yes: "Да",
      fiftyFifty: "50/50",
      no: "Нет",
      answersAriaLabel: "Варианты ответа",
      hostAlt: "Алтын Адам, ведущий теста",
    },
    result: {
      title: "Ближе всего вам этот казахский культурный деятель:",
      note: "Этот результат основан на фактах о вас и на том, как сложился рисунок ваших ответов.",
      matchingPercentage: "Процент совпадения",
      matchedTraits: "Совпавшие черты",
      restart: "Пройти заново",
      fallbackTrait: "Лучшее общее совпадение по вашим ответам",
      successAlt: "Алтын Адам на финальном экране",
    },
    errors: {
      load: "Не удалось загрузить адаптивный тест.",
      start: "Не удалось начать адаптивный тест.",
      answer: "Не удалось отправить ответ.",
    },
  },
  kk: {
    card: {
      eyebrow: "Ерекше адаптивті тест",
      title: "Сіз қазақ мәдени тұлғаларының қайсысына көбірек ұқсайсыз?",
      description:
        "Сіз туралы фактілерге негізделген адаптивті тест. Ол сіздің қай қазақ мәдени тұлғасына жақын екеніңізді біртіндеп анықтайды.",
      coverPlaceholder: "Мұқаба кейін қосылады",
      start: "Тестті бастау",
    },
    intro: {
      eyebrow: "Адаптивті тест",
      badge: "Сіз туралы фактілерге негізделген",
      hint: "Тест ұзақтығы бейімделеді: әдетте 4-12 сұрақ, профиліңіз қаншалықты тез айқындалатынына байланысты.",
    },
    question: {
      questionOf: (current) => `${current}-СҰРАҚ`,
      hostHint:
        "Алтын Адам сіз туралы фактілерге сүйеніп, нәтижені біртіндеп нақтылайды.",
      thinking: "Ойланып тұр...",
      factsBadge: "Сіз туралы фактілер",
      adaptiveBadge: "Ұзақтығы бекітілмеген",
      yes: "Иә",
      fiftyFifty: "50/50",
      no: "Жоқ",
      answersAriaLabel: "Жауап нұсқалары",
      hostAlt: "Алтын Адам, тест жүргізушісі",
    },
    result: {
      title: "Сізге ең жақын қазақ мәдени тұлғасы:",
      note: "Бұл нәтиже сіз туралы фактілерге және жауаптарыңыздың үлгісіне негізделген.",
      matchingPercentage: "Сәйкестік пайызы",
      matchedTraits: "Сәйкес келген белгілер",
      restart: "Қайта өту",
      fallbackTrait: "Жауаптарыңыз бойынша ең жақын жалпы сәйкестік",
      successAlt: "Алтын Адам финалдық экранда",
    },
    errors: {
      load: "Адаптивті тестті жүктеу мүмкін болмады.",
      start: "Адаптивті тестті бастау мүмкін болмады.",
      answer: "Жауапты жіберу мүмкін болмады.",
    },
  },
};

function normalizeLanguage(language: string): AdaptiveFigureLanguage {
  if (language.startsWith("ru")) return "ru";
  if (language.startsWith("kk")) return "kk";
  return "en";
}

export function getAdaptiveFigureUiCopy(language: string) {
  return COPY[normalizeLanguage(language)];
}
