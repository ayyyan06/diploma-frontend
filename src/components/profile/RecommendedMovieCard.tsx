import { useTranslation } from "react-i18next";
import { formatMatchedTags, getRecommendationCopy } from "../../recommendations/copy";
import type { MatchedRecommendationMovie } from "../../recommendations/types";

function clampedDescription() {
  return {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  };
}

export function RecommendedMovieCard({
  movie,
}: {
  movie: MatchedRecommendationMovie;
}) {
  const { i18n, t } = useTranslation();
  const copy = getRecommendationCopy(i18n.language);
  const lang = (i18n.language === "ru" || i18n.language === "kk") ? i18n.language : "en";
  const reason =
    movie.matchedTags.length > 0
      ? `${copy.reasonPrefix}: ${formatMatchedTags(movie.matchedTags, i18n.language)}`
      : copy.fallbackReason;

  return (
    <article className="rounded-[22px] border-2 border-[#ece7dd] bg-white p-5 transition-all duration-200 hover:border-[#f2c200] hover:shadow-[0_8px_32px_rgba(242,194,0,0.10)]">
      <div className="flex gap-4 max-[720px]:flex-col">
        <img
          src={movie.imageUrl}
          alt={movie.title[lang]}
          className="h-[132px] w-[96px] shrink-0 rounded-[16px] border border-[#f2eadb] object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-2 w-fit rounded-[6px] bg-[#FFF1F2] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#f43f5e]">
            {t("profile.recommendationTypes.movie", { defaultValue: "Movie" })}
          </span>

          <h3 className="text-[18px] font-bold text-[#111]">{movie.title[lang]}</h3>

          <p className="mt-1 text-[14px] font-medium text-[#666]">
            {movie.director[lang]}
          </p>

          <p
            className="mt-3 text-[14px] leading-relaxed text-[#666]"
            style={clampedDescription()}
          >
            {movie.description[lang]}
          </p>

          <p className="mt-3 text-[12px] italic text-[#9a8c6e]">{reason}</p>

          <a
            href={movie.learnMoreUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-fit items-center justify-center rounded-[12px] border-2 border-[#f2c200] bg-[#fff8d9] px-4 py-2 text-[13px] font-bold text-[#9a6e00] transition-all hover:bg-[#f2c200] hover:text-white"
          >
            {copy.learnMore}
          </a>
        </div>
      </div>
    </article>
  );
}
