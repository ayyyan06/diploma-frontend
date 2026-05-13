import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import PrivateRoute from "./PrivateRoute";
import { Header } from "../components/Header";
import { Games } from "../pages/Games";
import { Tests } from "../pages/Tests";
import { About } from "../pages/About";
import { Auth } from "../pages/Login";
import { BauyrsaqAdventurePage } from "../components/games/BauyrsaqAdventurePage";
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
        children: [
          {
            path: "bauyrsaq",
            element: <BauyrsaqAdventurePage />,
          },
        ],
      },
      {
        path: "tests",
        element: <Tests />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);
