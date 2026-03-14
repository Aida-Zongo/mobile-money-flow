// Configuration Firebase simplifiée
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore'

// Configuration Firebase avec vos vraies clés
const firebaseConfig = {
  apiKey: "AIzaSyDXhV8Tb7xUmUGff__wUQHAnJZEHsYO1ds",
  authDomain: "moneyflow-app-88c52.firebaseapp.com",
  projectId: "moneyflow-app-88c52",
  storageBucket: "moneyflow-app-88c52.firebasestorage.app",
  messagingSenderId: "957897864341",
  appId: "1:957897864341:web:3c606054eff042a69bd79c",
  measurementId: "G-LWJWNZ6M4M"
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Types
export interface User {
  uid: string
  email: string
  name: string
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: 'revenu' | 'depense'
  label: string
  amount: number
  date: string
  category?: string
  operator?: string
  icon?: string
  isToday?: boolean
  time?: string
  createdAt: Date
}

// Authentification
export async function signUp(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Créer le profil utilisateur dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      createdAt: new Date()
    })
    
    return { success: true, user }
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Erreur inconnue' }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Erreur inconnue' }
  }
}

export async function logOut() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Erreur inconnue' }
  }
}

// Transactions
export async function addTransactionToFirebase(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Utilisateur non connecté')
    
    const transactionRef = doc(collection(db, 'transactions'))
    const newTransaction: Transaction = {
      id: transactionRef.id,
      userId: user.uid,
      ...transaction,
      createdAt: new Date()
    }
    
    await setDoc(transactionRef, newTransaction)
    return { success: true, transaction: newTransaction }
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Erreur inconnue' }
  }
}

export async function getUserTransactions() {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('Utilisateur non connecté')
    
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
    )
    
    const querySnapshot = await getDocs(q)
    const transactions: Transaction[] = []
    
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data() as Transaction)
    })
    
    return { success: true, transactions }
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Erreur inconnue' }
  }
}

export { auth, db }
