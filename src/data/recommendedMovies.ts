import { createRecommendationArt } from "./recommendationArt";
import type { RecommendationMovie } from "../recommendations/types";

export const recommendedMovies: RecommendationMovie[] = [
  {
    id: "nomad",
    title: "Көшпенділер (Nomad)",
    director: "Sergei Bodrov",
    learnMoreUrl: "https://www.google.com/search?q=%D0%9A%D3%A9%D1%88%D0%BF%D0%B5%D0%BD%D0%B4%D1%96%D0%BB%D0%B5%D1%80+Nomad+film",
    imageUrl: createRecommendationArt({
      title: "Көшпенділер",
      subtitle: "Sergei Bodrov",
      accent: "#A15A2B",
      background: "#F7E5D8",
    }),
    description:
      "A historical epic centered on leadership, statehood, and the courage needed to defend identity.",
    tags: ["history", "leadership", "courage", "identity", "tradition"],
  },
  {
    id: "zhauzhurek-myn-bala",
    title: "Жаужүрек мың бала",
    director: "Akan Satayev",
    learnMoreUrl: "https://www.google.com/search?q=%D0%96%D0%B0%D1%83%D0%B6%D2%AF%D1%80%D0%B5%D0%BA+%D0%BC%D1%8B%D2%A3+%D0%B1%D0%B0%D0%BB%D0%B0+film",
    imageUrl: createRecommendationArt({
      title: "Жаужүрек мың бала",
      subtitle: "Akan Satayev",
      accent: "#B0452A",
      background: "#F8E7E0",
    }),
    description:
      "A stirring story of bravery, unity, and stepping into responsibility for the sake of your people.",
    tags: ["courage", "leadership", "history", "responsibility"],
  },
  {
    id: "tomiris",
    title: "Томирис",
    director: "Akan Satayev",
    learnMoreUrl: "https://www.google.com/search?q=%D0%A2%D0%BE%D0%BC%D0%B8%D1%80%D0%B8%D1%81+film",
    imageUrl: createRecommendationArt({
      title: "Томирис",
      subtitle: "Akan Satayev",
      accent: "#8F2E45",
      background: "#F8E5EA",
    }),
    description:
      "A powerful portrait of courage, dignity, and strategic leadership in the face of empire.",
    tags: ["courage", "leadership", "strategy", "history", "dignity"],
  },
  {
    id: "kazakh-khanate",
    title: "Қазақ хандығы",
    director: "Rustem Abdrashov",
    learnMoreUrl: "https://www.google.com/search?q=%D2%9A%D0%B0%D0%B7%D0%B0%D2%9B+%D1%85%D0%B0%D0%BD%D0%B4%D1%8B%D2%93%D1%8B+film",
    imageUrl: createRecommendationArt({
      title: "Қазақ хандығы",
      subtitle: "Rustem Abdrashov",
      accent: "#8F6A2A",
      background: "#F4E9D4",
    }),
    description:
      "A screen journey through the making of the Khanate, with themes of responsibility, history, and tradition.",
    tags: ["history", "leadership", "responsibility", "tradition", "strategy"],
  },
  {
    id: "menin-atym-qozha-film",
    title: "Менің атым Қожа",
    director: "Abdulla Karsakbayev",
    learnMoreUrl: "https://www.google.com/search?q=%D0%9C%D0%B5%D0%BD%D1%96%D2%A3+%D0%B0%D1%82%D1%8B%D0%BC+%D2%9A%D0%BE%D0%B6%D0%B0+film",
    imageUrl: createRecommendationArt({
      title: "Менің атым Қожа",
      subtitle: "Abdulla Karsakbayev",
      accent: "#4C7EA8",
      background: "#E6F2F8",
    }),
    description:
      "A beloved classic about growing up, self-worth, family ties, and learning to understand yourself.",
    tags: ["identity", "family", "self-worth", "care", "reflection"],
  },
];
