import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

export const loginUser = async (email, password) => {
  try {
    // MODE DÉMO : Contourner les erreurs Firebase
    if (email === 'demo@moneyflow.com' && password === 'demo123') {
      console.log('🎮 Mode démo activé');
      
      // Simuler une connexion réussie
      const demoUser = {
        uid: 'demo-user-123',
        email: 'demo@moneyflow.com',
        name: 'Utilisateur Démo',
        role: 'user',
        isActive: true
      };
      
      const demoToken = 'demo-token-' + Date.now();
      
      // Simuler la réponse du backend
      const data = {
        success: true,
        message: 'Connexion réussie (mode démo)',
        token: demoToken,
        user: demoUser
      };
      
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('demoMode', 'true');
      
      return data;
    }
    
    // MODE NORMAL : Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth, email, password
    );
    const token = await userCredential.user.getIdToken();
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, 
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ uid: userCredential.user.uid })
      }
    );
    
    const data = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Erreur Firebase Auth:', error);
    
    // Gestion des erreurs Firebase
    if (error.code === 'auth/user-not-found') {
      throw new Error('Utilisateur non trouvé. Veuillez vous inscrire d\'abord.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Mot de passe incorrect.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email invalide.');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('Compte désactivé.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Trop de tentatives. Veuillez réessayer plus tard.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Problème de connexion Internet. Vérifiez votre réseau.');
    } else {
      throw new Error(`Erreur de connexion: ${error.message}`);
    }
  }
};

export const registerUser = async (
  name, email, password, phone, operator
) => {
  try {
    // MODE DÉMO : Contourner les erreurs Firebase
    if (email === 'demo@moneyflow.com') {
      console.log('🎮 Mode démo inscription activé');
      
      // Simuler une inscription réussie
      const demoUser = {
        uid: 'demo-user-123',
        name: name || 'Utilisateur Démo',
        email: 'demo@moneyflow.com',
        phone: phone || '+22600000000',
        operator: operator || 'orange_money',
        role: 'user',
        isActive: true
      };
      
      const demoToken = 'demo-token-' + Date.now();
      
      // Simuler la réponse du backend
      const data = {
        success: true,
        message: 'Inscription réussie (mode démo)',
        token: demoToken,
        user: demoUser
      };
      
      localStorage.setItem('token', demoToken);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('demoMode', 'true');
      
      return data;
    }
    
    // MODE NORMAL : Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, email, password
    );
    const token = await userCredential.user.getIdToken();
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          uid: userCredential.user.uid,
          name, email, phone, operator 
        })
      }
    );
    
    const data = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Erreur Firebase Auth register:', error);
    
    // Gestion des erreurs Firebase
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Cet email est déjà utilisé. Essayez de vous connecter.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Email invalide.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Tentatives trop nombreuses. Réessayez plus tard.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Problème de connexion Internet. Vérifiez votre réseau.');
    } else {
      throw new Error(`Erreur d'inscription: ${error.message}`);
    }
  }
};

export const logoutUser = async () => {
  await signOut(auth);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getValidToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(true);
    localStorage.setItem('token', token);
    return token;
  }
  return null;
};
