import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { tokenManager } from "../api/apiutils";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = tokenManager.getToken();
  const refreshToken = tokenManager.getRefreshToken();

  const isAuth = !!token && !!refreshToken;

  return isAuth ? children : <Navigate to="/auth" replace />;
}
