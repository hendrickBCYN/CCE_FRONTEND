import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook pour accéder à l'état d'authentification.
 * Utilisable dans n'importe quel composant enfant de AuthProvider.
 *
 * Exemple : const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
