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
  };
  result: {
    title: string;
    note: string;
    matchingPercentage: string;
    matchedTraits: string;
    restart: string;
    fallbackTrait: string;
  };
  errors: {
    load: string;
    start: string;
    answer: string;
  };
};

const TITLE = "Who are you from Kazakh cultural figures?";
const DESCRIPTION =
  "An adaptive test based on facts about you. It gradually matches you with the Kazakh cultural figure you are closest to.";

const COPY: Record<AdaptiveFigureLanguage, AdaptiveFigureUiCopy> = {
  en: {
    card: {
      eyebrow: "Featured adaptive test",
      title: TITLE,
      description: DESCRIPTION,
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
        "Altyn Adam keeps refining your closest match based on facts about you, not random guessing.",
      thinking: "Thinking...",
      factsBadge: "Based on facts about you",
      adaptiveBadge: "Adaptive length, not fixed",
      yes: "Yes",
      fiftyFifty: "50/50",
      no: "No",
    },
    result: {
      title: "Your closest Kazakh cultural figure is:",
      note: "This result is based on facts about you and the pattern of your answers.",
      matchingPercentage: "Matching percentage",
      matchedTraits: "Matched traits",
      restart: "Restart",
      fallbackTrait: "Best overall fit after your answers",
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
        "Это адаптивный тест, основанный на фактах о вас. Он постепенно находит, к какому казахскому культурному деятелю вы ближе всего.",
      coverPlaceholder: "Обложка появится позже",
      start: "Начать тест",
    },
    intro: {
      eyebrow: "Адаптивный тест",
      badge: "Основано на фактах о вас",
      hint: "Длина теста адаптивна: обычно 4-12 вопросов, в зависимости от того, как быстро проясняется ваш профиль.",
    },
    question: {
      questionOf: (current) => `ВОПРОС ${current}`,
      hostHint:
        "Алтын Адам уточняет ваше совпадение на основе фактов о вас, а не случайного угадывания.",
      thinking: "Думаю...",
      factsBadge: "Факты о вас",
      adaptiveBadge: "Длина не фиксирована",
      yes: "Да",
      fiftyFifty: "50/50",
      no: "Нет",
    },
    result: {
      title: "Вам ближе всего этот казахский культурный деятель:",
      note: "Этот результат основан на фактах о вас и на том, как сложился паттерн ваших ответов.",
      matchingPercentage: "Процент совпадения",
      matchedTraits: "Совпавшие черты",
      restart: "Начать заново",
      fallbackTrait: "Лучшее общее совпадение по вашим ответам",
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
      title: "Қазақ мәдени тұлғаларының қайсысына ұқсайсыз?",
      description:
        "Бұл сіз туралы фактілерге негізделген адаптивті тест. Ол сіздің қазақ мәдени тұлғаларының қайсысына ең жақын екеніңізді біртіндеп анықтайды.",
      coverPlaceholder: "Мұқаба кейін қосылады",
      start: "Тестті бастау",
    },
    intro: {
      eyebrow: "Адаптивті тест",
      badge: "Сіз туралы фактілерге негізделген",
      hint: "Тест уақыты бейімделеді: әдетте 4-12 сұрақ, профиліңіз қаншалықты тез айқындалатынына байланысты.",
    },
    question: {
      questionOf: (current) => `${current}-сұрақ`,
      hostHint:
        "Алтын Адам сіздің жақын сәйкестігіңізді сіз туралы фактілерге сүйеніп нақтылайды, бұл жай ғана болжап табу емес.",
      thinking: "Ойланып тұр...",
      factsBadge: "Сіз туралы фактілер",
      adaptiveBadge: "Ұзақтығы бекітілмеген",
      yes: "Иә",
      fiftyFifty: "50/50",
      no: "Жоқ",
    },
    result: {
      title: "Сізге ең жақын қазақ мәдени тұлғасы:",
      note: "Бұл нәтиже сіз туралы фактілерге және жауаптарыңыздың үлгісіне негізделген.",
      matchingPercentage: "Сәйкестік пайызы",
      matchedTraits: "Сәйкес келген белгілер",
      restart: "Қайта бастау",
      fallbackTrait: "Жауаптарыңыз бойынша ең жақын жалпы сәйкестік",
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
