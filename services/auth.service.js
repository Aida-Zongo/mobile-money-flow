const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AuthService {
  // Stocker le token JWT
  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwtToken', token);
    }
  }

  // Récupérer le token JWT
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  // Supprimer le token (déconnexion)
  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
    }
  }

  // Stocker les infos utilisateur
  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // Récupérer les infos utilisateur
  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw new Error('Erreur lors de l\'inscription');
    }
  }

  // Connexion
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        this.setToken(data.token);
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw new Error('Erreur lors de la connexion');
    }
  }

  // Obtenir les infos utilisateur
  async getMe() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Token manquant');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        this.setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Erreur getMe:', error);
      throw new Error('Erreur lors de la récupération des informations');
    }
  }

  // Déconnexion
  logout() {
    this.removeToken();
  }

  // Headers pour les requêtes authentifiées
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }
}

export default new AuthService();
