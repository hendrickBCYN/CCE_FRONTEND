import { createContext } from "react";

/**
 Contexte d'authentification.
 Fichier séparé pour éviter le conflit Fast Refresh de Vite
*/
const AuthContext = createContext(null);

export default AuthContext;
