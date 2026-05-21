import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Header } from "../components/Header";
import { Games } from "../pages/Games";
import { Tests } from "../pages/Tests";
import { Auth } from "../pages/Login";
import { BauyrsaqAdventurePage } from "../components/games/BauyrsaqAdventurePage";
import { TulparDash } from "../components/games/TulparDash";
import { TestIntroPage } from "../pages/Test/TestDetailIntro";
import { TestQestionsPage } from "../pages/Test/TestQuestionsPage";
import { TestResult } from "../pages/Test/TestResult";
import { CommunityPage } from "../pages/CommunityPage";
import { ProfilePage } from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/",
    element: <Header />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "games",
        element: <Games />,
      },
      {
        path: "games/bauyrsaq",
        element: <BauyrsaqAdventurePage />,
      },
      {
        path: "games/tulpar",
        element: <TulparDash />,
      },
      {
        path: "tests",
        element: <Tests />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "tests/:id/intro",
        element: <TestIntroPage />,
      },
      {
        path: "tests/:id",
        element: <TestQestionsPage />,
      },
      {
        path: "tests/:id/result",
        element: <TestResult />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
    ],
  },
]);
