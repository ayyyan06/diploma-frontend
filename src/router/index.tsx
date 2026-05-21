import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
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
import { AnimalResult } from "../pages/AnimalTest/AnimalResult";
import { AnimalQuestion } from "../pages/AnimalTest/AnimalQuestion";
import { AnimalIntroPage } from "../pages/AnimalTest/AnimalIntroPage";
import { WeaponIntroTestPage } from "../pages/Weapon/WeaponIntroPage";
import WeaponQuestion from "../pages/Weapon/WeaponQuestion";
import WeaponResult from "../pages/Weapon/WeaponResult";
import Profile from "../pages/ProfilePage";
import { SteppeRoadIntroPage } from "../pages/SteppeRoad/SteppeRoadIntroPage";
import { SteppeRoadQuestion } from "../pages/SteppeRoad/SteppeRoadQuestion";
import { SteppeRoadResult } from "../pages/SteppeRoad/SteppeRoadResult";
import { EnemyIntroPage } from "../pages/Enemy/EnemyIntroPage";
import { EnemyQuestion } from "../pages/Enemy/EnemyQuestion";
import { EnemyResult } from "../pages/Enemy/EnemyResult";
import { TestIntroPage } from "../pages/Test/TestDetailIntro";
import { TestQestionsPage } from "../pages/Test/TestQuestionsPage";
import { TestResult } from "../pages/Test/TestResult";

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
        element: <AnimalIntroPage />,
      },
      {
        path: "tests/animal-questions",
        element: <AnimalQuestion />,
      },
      {
        path: "tests/animal-result",
        element: <AnimalResult />,
      },
      {
        path: "tests/weapon-intro",
        element: <WeaponIntroTestPage />,
      },
      {
        path: "tests/weapon-questions",
        element: <WeaponQuestion />,
      },
      {
        path: "tests/weapon-result",
        element: <WeaponResult />,
      },
      {
        path: "tests/road-intro",
        element: <SteppeRoadIntroPage />,
      },
      {
        path: "tests/road-questions",
        element: <SteppeRoadQuestion />,
      },
      {
        path: "tests/road-result",
        element: <SteppeRoadResult />,
      },
      {
        path: "tests/enemy-intro",
        element: <EnemyIntroPage />,
      },
      {
        path: "tests/enemy-questions",
        element: <EnemyQuestion />,
      },
      {
        path: "tests/enemy-result",
        element: <EnemyResult />,
      },
      {
        path: "profile",
        element: <Profile />,
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
    ],
  },
]);
