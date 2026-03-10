import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="header-logo">CCE</span>
        <span className="header-separator">|</span>
        <span className="header-description">
          Configurateur de Chambre d'EHPAD
        </span>
      </div>

      <div className="header-user">
        {user?.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.display_name}
            className="header-avatar"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="header-username">{user?.display_name}</span>
        <button onClick={handleLogout} className="header-logout-btn">
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export default Header;