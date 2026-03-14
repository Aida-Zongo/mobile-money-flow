import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'

// Configuration Firebase (à remplacer avec vos vraies clés)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "votre-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "votre-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "votre-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "votre-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "votre-app-id"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

class FirebaseService {
  // Inscription
  async register(userData) {
    try {
      const { name, email, password, phone, location } = userData

      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Créer le document utilisateur dans Firestore
      const userDoc = {
        uid: user.uid,
        name,
        email,
        phone: phone || '',
        location: location || 'Non spécifiée',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      }

      await setDoc(doc(db, 'users', user.uid), userDoc)

      // Obtenir le token
      const token = await user.getIdToken()

      return {
        success: true,
        token,
        user: userDoc
      }
    } catch (error) {
      console.error('Erreur inscription:', error)
      
      let message = 'Erreur lors de l\'inscription'
      if (error.code === 'auth/email-already-in-use') {
        message = 'Cet email est déjà utilisé'
      } else if (error.code === 'auth/weak-password') {
        message = 'Le mot de passe est trop faible'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email invalide'
      }

      return {
        success: false,
        message
      }
    }
  }

  // Connexion
  async login(credentials) {
    try {
      const { email, password } = credentials

      // Connexion avec Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Récupérer les données utilisateur depuis Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        }
      }

      const userData = userDoc.data()

      if (!userData.isActive) {
        return {
          success: false,
          message: 'Compte désactivé'
        }
      }

      // Mettre à jour la dernière connexion
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      })

      // Obtenir le token
      const token = await user.getIdToken()

      return {
        success: true,
        message: 'Connexion réussie',
        token,
        user: userData
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      
      let message = 'Erreur lors de la connexion'
      if (error.code === 'auth/user-not-found') {
        message = 'Utilisateur non trouvé'
      } else if (error.code === 'auth/wrong-password') {
        message = 'Mot de passe incorrect'
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email invalide'
      } else if (error.code === 'auth/user-disabled') {
        message = 'Compte désactivé'
      }

      return {
        success: false,
        message
      }
    }
  }

  // Obtenir les infos utilisateur
  async getMe() {
    try {
      const user = auth.currentUser
      
      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non connecté'
        }
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        }
      }

      return {
        success: true,
        user: userDoc.data()
      }
    } catch (error) {
      console.error('Erreur getMe:', error)
      return {
        success: false,
        message: 'Erreur lors de la récupération des informations'
      }
    }
  }

  // Déconnexion
  async logout() {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      return {
        success: false,
        message: 'Erreur lors de la déconnexion'
      }
    }
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return auth.currentUser !== null
  }

  // Obtenir l'utilisateur courant
  getCurrentUser() {
    return auth.currentUser
  }

  // Vérifier si l'utilisateur est admin
  async isAdmin() {
    try {
      const user = auth.currentUser
      if (!user) return false

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) return false

      const userData = userDoc.data()
      return userData.role === 'admin'
    } catch (error) {
      console.error('Erreur isAdmin:', error)
      return false
    }
  }

  // Obtenir le token
  async getToken() {
    try {
      const user = auth.currentUser
      if (!user) return null

      return await user.getIdToken()
    } catch (error) {
      console.error('Erreur getToken:', error)
      return null
    }
  }
}

export default new FirebaseService()
