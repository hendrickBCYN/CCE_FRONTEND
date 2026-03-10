import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./context/AuthProvider";
import LoginPage from "./components/auth/LoginPage";
import LoadingScreen from "./components/common/LoadingScreen";
import Header from "./components/layout/Header";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Composant racine de l'application.
 *
 * Structure des providers (de l'extérieur vers l'intérieur) :
 *  1. GoogleOAuthProvider → fournit le SDK Google à toute l'app
 *  2. AuthProvider        → gère l'état d'authentification
 *  3. Router              → gère la navigation
 *
 * Pour l'instant on a deux routes :
 *  - /login         → page de connexion
 *  - /configurator  → page placeholder (sera le configurateur Unity)
 *  - *              → redirige vers /login
 */
function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Placeholder pour le configurateur — on l'implémentera à l'étape suivante */}
            <Route
              path="/configurator"
              element={
                <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                  <Header />
                  <div style={{ flex: 1, position: "relative" }}>
                    <LoadingScreen message="Chargement du configurateur..." progress={42} />
                  </div>
                </div>
              }
              /*
              path="/configurator"
              element={
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h1>Configurateur</h1>
                  <p>Le build Unity WebGL sera intégré ici.</p>
                </div>
              }
              */
            />

            {/* Toute autre URL → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
