import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import PrivateRoute from "./PrivateRoute";
import { Header } from "../components/Header";
import { Games } from "../pages/Games";
import { Tests } from "../pages/Tests";
import { About } from "../pages/About";
import { Auth } from "../pages/Login";
import { BauyrsaqAdventurePage } from "../components/games/BauyrsaqAdventurePage";
import { TulparDash } from "../components/games/TulparDash";
import { PersonalityTestIntroPage } from "../pages/Personality/Personality";
import { PersonalityQuestion } from "../pages/Personality/PersonalityQuestion";
import { PersonalityResult } from "../pages/Personality/PersonalityResult";
import AnimalTestIntroPage from "../pages/AnimalTest/AnimalIntroPage";
import { AnimalResult } from "../pages/AnimalTest/AnimalResult";
import { AnimalQuestion } from "../pages/AnimalTest/AnimalQuestion";

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
        path: "about",
        element: <About />,
      },
      {
        path: "tests/personality-intro",
        element: <PersonalityTestIntroPage />,
      },
      {
        path: "tests/personality-questions",
        element: <PersonalityQuestion />,
      },
      {
        path: "tests/personality-result",
        element: <PersonalityResult />,
      },
      {
        path: "tests/animal-intro",
        element: <AnimalTestIntroPage />,
      },
      {
        path: "tests/animal-questions",
        element: <AnimalQuestion />,
      },
      {
        path: "tests/animal-result",
        element: <AnimalResult />,
      },
    ],
  },
]);
