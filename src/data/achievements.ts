import type {
  AltynAdamAchievementDefinition,
  LocalizedText,
} from "../types/altynAdam";

const text = (en: string, ru: string, kk: string): LocalizedText => ({
  en,
  ru,
  kk,
});

export const ACHIEVEMENT_FALLBACK_IMAGE =
  "/images/achievements/badge-first-steps.png";

export const MOST_ACHIEVEMENTS_TARGET = 15;

export const ALTTYN_ADAM_ACHIEVEMENTS: readonly AltynAdamAchievementDefinition[] =
  [
    {
      id: "first-steps",
      title: text("First Steps", "Первые шаги", "Алғашқы қадамдар"),
      description: text(
        "Complete 2 tests.",
        "Пройти 2 теста.",
        "2 тестті аяқтау.",
      ),
      image: "/images/achievements/badge-first-steps.png",
    },
    {
      id: "explorer",
      title: text("Explorer", "Исследователь", "Зерттеуші"),
      description: text(
        "Complete 3 tests.",
        "Пройти 3 теста.",
        "3 тестті аяқтау.",
      ),
      image: "/images/achievements/badge-explorer.png",
    },
    {
      id: "self-seeker",
      title: text("Self Seeker", "Искатель себя", "Өзіңді іздеуші"),
      description: text(
        "Complete 4 tests.",
        "Пройти 4 теста.",
        "4 тестті аяқтау.",
      ),
      image: "/images/achievements/badge-self-seeker.png",
    },
    {
      id: "completed-journey",
      title: text("Completed Journey", "Завершённый путь", "Аяқталған жол"),
      description: text(
        "Complete all 5 tests.",
        "Пройти все 5 тестов.",
        "Барлық 5 тестті аяқтау.",
      ),
      image: "/images/achievements/badge-completed-journey.png",
    },
    {
      id: "first-meeting",
      title: text("First Meeting", "Первое знакомство", "Алғашқы танысу"),
      description: text(
        "Talk to Altyn Adam for the first time.",
        "Впервые поговорить с Алтын Адамом.",
        "Алтын Адаммен алғаш рет сөйлесу.",
      ),
      image: "/images/achievements/badge-first-meeting.png",
    },
    {
      id: "culture-friend",
      title: text("Culture Friend", "Друг культуры", "Мәдениет досы"),
      description: text(
        "Reach 50 friendship points.",
        "Набрать 50 очков дружбы.",
        "50 достық ұпайына жету.",
      ),
      image: "/images/achievements/badge-culture-friend.png",
    },
    {
      id: "knowledge-keeper",
      title: text("Knowledge Keeper", "Хранитель знаний", "Білім сақтаушысы"),
      description: text(
        "Reach 90 friendship points.",
        "Набрать 90 очков дружбы.",
        "90 достық ұпайына жету.",
      ),
      image: "/images/achievements/badge-knowledge-keeper.png",
    },
    {
      id: "altyn-adam-favorite",
      title: text(
        "Altyn Adam's Favorite",
        "Любимец Алтын Адама",
        "Алтын Адамның сүйіктісі",
      ),
      description: text(
        "Reach 140 friendship points.",
        "Набрать 140 очков дружбы.",
        "140 достық ұпайына жету.",
      ),
      image: "/images/achievements/badge-altyn-adam-favorite.png",
    },
    {
      id: "curious-traveler",
      title: text(
        "Curious Traveler",
        "Любознательный путник",
        "Қызығушы саяхатшы",
      ),
      description: text(
        "Complete 5 cultural dialogues.",
        "Завершить 5 культурных диалогов.",
        "5 мәдени диалогты аяқтау.",
      ),
      image: "/images/achievements/badge-curious-traveler.png",
    },
    {
      id: "good-listener",
      title: text("Good Listener", "Хороший слушатель", "Жақсы тыңдаушы"),
      description: text(
        "Answer 10 knowledge checks correctly.",
        "Правильно ответить на 10 вопросов после диалогов.",
        "Диалогтан кейінгі 10 сұраққа дұрыс жауап беру.",
      ),
      image: "/images/achievements/badge-good-listener.png",
    },
    {
      id: "steppe-scholar",
      title: text("Steppe Scholar", "Знаток степи", "Дала білгірі"),
      description: text(
        "Answer 25 knowledge checks correctly.",
        "Правильно ответить на 25 вопросов после диалогов.",
        "Диалогтан кейінгі 25 сұраққа дұрыс жауап беру.",
      ),
      image: "/images/achievements/badge-steppe-scholar.png",
    },
    {
      id: "culture-explorer",
      title: text(
        "Culture Explorer",
        "Исследователь культуры",
        "Мәдениет зерттеушісі",
      ),
      description: text(
        "Complete cultural dialogues for all results of one test.",
        "Завершить культурные диалоги для всех результатов одного теста.",
        "Бір тесттің барлық нәтижелері бойынша мәдени диалогтарды аяқтау.",
      ),
      image: "/images/achievements/badge-culture-explorer.png",
    },
    {
      id: "steppe-sage",
      title: text("Steppe Sage", "Мудрец степи", "Дала данасы"),
      description: text(
        "Complete every available cultural dialogue.",
        "Завершить все доступные культурные диалоги.",
        "Қол жетімді барлық мәдени диалогтарды аяқтау.",
      ),
      image: "/images/achievements/badge-steppe-sage.png",
    },
    {
      id: "fast-learner",
      title: text("Fast Learner", "Быстрый ученик", "Жылдам үйренуші"),
      description: text(
        "Unlock 3 achievements in one day.",
        "Открыть 3 достижения за один день.",
        "Бір күнде 3 жетістік ашу.",
      ),
      image: "/images/achievements/badge-fast-learner.png",
    },
    {
      id: "flawless",
      title: text("Flawless", "Без ошибок", "Қатесіз"),
      description: text(
        "Answer 5 questions correctly in a row.",
        "Дать 5 правильных ответов подряд.",
        "Қатарынан 5 сұраққа дұрыс жауап беру.",
      ),
      image: "/images/achievements/badge-flawless.png",
    },
    {
      id: "heir-of-the-steppe",
      title: text(
        "Heir of the Steppe",
        "Наследник степи",
        "Дала мұрагері",
      ),
      description: text(
        "Unlock most achievements.",
        "Открыть большинство достижений.",
        "Жетістіктердің көбін ашу.",
      ),
      image: "/images/achievements/badge-heir-of-the-steppe.png",
    },
    {
      id: "story-lover",
      title: text("Story Lover", "Любитель историй", "Хикая жанкүйері"),
      description: text(
        "Choose story or history branches 5 times.",
        "5 раз выбрать сюжетные или исторические ветки.",
        "Сюжеттік не тарихи тармақтарды 5 рет таңдау.",
      ),
      image: "/images/achievements/badge-story-lover.png",
    },
    {
      id: "culture-enthusiast",
      title: text(
        "Culture Enthusiast",
        "Ценитель культуры",
        "Мәдениет жанашыры",
      ),
      description: text(
        "Complete 10 cultural dialogues.",
        "Завершить 10 культурных диалогов.",
        "10 мәдени диалогты аяқтау.",
      ),
      image: "/images/achievements/badge-culture-enthusiast.png",
    },
    {
      id: "loyal-friend",
      title: text("Loyal Friend", "Верный друг", "Адал дос"),
      description: text(
        "Return to the platform on 3 different days.",
        "Вернуться на платформу в 3 разных дня.",
        "Платформаға 3 бөлек күні қайта келу.",
      ),
      image: "/images/achievements/badge-loyal-friend.png",
    },
    {
      id: "secret-achievement",
      title: text("Voice of the Steppe", "Голос степи", "Дала үні"),
      description: text(
        "Complete at least one cultural dialogue in every main test type.",
        "Завершить хотя бы один культурный диалог в каждом основном типе теста.",
        "Әр негізгі тест түрінде кемінде бір мәдени диалогты аяқтау.",
      ),
      image: "/images/achievements/badge-secret-achievement.png",
      isSecret: true,
    },
  ] as const;

export const ALTTYN_ADAM_ACHIEVEMENT_IDS = ALTTYN_ADAM_ACHIEVEMENTS.map(
  (achievement) => achievement.id,
);

export const ALTTYN_ADAM_ACHIEVEMENTS_BY_ID = Object.fromEntries(
  ALTTYN_ADAM_ACHIEVEMENTS.map((achievement) => [achievement.id, achievement]),
) as Record<string, AltynAdamAchievementDefinition>;
