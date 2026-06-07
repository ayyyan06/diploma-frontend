export type { LocalizedText } from "../types/altynAdam";

export type RecommendationTag =
  | "wisdom"
  | "leadership"
  | "history"
  | "family"
  | "courage"
  | "identity"
  | "calmness"
  | "strategy"
  | "tradition"
  | "care"
  | "dignity"
  | "inner-strength"
  | "self-worth"
  | "culture"
  | "reflection"
  | "responsibility";

export interface ProfileTestResult {
  test_id: number;
  test_type: string;
  test_title: string;
  result: {
    resultKey: string;
    title: string;
    subtitle: string | null;
    tagline: string;
    description: string;
  };
}

export interface RecommendationBook {
  id: string;
  title: LocalizedText;
  author: LocalizedText;
  price: number;
  kitapalUrl: string;
  imageUrl: string;
  description: LocalizedText;
  tags: RecommendationTag[];
}

export interface RecommendationMovie {
  id: string;
  title: LocalizedText;
  director: LocalizedText;
  imageUrl: string;
  learnMoreUrl: string;
  description: LocalizedText;
  tags: RecommendationTag[];
}

export interface MatchedRecommendationBook extends RecommendationBook {
  matchedTags: RecommendationTag[];
  matchCount: number;
}

export interface MatchedRecommendationMovie extends RecommendationMovie {
  matchedTags: RecommendationTag[];
  matchCount: number;
}
