import { useState } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/authService";

/**
  Provider d'authentification.
  Enveloppe l'application pour fournir l'état d'auth à tous les composants.
 
 *  1. Vérifie si un token existe dans le localStorage
 *  2. Si oui, demande au backend s'il est encore valide
 *  3. Si valide → Restaure la session | Si invalide → nettoie le token
*/
// ──── TEMPORAIRE POUR TEST ──────────────────────────────────
export default function AuthProvider({ children }) {
  // const [user, setUser] = useState(null); 
  const [user, setUser] = useState({
    email: "hendrickl.unity@gmail.com",
    display_name: "Hendrick",
    avatar_url: null,
  });
  // const [token, setToken] = useState(localStorage.getItem("cce_token"));
  const [token, setToken] = useState("fake-token-for-testing");
  // const [loading, setLoading] = useState(true);
  // const [loading, setLoading] = useState(false);


  /* ──── TEMPORAIRE POUR TEST ──────────────────────────────────
  // Vérification du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await authService.verifyToken(token);
          setUser(userData);
        } catch {
          localStorage.removeItem("cce_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);
  */

  /**
   * Appelée après le consentement Google réussi.
   * Envoie le credential au backend, stocke le JWT retourné.
  */
  const loginWithGoogle = async (googleCredential) => {
    try {
      const { token: jwtToken, user: userData } = await authService.googleLogin(
        googleCredential
      );
      localStorage.setItem("cce_token", jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("cce_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        // loading,
        isAuthenticated: !!user && !!token,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
