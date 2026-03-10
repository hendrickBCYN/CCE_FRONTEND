import api from "./api";

/**
 * Service d'authentification : les fonctions qui communiquent avec le backend pour l'authentification
 * Communique avec l'API Express pour :
 * - Envoyer le credential Google et recevoir un JWT applicatif
 * - Vérifier la validité d'un JWT existant
 */
const authService = {
  /**
   * Envoie le credential Google au backend.
   * Le backend vérifie auprès de Google, crée/retrouve l'utilisateur en BDD,
   * et retourne un JWT applicatif + les infos utilisateur.
   */
  async googleLogin(googleCredential) {
    const response = await api.post("/auth/google", {
      credential: googleCredential,
    });
    return response.data; // { token, user }
  },

  /**
   * Vérifie si le JWT stocké est encore valide.
   * Appelé au chargement de l'app pour restaurer la session.
   */
  async verifyToken(token) {
    const response = await api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.user;
  },
};

export default authService;
