import { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/api";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    getToken().then(setTokenState);
  }, []);

  if (token === undefined) return null; // en cours de vérification
  if (token === null) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
