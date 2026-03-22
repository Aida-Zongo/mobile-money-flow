const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001/api';

const save = (token: string, user: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  localStorage.setItem('user',
    JSON.stringify(user));
  document.cookie =
    `token=${token}; path=/; max-age=86400`;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  operator?: string
) => {
  const res = await fetch(
    `${API_URL}/auth/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email, password,
        phone: phone || '',
        operator: operator || 'other',
      }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || 'Erreur inscription'
    );
  }

  save(data.token, data.user);
  return data;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const res = await fetch(
    `${API_URL}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || 'Erreur connexion'
    );
  }

  save(data.token, data.user);
  return data;
};

export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie =
    'token=; path=/; max-age=0';
  window.location.href = '/login';
};
