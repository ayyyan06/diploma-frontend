import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { tokenManager } from "../api/apiutils";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  // Проверяем только access token
  const token = tokenManager.getToken();

  // Если токен существует — пускаем
  // Если нет — редирект на логин
  return token ? children : <Navigate to="/auth" replace />;
}
