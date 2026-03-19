import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001/api';

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 5000
) => {
  const controller = new AbortController();
  const id = setTimeout(
    () => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  operator?: string
) => {
  const cred = await createUserWithEmailAndPassword(
    auth, email, password);
  const token = await cred.user.getIdToken();

  const userData: any = {
    uid: cred.user.uid,
    name, email,
    phone: phone || '',
    operator: operator || 'other',
    role: 'user',
  };

  try {
    const res = await fetchWithTimeout(
      `${getApiUrl()}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.user) Object.assign(userData, data.user);
    }
  } catch {
    // Backend indisponible → continue quand même
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user',
      JSON.stringify(userData));
    document.cookie =
      `token=${token}; path=/; max-age=3600`;
  }

  return { token, user: userData };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const cred = await signInWithEmailAndPassword(
    auth, email, password);
  const token = await cred.user.getIdToken();

  const userData: any = {
    uid: cred.user.uid,
    name: cred.user.displayName || email,
    email,
    role: 'user',
  };

  try {
    const res = await fetchWithTimeout(
      `${getApiUrl()}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: cred.user.uid }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.user) Object.assign(userData, data.user);
    }
  } catch {
    // Backend indisponible → continue quand même
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('user',
      JSON.stringify(userData));
    document.cookie =
      `token=${token}; path=/; max-age=3600`;
  }

  return { token, user: userData };
};

export const logoutUser = async () => {
  try { await signOut(auth); } catch {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
  }
  window.location.href = '/login';
};

export const getValidToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        document.cookie =
          `token=${token}; path=/; max-age=3600`;
      }
      return token;
    }
  } catch {}
  return null;
};
