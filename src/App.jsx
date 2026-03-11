import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./context/AuthProvider";
import LoginPage from "./components/auth/LoginPage";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ConfiguratorPage from "./components/configurator/ConfiguratorPage";

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
            <Route
              path="/configurator"
              element={
                <ProtectedRoute>
                  <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                    <Header />
                    <ConfiguratorPage />
                  </div>
                </ProtectedRoute>
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
