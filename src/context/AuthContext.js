import { createContext } from "react";

/**
 * Contexte d'authentification.
 * Fichier séparé pour éviter le conflit Fast Refresh de Vite
 * (un fichier .jsx ne doit exporter que des composants).
 */
const AuthContext = createContext(null);

export default AuthContext;
