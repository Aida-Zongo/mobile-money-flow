// Synchronisation des données entre toutes les pages

// Types de données
export interface Transaction {
  id: number
  type: 'revenu' | 'depense'
  label: string
  amount: number
  category: string
  operator: string
  date: string
  time: string
  isToday: boolean
}

export interface Budget {
  id: number
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly'
}

export interface UserData {
  name: string
  email: string
  initialBalance: number
  createdAt: string
}

// Clés localStorage
const KEYS = {
  USER: 'moneyFlowUser',
  TRANSACTIONS: 'userTransactions',
  BUDGETS: 'userBudgets',
  INITIAL_BALANCE: 'soldeInitial',
  HAS_VISITED: 'hasVisitedBefore'
}

// Fonctions de synchronisation
export class DataSync {
  // Initialiser un nouveau compte
  static initializeNewAccount(userData: { name: string; email: string }) {
    const newUser: UserData = {
      name: userData.name,
      email: userData.email,
      initialBalance: 0,
      createdAt: new Date().toISOString()
    }

    // Initialiser toutes les données
    localStorage.setItem(KEYS.USER, JSON.stringify(newUser))
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]))
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify([]))
    localStorage.setItem(KEYS.INITIAL_BALANCE, '0')
    localStorage.setItem(KEYS.HAS_VISITED, 'true')

    console.log('🆕 Nouveau compte initialisé:', newUser)
    return newUser
  }

  // Obtenir l'utilisateur actuel
  static getCurrentUser(): UserData | null {
    const userData = localStorage.getItem(KEYS.USER)
    return userData ? JSON.parse(userData) : null
  }

  // Obtenir toutes les transactions
  static getTransactions(): Transaction[] {
    const transactions = localStorage.getItem(KEYS.TRANSACTIONS)
    return transactions ? JSON.parse(transactions) : []
  }

  // Ajouter une transaction
  static addTransaction(transaction: Transaction) {
    const transactions = this.getTransactions()
    transactions.push(transaction)
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions))
    
    console.log('💾 Transaction ajoutée:', transaction)
    
    // Déclencher un événement de synchronisation
    this.syncEvent('transaction-added', transaction)
    
    return transaction
  }

  // Obtenir les revenus
  static getRevenues(): Transaction[] {
    return this.getTransactions().filter(t => t.type === 'revenu')
  }

  // Obtenir les dépenses
  static getExpenses(): Transaction[] {
    return this.getTransactions().filter(t => t.type === 'depense')
  }

  // Calculer le solde actuel
  static getCurrentBalance(): number {
    const transactions = this.getTransactions()
    const initialBalance = parseFloat(localStorage.getItem(KEYS.INITIAL_BALANCE) || '0')
    
    const totalRevenues = transactions
      .filter(t => t.type === 'revenu')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpenses = transactions
      .filter(t => t.type === 'depense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return initialBalance + totalRevenues - totalExpenses
  }

  // Obtenir le solde initial
  static getInitialBalance(): number {
    return parseFloat(localStorage.getItem(KEYS.INITIAL_BALANCE) || '0')
  }

  // Définir le solde initial
  static setInitialBalance(amount: number) {
    localStorage.setItem(KEYS.INITIAL_BALANCE, amount.toString())
    console.log('💰 Solde initial défini:', amount)
    this.syncEvent('balance-updated', amount)
  }

  // Obtenir les budgets
  static getBudgets(): Budget[] {
    const budgets = localStorage.getItem(KEYS.BUDGETS)
    return budgets ? JSON.parse(budgets) : []
  }

  // Ajouter un budget
  static addBudget(budget: Budget) {
    const budgets = this.getBudgets()
    budgets.push(budget)
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets))
    console.log('📊 Budget ajouté:', budget)
    this.syncEvent('budget-added', budget)
    return budget
  }

  // Mettre à jour un budget
  static updateBudget(budgetId: number, updates: Partial<Budget>) {
    const budgets = this.getBudgets()
    const index = budgets.findIndex(b => b.id === budgetId)
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...updates }
      localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets))
      console.log('📊 Budget mis à jour:', budgets[index])
      this.syncEvent('budget-updated', budgets[index])
    }
  }

  // Supprimer un budget
  static deleteBudget(budgetId: number) {
    const budgets = this.getBudgets()
    const index = budgets.findIndex(b => b.id === budgetId)
    if (index !== -1) {
      const deletedBudget = budgets.splice(index, 1)[0]
      localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets))
      console.log('🗑️ Budget supprimé:', deletedBudget)
      this.syncEvent('budget-deleted', deletedBudget)
      return deletedBudget
    }
    return null
  }

  // Calculer les statistiques
  static getStatistics() {
    const transactions = this.getTransactions()
    const revenues = this.getRevenues()
    const expenses = this.getExpenses()
    
    const totalRevenues = revenues.reduce((sum, r) => sum + r.amount, 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const currentBalance = this.getCurrentBalance()
    
    // Dépenses par catégorie
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)
    
    // Revenus par catégorie
    const revenuesByCategory = revenues.reduce((acc, revenue) => {
      acc[revenue.category] = (acc[revenue.category] || 0) + revenue.amount
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalRevenues,
      totalExpenses,
      currentBalance,
      totalTransactions: transactions.length,
      expensesByCategory,
      revenuesByCategory,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      averageRevenue: revenues.length > 0 ? totalRevenues / revenues.length : 0
    }
  }

  // Événement de synchronisation
  private static syncEvent(eventType: string, data: any) {
    // Créer un événement personnalisé pour la synchronisation
    const event = new CustomEvent('data-sync', {
      detail: { type: eventType, data, timestamp: Date.now() }
    })
    window.dispatchEvent(event)
    
    console.log(`🔄 Événement de synchronisation: ${eventType}`, data)
  }

  // Écouter les événements de synchronisation
  static onSync(callback: (event: CustomEvent) => void) {
    window.addEventListener('data-sync', callback as EventListener)
  }

  // Nettoyer les écouteurs d'événements
  static cleanup(callback: (event: CustomEvent) => void) {
    window.removeEventListener('data-sync', callback as EventListener)
  }

  // Réinitialiser toutes les données
  static resetAll() {
    localStorage.removeItem(KEYS.USER)
    localStorage.removeItem(KEYS.TRANSACTIONS)
    localStorage.removeItem(KEYS.BUDGETS)
    localStorage.removeItem(KEYS.INITIAL_BALANCE)
    localStorage.removeItem(KEYS.HAS_VISITED)
    console.log('🗑️ Toutes les données ont été réinitialisées')
  }

  // Exporter les données
  static exportData() {
    const data = {
      user: this.getCurrentUser(),
      transactions: this.getTransactions(),
      budgets: this.getBudgets(),
      statistics: this.getStatistics(),
      exportDate: new Date().toISOString()
    }
    
    console.log('📤 Données exportées:', data)
    return data
  }
}

// Fonctions utilitaires pour le formatage
export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Hier"
  } else {
    return date.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    })
  }
}
