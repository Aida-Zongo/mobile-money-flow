// Système centralisé de gestion des transactions
// Utilisé par toutes les pages pour synchroniser les données

export interface Transaction {
  id: number
  type: 'revenu' | 'depense'
  label: string
  amount: number
  date: string
  category?: string
  operator?: string
  icon?: string
  isToday?: boolean
  time?: string
}

// Récupérer toutes les transactions
export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const savedTransactions = localStorage.getItem('userTransactions')
  if (savedTransactions) {
    return JSON.parse(savedTransactions)
  }
  return []
}

// Sauvegarder les transactions
export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userTransactions', JSON.stringify(transactions))
}

// Ajouter une transaction
export function addTransaction(transaction: Transaction): void {
  const currentTransactions = getTransactions()
  const updatedTransactions = [transaction, ...currentTransactions]
  saveTransactions(updatedTransactions)
  console.log("💾 Transaction sauvegardée dans localStorage:", transaction)
  console.log("📊 Toutes les transactions:", updatedTransactions)
}

// Récupérer seulement les revenus
export function getRevenues(): Transaction[] {
  return getTransactions().filter(t => t.type === 'revenu')
}

// Récupérer seulement les dépenses
export function getExpenses(): Transaction[] {
  return getTransactions().filter(t => t.type === 'depense')
}

// Calculer le total des revenus
export function getTotalRevenues(): number {
  return getRevenues().reduce((sum, t) => sum + t.amount, 0)
}

// Calculer le total des dépenses
export function getTotalExpenses(): number {
  return getExpenses().reduce((sum, t) => sum + t.amount, 0)
}

// Récupérer le solde initial
export function getInitialBalance(): number {
  if (typeof window === 'undefined') return 0;
  const saved = localStorage.getItem('soldeInitial')
  return saved ? parseFloat(saved) : 0
}

// Définir le solde initial
export function setInitialBalance(amount: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('soldeInitial', amount.toString())
}

// Calculer le solde actuel
export function getCurrentBalance(): number {
  const initial = getInitialBalance()
  const revenues = getTotalRevenues()
  const expenses = getTotalExpenses()
  const balance = initial + revenues - expenses
  console.log("💰 Calcul solde:", { initial, revenues, expenses, balance })
  return balance
}

// Ajouter un revenu au solde initial (comme un dépôt)
export function addToInitialBalance(amount: number): void {
  const currentInitial = getInitialBalance()
  setInitialBalance(currentInitial + amount)
}

// Récupérer les budgets
export function getBudgets(): any[] {
  const savedBudgets = localStorage.getItem('userBudgets')
  if (savedBudgets) {
    return JSON.parse(savedBudgets)
  }
  return []
}

// Sauvegarder les budgets
export function saveBudgets(budgets: any[]): void {
  localStorage.setItem('userBudgets', JSON.stringify(budgets))
}

// Ajouter ou mettre à jour un budget
export function updateBudget(categoryId: string, amount: number): void {
  const budgets = getBudgets()
  const existingIndex = budgets.findIndex((b: any) => b.category === categoryId)
  
  if (existingIndex >= 0) {
    budgets[existingIndex].budget = amount
  } else {
    budgets.push({
      id: Date.now(),
      category: categoryId,
      budget: amount,
      spent: 0
    })
  }
  
  saveBudgets(budgets)
}
