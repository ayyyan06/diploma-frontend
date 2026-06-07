import { createRecommendationArt } from "./recommendationArt";
import type { RecommendationBook } from "../recommendations/types";

// These books are manually curated from Kitapal.kz because no API integration is used at this stage.
export const kitapalBooks: RecommendationBook[] = [
  {
    id: "abai-zholy-zhazushy",
    title: {
      en: "The Path of Abai",
      ru: "Путь Абая",
      kk: "Абай жолы",
    },
    author: {
      en: "Mukhtar Auezov",
      ru: "Мухтар Ауэзов",
      kk: "Мұхтар Әуезов",
    },
    price: 8900,
    kitapalUrl: "https://kitapal.kz/book/abay-dgoly-zhazushy",
    imageUrl: createRecommendationArt({
      title: "Абай жолы",
      subtitle: "Мұхтар Әуезов",
      accent: "#C69214",
      background: "#F9F1D8",
    }),
    description: {
      en: "A landmark epic about identity, responsibility, and the moral path of Abai within Kazakh society.",
      ru: "Эпический роман о становлении личности, ответственности и нравственном пути Абая в казахском обществе.",
      kk: "Қазақ қоғамындағы Абайдың жеке тұлғасы, жауапкершілігі және адамгершілік жолы туралы тарихи эпос.",
    },
    tags: ["wisdom", "identity", "tradition", "culture", "reflection"],
  },
  {
    id: "qara-sozder-ibraqim",
    title: {
      en: "Book of Words",
      ru: "Слова назидания",
      kk: "Қара сөздер",
    },
    author: {
      en: "Abai Kunanbayev",
      ru: "Абай Кунанбаев",
      kk: "Абай Құнанбайұлы",
    },
    price: 1210,
    kitapalUrl: "https://kitapal.kz/book/qara-sozder-ibraqim",
    imageUrl: createRecommendationArt({
      title: "Қара сөздер",
      subtitle: "Абай Құнанбайұлы",
      accent: "#8B5E3C",
      background: "#F8E9D8",
    }),
    description: {
      en: "A concise collection of reflective prose on wisdom, self-knowledge, dignity, and inner growth.",
      ru: "Сборник философских размышлений о мудрости, самопознании, достоинстве и внутреннем росте.",
      kk: "Даналық, өзін-өзі тану, ар-намыс және ішкі өсу туралы философиялық толғаулар жинағы.",
    },
    tags: ["wisdom", "reflection", "self-worth", "identity", "dignity"],
  },
  {
    id: "koshpendiler",
    title: {
      en: "The Nomads",
      ru: "Кочевники",
      kk: "Көшпенділер",
    },
    author: {
      en: "Ilyas Esenberlin",
      ru: "Ильяс Есенберлин",
      kk: "Ілияс Есенберлін",
    },
    price: 6230,
    kitapalUrl: "https://kitapal.kz/book/koshpendiler",
    imageUrl: createRecommendationArt({
      title: "Көшпенділер",
      subtitle: "Ілияс Есенберлин",
      accent: "#A15A2B",
      background: "#F6E3D3",
    }),
    description: {
      en: "A sweeping historical trilogy about statehood, leadership, courage, and the continuity of the steppe.",
      ru: "Масштабная историческая трилогия о государственности, лидерстве, мужестве и преемственности степи.",
      kk: "Мемлекеттілік, көшбасшылық, ерлік және дала сабақтастығы туралы кең ауқымды тарихи трилогия.",
    },
    tags: ["history", "leadership", "courage", "tradition", "strategy"],
  },
  {
    id: "ushqan-uya",
    title: {
      en: "The Nest That Flew Away",
      ru: "Улетевшее гнездо",
      kk: "Ұшқан ұя",
    },
    author: {
      en: "Bauyrzhan Momyshuly",
      ru: "Бауыржан Момышулы",
      kk: "Бауыржан Момышұлы",
    },
    price: 3200,
    kitapalUrl: "https://kitapal.kz/book/ushqan-uya25112022083820",
    imageUrl: createRecommendationArt({
      title: "Ұшқан ұя",
      subtitle: "Бауыржан Момышұлы",
      accent: "#6C8A6D",
      background: "#E8F1E8",
    }),
    description: {
      en: "A memoir grounded in family memory, upbringing, and the quiet strength of tradition.",
      ru: "Мемуары, наполненные семейной памятью, воспитанием и тихой силой традиции.",
      kk: "Отбасылық жад, тәрбие және дәстүрдің тыныш күшіне негізделген естеліктер.",
    },
    tags: ["family", "care", "tradition", "identity", "courage"],
  },
  {
    id: "menin-atym-qozha",
    title: {
      en: "My Name is Kozha",
      ru: "Меня зовут Кожа",
      kk: "Менің атым Қожа",
    },
    author: {
      en: "Berdibek Sokpakbayev",
      ru: "Бердибек Сокпакбаев",
      kk: "Бердібек Соқпақбаев",
    },
    price: 2500,
    kitapalUrl: "https://kitapal.kz/book/meninh-atym-qodga",
    imageUrl: createRecommendationArt({
      title: "Менің атым Қожа",
      subtitle: "Бердібек Соқпақбаев",
      accent: "#4C7EA8",
      background: "#E7F1F8",
    }),
    description: {
      en: "A lively coming-of-age story about identity, self-worth, family bonds, and finding your own voice.",
      ru: "Живая история взросления о самоидентификации, самооценке, семейных узах и поиске себя.",
      kk: "Жеке тұлға, өзін-өзі бағалау, отбасылық байланыстар және өз дауысыңды табу туралы өршіл өсу тарихы.",
    },
    tags: ["identity", "family", "self-worth", "culture", "reflection"],
  },
];
