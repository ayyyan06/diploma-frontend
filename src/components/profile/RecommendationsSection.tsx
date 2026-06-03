import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { kitapalBooks } from "../../data/kitapalBooks";
import { recommendedMovies } from "../../data/recommendedMovies";
import { getRecommendationCopy } from "../../recommendations/copy";
import { getProfileRecommendations } from "../../recommendations/getProfileRecommendations";
import type {
  ProfileTestResult,
  RecommendationBook,
  RecommendationMovie,
} from "../../recommendations/types";
import { RecommendedBookCard } from "./RecommendedBookCard";
import { RecommendedMovieCard } from "./RecommendedMovieCard";

export function RecommendationsSection({
  testResults,
  recommendedBooks = kitapalBooks,
  recommendedMovies: movieCatalog = recommendedMovies,
}: {
  testResults: ProfileTestResult[];
  recommendedBooks?: RecommendationBook[];
  recommendedMovies?: RecommendationMovie[];
}) {
  const { i18n } = useTranslation();
  const copy = getRecommendationCopy(i18n.language);

  const { books, movies } = useMemo(
    () =>
      getProfileRecommendations({
        testResults,
        books: recommendedBooks,
        movies: movieCatalog,
      }),
    [movieCatalog, recommendedBooks, testResults],
  );

  if (testResults.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="mb-5 text-[13px] font-bold uppercase tracking-widest text-[#9a8c6e]">
        {copy.sectionTitle}
      </h2>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-[18px] font-bold text-[#111]">
            {copy.booksTitle}
          </h3>

          <div className="space-y-4">
            {books.map((book) => (
              <RecommendedBookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-[18px] font-bold text-[#111]">
            {copy.moviesTitle}
          </h3>

          <div className="space-y-4">
            {movies.map((movie) => (
              <RecommendedMovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
