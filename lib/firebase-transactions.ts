// Système de transactions synchronisé avec Firebase
import { addTransactionToFirebase, getUserTransactions } from './firebase'

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

// Récupérer toutes les transactions depuis Firebase
export async function getTransactions(): Promise<Transaction[]> {
  const result = await getUserTransactions()
  if (result.success && result.transactions) {
    return result.transactions
  }
  return []
}

// Ajouter une transaction dans Firebase
export async function addTransaction(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt'>): Promise<boolean> {
  const result = await addTransactionToFirebase(transaction)
  return result.success
}

// Récupérer seulement les revenus
export async function getRevenues(): Promise<Transaction[]> {
  const transactions = await getTransactions()
  return transactions.filter(t => t.type === 'revenu')
}

// Récupérer seulement les dépenses
export async function getExpenses(): Promise<Transaction[]> {
  const transactions = await getTransactions()
  return transactions.filter(t => t.type === 'depense')
}

// Calculer le total des revenus
export async function getTotalRevenues(): Promise<number> {
  const revenues = await getRevenues()
  return revenues.reduce((sum, t) => sum + t.amount, 0)
}

// Calculer le total des dépenses
export async function getTotalExpenses(): Promise<number> {
  const expenses = await getExpenses()
  return expenses.reduce((sum, t) => sum + t.amount, 0)
}

// Solde initial (commence à 0 pour chaque utilisateur)
export function getInitialBalance(): number {
  return 0
}

// Définir le solde initial (pas nécessaire avec Firebase)
export function setInitialBalance(amount: number): void {
  // Pas utilisé avec Firebase - chaque utilisateur commence à 0
  console.log("Solde initial défini à:", amount)
}

// Calculer le solde actuel
export async function getCurrentBalance(): Promise<number> {
  const initial = getInitialBalance()
  const revenues = await getTotalRevenues()
  const expenses = await getTotalExpenses()
  const balance = initial + revenues - expenses
  console.log("💰 Calcul solde Firebase:", { initial, revenues, expenses, balance })
  return balance
}

// Fonctions compatibles pour les budgets
export async function getBudgets(): Promise<any[]> {
  // Pour l'instant, retourne un tableau vide
  // Peut être implémenté plus tard avec Firebase
  return []
}

export async function saveBudgets(budgets: any[]): Promise<void> {
  // Peut être implémenté plus tard avec Firebase
  console.log("Budgets sauvegardés:", budgets)
}

export async function getCategories(): Promise<any[]> {
  // Catégories par défaut
  return [
    { id: 1, name: "Alimentation", icon: "🍔", color: "#F5A623" },
    { id: 2, name: "Transport", icon: "🚗", color: "#0A7B5E" },
    { id: 3, name: "Shopping", icon: "🛍️", color: "#F04438" },
    { id: 4, name: "Telecom", icon: "📱", color: "#8B5CF6" },
    { id: 5, name: "Energie", icon: "⚡", color: "#F59E0B" },
    { id: 6, name: "Sante", icon: "🏥", color: "#16A34A" },
    { id: 7, name: "Education", icon: "📚", color: "#3B82F6" },
    { id: 8, name: "Autres", icon: "📋", color: "#8A94A6" }
  ]
}
