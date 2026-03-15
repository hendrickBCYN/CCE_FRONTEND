import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";
import logoBYCN from "../../assets/logoBYCN.png";

/**
 Page d'authentification.
 Flux :
 *  1. L'utilisateur clique sur "Se connecter avec Google"
 *  2. Google affiche la popup de consentement
 *  3. Après consentement, Google retourne un credential (JWT)
 *  4. On envoie ce credential au backend via loginWithGoogle()
 *  5. Le backend vérifie auprès de Google, crée/retrouve l'utilisateur, et retourne notre propre JWT
 *  6. Redirection vers le configurateur
*/
function LoginPage() {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Si déjà connecté, redirige vers le configurateur
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/configurator", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setIsLoggingIn(true);

    const result = await loginWithGoogle(credentialResponse.credential);

    if (result.success) {
      navigate("/configurator", { replace: true });
    } else {
      setError("La connexion a échoué. Veuillez réessayer.");
      setIsLoggingIn(false);
    }
  };

  const handleGoogleError = () => {
    setError("Impossible de se connecter avec Google.");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* En-tête */}
        <div className="login-header">
          <img src={logoBYCN} alt="Bouygues Construction" className="login-logo" />
          <p className="login-subtitle">
            Configurateur de Chambre d'EHPAD
          </p>
        </div>

        {/* Message d'erreur */}
        {error && <p className="login-error">{error}</p>}

        {/* Bouton Google SSO */}
        <div className="login-action">
          {isLoggingIn ? (
            <p className="login-loading">Connexion en cours...</p>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              locale="fr"
              width="300"
            />
          )}
        </div>

        {/* Pied de page */}
        <p className="login-footer">BYCN - R&DI Design-to-Build Lab</p>
      </div>
    </div>
  );
}

export default LoginPage;
