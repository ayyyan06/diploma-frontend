import { kitapalBooks } from "../data/kitapalBooks";
import { recommendedMovies } from "../data/recommendedMovies";
import type {
  MatchedRecommendationBook,
  MatchedRecommendationMovie,
  ProfileTestResult,
  RecommendationBook,
  RecommendationMovie,
  RecommendationTag,
} from "./types";

const RESULT_TAG_RULES: Array<{
  tokens: string[];
  tags: RecommendationTag[];
}> = [
  {
    tokens: ["snow leopard", "phlegmatic", "қар барысы", "снежный барс"],
    tags: ["calmness", "wisdom", "identity"],
  },
  {
    tokens: [
      "shanyraq keeper",
      "mother",
      "шаңырақ сақтаушысы",
      "хранитель шанырака",
      "ана",
      "мать",
    ],
    tags: ["family", "care", "tradition"],
  },
  {
    tokens: ["zheztyrnak", "zhestyrnak", "жезтырнақ"],
    tags: ["dignity", "inner-strength", "self-worth"],
  },
  {
    tokens: ["batyr", "батыр"],
    tags: ["courage", "leadership", "history"],
  },
  {
    tokens: ["zhyrau", "жырау"],
    tags: ["wisdom", "culture", "reflection"],
  },
  {
    tokens: ["khan", "хан"],
    tags: ["leadership", "strategy", "responsibility"],
  },
  {
    tokens: ["bow", "strategist", "садақ", "стратег"],
    tags: ["strategy", "leadership", "responsibility"],
  },
  {
    tokens: ["shield", "protector", "қалқан", "защитник"],
    tags: ["family", "care", "responsibility"],
  },
  {
    tokens: ["eagle", "melancholic", "бүркіт"],
    tags: ["wisdom", "identity", "reflection"],
  },
  {
    tokens: ["horse", "sanguine", "жылқы", "лошадь"],
    tags: ["identity", "culture", "family"],
  },
  {
    tokens: ["wolf", "choleric", "қасқыр", "волк"],
    tags: ["courage", "leadership", "identity"],
  },
  {
    tokens: ["aldar kose", "алдар көсе"],
    tags: ["strategy", "identity", "culture"],
  },
];

const FALLBACK_BOOK_IDS = new Set([
  "abai-zholy-zhazushy",
  "qara-sozder-ibraqim",
  "koshpendiler",
]);

const FALLBACK_MOVIE_IDS = new Set(["nomad", "tomiris", "kazakh-khanate"]);

function collectResultTags(testResults: ProfileTestResult[]) {
  const tagSet = new Set<RecommendationTag>();

  for (const result of testResults) {
    const haystack = [
      result.result.resultKey,
      result.result.title,
      result.result.subtitle ?? "",
      result.result.tagline,
      result.test_title,
    ]
      .join(" ")
      .toLowerCase();

    for (const rule of RESULT_TAG_RULES) {
      if (rule.tokens.some((token) => haystack.includes(token))) {
        for (const tag of rule.tags) {
          tagSet.add(tag);
        }
      }
    }
  }

  return Array.from(tagSet);
}

function matchBooks(
  books: RecommendationBook[],
  resultTags: RecommendationTag[],
) {
  return books
    .map<MatchedRecommendationBook | null>((book) => {
      const matchedTags = book.tags.filter((tag) => resultTags.includes(tag));
      if (matchedTags.length === 0) return null;

      return {
        ...book,
        matchedTags,
        matchCount: matchedTags.length,
      };
    })
    .filter((book): book is MatchedRecommendationBook => Boolean(book))
    .sort((left, right) => {
      if (right.matchCount !== left.matchCount) {
        return right.matchCount - left.matchCount;
      }

      return left.title.en.localeCompare(right.title.en);
    });
}

function matchMovies(
  movies: RecommendationMovie[],
  resultTags: RecommendationTag[],
) {
  return movies
    .map<MatchedRecommendationMovie | null>((movie) => {
      const matchedTags = movie.tags.filter((tag) => resultTags.includes(tag));
      if (matchedTags.length === 0) return null;

      return {
        ...movie,
        matchedTags,
        matchCount: matchedTags.length,
      };
    })
    .filter((movie): movie is MatchedRecommendationMovie => Boolean(movie))
    .sort((left, right) => {
      if (right.matchCount !== left.matchCount) {
        return right.matchCount - left.matchCount;
      }

      return left.title.en.localeCompare(right.title.en);
    });
}

function buildFallbackBooks(books: RecommendationBook[]) {
  return books
    .filter((book) => FALLBACK_BOOK_IDS.has(book.id))
    .map<MatchedRecommendationBook>((book) => ({
      ...book,
      matchedTags: [],
      matchCount: 0,
    }));
}

function buildFallbackMovies(movies: RecommendationMovie[]) {
  return movies
    .filter((movie) => FALLBACK_MOVIE_IDS.has(movie.id))
    .map<MatchedRecommendationMovie>((movie) => ({
      ...movie,
      matchedTags: [],
      matchCount: 0,
    }));
}

export function getProfileRecommendations({
  testResults,
  books = kitapalBooks,
  movies = recommendedMovies,
}: {
  testResults: ProfileTestResult[];
  books?: RecommendationBook[];
  movies?: RecommendationMovie[];
}) {
  const resultTags = collectResultTags(testResults);
  const matchedBooks = matchBooks(books, resultTags);
  const matchedMovies = matchMovies(movies, resultTags);

  return {
    resultTags,
    books:
      matchedBooks.length > 0 ? matchedBooks : buildFallbackBooks(books),
    movies:
      matchedMovies.length > 0 ? matchedMovies : buildFallbackMovies(movies),
  };
}
