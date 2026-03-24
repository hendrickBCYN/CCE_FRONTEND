import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

// Simulate the use of the useAuth hook
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../hooks/useAuth";

// CASE 1: LoadingScreen displayed during verification
describe("ProtectedRoute: loading", () => {
  it("Displays the LoadingScreen during verification", () => {
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

// CASE 2: Redirect to /login if not authenticated
describe("ProtectedRoute: Unauthenticated", () => {
  it("Redirects to /login if isAuthenticated is false and isLoading is false", () => {
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

// CASE 3: Displaying the child component if authenticated
describe("ProtectedRoute: authenticated", () => {
  it("Displays the child component if isAuthenticated is true and isLoading is false", () => {
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