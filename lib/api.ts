const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,
    updateMe: `${API_BASE_URL}/auth/me`,
    notifications: `${API_BASE_URL}/auth/notifications`,
    markNotificationsRead: `${API_BASE_URL}/auth/notifications/read`,
  },
  
  // Expense endpoints
  expenses: {
    getAll: `${API_BASE_URL}/expenses`,
    create: `${API_BASE_URL}/expenses`,
    getById: (id: string) => `${API_BASE_URL}/expenses/${id}`,
    update: (id: string) => `${API_BASE_URL}/expenses/${id}`,
    delete: (id: string) => `${API_BASE_URL}/expenses/${id}`,
  },
  
  // Budget endpoints
  budgets: {
    getAll: `${API_BASE_URL}/budgets`,
    getStatus: `${API_BASE_URL}/budgets/status`,
    create: `${API_BASE_URL}/budgets`,
    update: (id: string) => `${API_BASE_URL}/budgets/${id}`,
    delete: (id: string) => `${API_BASE_URL}/budgets/${id}`,
  },
  
  // Stats endpoints
  stats: {
    summary: `${API_BASE_URL}/stats/summary`,
    monthly: `${API_BASE_URL}/stats/monthly`,
    categories: `${API_BASE_URL}/stats/categories`,
    daily: `${API_BASE_URL}/stats/daily`,
  },
  
  // Admin endpoints
  admin: {
    getAllUsers: `${API_BASE_URL}/admin/users`,
    deleteUser: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
    getGlobalStats: `${API_BASE_URL}/admin/stats`,
  },
  
  // Health check
  health: `${API_BASE_URL}/health`,
};

export default api;
