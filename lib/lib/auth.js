import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

// Login avec Firebase puis récupère les infos user depuis le backend
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ uid: userCredential.user.uid })
  });
  
  const data = await res.json();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

// Register avec Firebase puis sauvegarde dans backend
export const registerUser = async (name, email, password, phone, operator) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ 
      uid: userCredential.user.uid,
      name, email, phone, operator 
    })
  });
  
  const data = await res.json();
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Refresh token automatiquement (le token Firebase expire après 1h)
export const getValidToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    localStorage.setItem('token', token);
    return token;
  }
  return null;
};
