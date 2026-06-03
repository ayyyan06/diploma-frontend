import { createRecommendationArt } from "./recommendationArt";
import type { RecommendationBook } from "../recommendations/types";

// These books are manually curated from Kitapal.kz because no API integration is used at this stage.
export const kitapalBooks: RecommendationBook[] = [
  {
    id: "abai-zholy-zhazushy",
    title: "Абай жолы",
    author: "Мұхтар Әуезов",
    price: 8900,
    kitapalUrl: "https://kitapal.kz/book/abay-dgoly-zhazushy",
    imageUrl: createRecommendationArt({
      title: "Абай жолы",
      subtitle: "Мұхтар Әуезов",
      accent: "#C69214",
      background: "#F9F1D8",
    }),
    description:
      "A landmark epic about identity, responsibility, and the moral path of Abai within Kazakh society.",
    tags: ["wisdom", "identity", "tradition", "culture", "reflection"],
  },
  {
    id: "qara-sozder-ibraqim",
    title: "Қара сөздер",
    author: "Абай Құнанбайұлы",
    price: 1210,
    kitapalUrl: "https://kitapal.kz/book/qara-sozder-ibraqim",
    imageUrl: createRecommendationArt({
      title: "Қара сөздер",
      subtitle: "Абай Құнанбайұлы",
      accent: "#8B5E3C",
      background: "#F8E9D8",
    }),
    description:
      "A concise collection of reflective prose on wisdom, self-knowledge, dignity, and inner growth.",
    tags: ["wisdom", "reflection", "self-worth", "identity", "dignity"],
  },
  {
    id: "koshpendiler",
    title: "Көшпенділер",
    author: "Ілияс Есенберлин",
    price: 6230,
    kitapalUrl: "https://kitapal.kz/book/koshpendiler",
    imageUrl: createRecommendationArt({
      title: "Көшпенділер",
      subtitle: "Ілияс Есенберлин",
      accent: "#A15A2B",
      background: "#F6E3D3",
    }),
    description:
      "A sweeping historical trilogy about statehood, leadership, courage, and the continuity of the степpe.",
    tags: ["history", "leadership", "courage", "tradition", "strategy"],
  },
  {
    id: "ushqan-uya",
    title: "Ұшқан ұя",
    author: "Бауыржан Момышұлы",
    price: 3200,
    kitapalUrl: "https://kitapal.kz/book/ushqan-uya25112022083820",
    imageUrl: createRecommendationArt({
      title: "Ұшқан ұя",
      subtitle: "Бауыржан Момышұлы",
      accent: "#6C8A6D",
      background: "#E8F1E8",
    }),
    description:
      "A memoir grounded in family memory, upbringing, and the quiet strength of tradition.",
    tags: ["family", "care", "tradition", "identity", "courage"],
  },
  {
    id: "menin-atym-qozha",
    title: "Менің атым Қожа",
    author: "Бердібек Соқпақбаев",
    price: 2500,
    kitapalUrl: "https://kitapal.kz/book/meninh-atym-qodga",
    imageUrl: createRecommendationArt({
      title: "Менің атым Қожа",
      subtitle: "Бердібек Соқпақбаев",
      accent: "#4C7EA8",
      background: "#E7F1F8",
    }),
    description:
      "A lively coming-of-age story about identity, self-worth, family bonds, and finding your own voice.",
    tags: ["identity", "family", "self-worth", "culture", "reflection"],
  },
];
