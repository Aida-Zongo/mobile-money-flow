export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Pour MoneyFlow avec DataSync
export const getMoneyFlowUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('moneyflow_user');
  return user ? JSON.parse(user) : null;
};

export const setMoneyFlowUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('moneyflow_user', JSON.stringify(user));
};

export const clearMoneyFlowStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('moneyflow_user');
  localStorage.removeItem('moneyflow_transactions');
  localStorage.removeItem('moneyflow_budgets');
  localStorage.removeItem('moneyflow_balance');
};
