import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

// Mock du hook useAuth
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../hooks/useAuth";

// CAS 1 : Affichage du LoadingScreen pendant la vérification
describe("ProtectedRoute : chargement", () => {
  it("affiche le LoadingScreen pendant la vérification", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Configurateur</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Configurateur")).not.toBeInTheDocument();
    expect(
      screen.getByText("Vérification de votre session...")
    ).toBeInTheDocument();
  });
});

// CAS 2 : Redirection vers /login si non authentifié
describe("ProtectedRoute : non authentifié", () => {
  it("redirige vers /login si isAuthenticated est false", () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <MemoryRouter initialEntries={["/configurator"]}>
        <ProtectedRoute>
          <div>Configurateur</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Configurateur")).not.toBeInTheDocument();
  });
});

// CAS 3 : Affichage du composant enfant si authentifié
describe("ProtectedRoute : authentifié", () => {
  it("affiche le composant enfant si isAuthenticated est true", () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Configurateur</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Configurateur")).toBeInTheDocument();
  });
});