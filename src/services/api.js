import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 Instance Axios préconfigurée.
 - Injecte automatiquement le JWT dans chaque requête
 - Redirige vers /login si le token est expiré (erreur 401)
*/
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout automatique du token dans les headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cce_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion des erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("cce_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;