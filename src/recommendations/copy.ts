import type { RecommendationTag } from "./types";

function getNormalizedLanguage(language: string) {
  if (language.startsWith("ru")) return "ru";
  if (language.startsWith("kk")) return "kk";
  return "en";
}

const COPY = {
  en: {
    sectionTitle: "Recommendations Based on Your Results",
    booksTitle: "Books That May Interest You",
    moviesTitle: "Movies That May Interest You",
    learnMore: "Learn More",
    reasonPrefix: "Recommended because it matches your result",
    fallbackReason: "Recommended as a Kazakh culture classic",
  },
  ru: {
    sectionTitle: "Рекомендации на основе ваших результатов",
    booksTitle: "Книги, которые могут вам понравиться",
    moviesTitle: "Фильмы, которые могут вам понравиться",
    learnMore: "Подробнее",
    reasonPrefix: "Рекомендуем, потому что это совпадает с вашим результатом",
    fallbackReason: "Рекомендуем как классику казахской культуры",
  },
  kk: {
    sectionTitle: "Нәтижелеріңізге негізделген ұсыныстар",
    booksTitle: "Сізге қызық болуы мүмкін кітаптар",
    moviesTitle: "Сізге қызық болуы мүмкін фильмдер",
    learnMore: "Толығырақ",
    reasonPrefix: "Ұсыныс себебі: нәтижеңізбен сәйкес келеді",
    fallbackReason: "Қазақ мәдениетінің классикасы ретінде ұсынылады",
  },
} as const;

const TAG_LABELS: Record<string, Record<RecommendationTag, string>> = {
  en: {
    wisdom: "wisdom",
    leadership: "leadership",
    history: "history",
    family: "family",
    courage: "courage",
    identity: "identity",
    calmness: "calmness",
    strategy: "strategy",
    tradition: "tradition",
    care: "care",
    dignity: "dignity",
    "inner-strength": "inner strength",
    "self-worth": "self-worth",
    culture: "culture",
    reflection: "reflection",
    responsibility: "responsibility",
  },
  ru: {
    wisdom: "мудрость",
    leadership: "лидерство",
    history: "история",
    family: "семья",
    courage: "смелость",
    identity: "идентичность",
    calmness: "спокойствие",
    strategy: "стратегия",
    tradition: "традиция",
    care: "забота",
    dignity: "достоинство",
    "inner-strength": "внутренняя сила",
    "self-worth": "самоценность",
    culture: "культура",
    reflection: "рефлексия",
    responsibility: "ответственность",
  },
  kk: {
    wisdom: "даналық",
    leadership: "көшбасшылық",
    history: "тарих",
    family: "отбасы",
    courage: "батылдық",
    identity: "даралық",
    calmness: "байсалдылық",
    strategy: "стратегия",
    tradition: "дәстүр",
    care: "қамқорлық",
    dignity: "қадір",
    "inner-strength": "ішкі күш",
    "self-worth": "өзіндік құндылық",
    culture: "мәдениет",
    reflection: "толғаныс",
    responsibility: "жауапкершілік",
  },
};

export function getRecommendationCopy(language: string) {
  return COPY[getNormalizedLanguage(language)];
}

export function formatMatchedTags(
  tags: RecommendationTag[],
  language: string,
) {
  const normalizedLanguage = getNormalizedLanguage(language);
  return tags
    .map((tag) => TAG_LABELS[normalizedLanguage][tag])
    .join(", ");
}
