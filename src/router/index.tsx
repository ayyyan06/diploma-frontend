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
import { ChatPage } from "../pages/ChatPage";
import PrivateRoute from "./PrivateRoute";

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
        element: (
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        ),
      },
      {
        path: "games/bauyrsaq",
        element: (
          <PrivateRoute>
            <BauyrsaqAdventurePage />
          </PrivateRoute>
        ),
      },
      {
        path: "games/tulpar",
        element: (
          <PrivateRoute>
            <TulparDash />
          </PrivateRoute>
        ),
      },
      {
        path: "tests",
        element: (
          <PrivateRoute>
            <Tests />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "tests/:id/intro",
        element: (
          <PrivateRoute>
            <TestIntroPage />
          </PrivateRoute>
        ),
      },
      {
        path: "tests/:id",
        element: (
          <PrivateRoute>
            <TestQestionsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "tests/:id/result",
        element: (
          <PrivateRoute>
            <TestResult />
          </PrivateRoute>
        ),
      },
      {
        path: "community",
        element: (
          <PrivateRoute>
            <CommunityPage />
          </PrivateRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
