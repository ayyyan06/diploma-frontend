import { useEffect, useRef, useState } from "react";

export const BauyrsaqAdventurePage = () => {
  const gameFrameRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === gameFrameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleFullscreenToggle = async () => {
    if (!gameFrameRef.current) return;

    if (document.fullscreenElement === gameFrameRef.current) {
      await document.exitFullscreen();
    } else {
      await gameFrameRef.current.requestFullscreen();
    }
  };

  const handleIframeFocus = () => {
    iframeRef.current?.focus();
  };

  return (
    <div
      className="
        min-h-screen pb-14
        bg-[radial-gradient(circle_at_top_center,rgba(242,194,0,0.12),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fffdf7_100%)]
      "
    >
      <main
        className="
          mx-auto mt-14 max-w-[1240px]
          px-12
          max-[900px]:px-6
          max-[640px]:mt-8
          max-[640px]:px-4
        "
      >
        <h1
          className="
            mb-14 text-center
            text-[52px] font-normal leading-[1.08]
            text-[#f2c200]
            max-[900px]:mb-10
            max-[900px]:text-[40px]
            max-[640px]:text-[30px]
          "
        >
          Bauyrsaq&apos;s adventures
        </h1>

        <section className="flex flex-col items-center">
          <div
            ref={gameFrameRef}
            onClick={handleIframeFocus}
            className="
              w-full max-w-[968px]
              overflow-hidden
              rounded-[34px]
              border-[4px] border-[#f4d33b]
              bg-[#d8d8d8]
              shadow-[0_24px_44px_rgba(113,90,19,0.08)]

              max-[640px]:rounded-[24px]
              max-[640px]:border-[3px]

              fullscreen:h-screen
              fullscreen:w-screen
              fullscreen:rounded-none
              fullscreen:border-0
            "
          >
            <iframe
              ref={iframeRef}
              src="/baursak_game.html"
              title="Bauyrsaq Game"
              allowFullScreen
              className="
                block h-[800px] w-full border-0

                max-[900px]:h-[420px]
                max-[640px]:h-[300px]

                fullscreen:h-screen
              "
            />
          </div>

          <div
            className="
              mt-7 flex w-full max-w-[968px]
              justify-end
              max-[640px]:justify-center
            "
          >
            <button
              type="button"
              onClick={handleFullscreenToggle}
              className="
                min-h-[54px] min-w-[160px]
                rounded-[14px]
                bg-[#cdb8ff]
                px-6
                text-[16px] font-semibold text-white
                shadow-[0_14px_28px_rgba(144,122,213,0.2)]
                transition-opacity
                hover:opacity-90

                max-[640px]:w-full
              "
            >
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
