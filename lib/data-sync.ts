// Synchronisation des données - Version simplifiée

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
  HAS_VISITED: 'hasVisitedBefore',
  LAST_SYNC: 'lastSyncTimestamp'
}

// Fonctions de synchronisation
export class DataSync {
  // Créer un nouveau compte
  static createAccount(userData: { name: string; email: string; password: string }) {
    const newUser: UserData = {
      name: userData.name,
      email: userData.email,
      initialBalance: 0,
      createdAt: new Date().toISOString()
    }

    localStorage.setItem(KEYS.USER, JSON.stringify(newUser))
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]))
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify([]))
    localStorage.setItem(KEYS.INITIAL_BALANCE, '0')
    localStorage.setItem(KEYS.HAS_VISITED, 'true')
    localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString())

    console.log('👤 Nouveau compte créé:', newUser)
    
    return { success: true, user: newUser }
  }

  // Se connecter
  static login(email: string, password: string) {
    const user = {
      name: 'Test User',
      email: email,
      initialBalance: 0,
      createdAt: new Date().toISOString()
    }

    localStorage.setItem(KEYS.USER, JSON.stringify(user))
    localStorage.setItem(KEYS.HAS_VISITED, 'true')
    localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString())

    console.log('🔐 Utilisateur connecté:', user)
    
    return { success: true, user }
  }

  // Se déconnecter
  static logout() {
    localStorage.removeItem(KEYS.USER)
    localStorage.setItem(KEYS.HAS_VISITED, 'true')
    console.log('👋 Utilisateur déconnecté')
    return { success: true }
  }

  // Vérifier si l'utilisateur est connecté
  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const userData = localStorage.getItem(KEYS.USER)
    return userData !== null
  }

  // Obtenir l'utilisateur actuel
  static getCurrentUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(KEYS.USER)
    return userData ? JSON.parse(userData) : null
  }

  // ===== TRANSACTIONS =====

  // Ajouter une transaction
  static addTransaction(transactionData: Omit<Transaction, 'id'>) {
    const transactions = this.getTransactions()
    
    const transaction: Transaction = {
      id: Date.now(),
      ...transactionData
    }

    transactions.push(transaction)
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions))
    
    console.log('💾 Transaction ajoutée:', transaction)
    
    return transaction
  }

  // Obtenir toutes les transactions
  static getTransactions(): Transaction[] {
    if (typeof window === 'undefined') return [];
    const transactions = localStorage.getItem(KEYS.TRANSACTIONS)
    return transactions ? JSON.parse(transactions) : []
  }

  // ===== BUDGETS =====

  // Ajouter un budget
  static addBudget(budgetData: Omit<Budget, 'id'>) {
    const budgets = this.getBudgets()
    
    const budget: Budget = {
      id: Date.now(),
      ...budgetData
    }

    budgets.push(budget)
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets))
    
    console.log('📊 Budget ajouté:', budget)
    
    return budget
  }

  // Obtenir tous les budgets
  static getBudgets(): Budget[] {
    if (typeof window === 'undefined') return [];
    const budgets = localStorage.getItem(KEYS.BUDGETS)
    return budgets ? JSON.parse(budgets) : []
  }

  // Supprimer un budget
  static deleteBudget(budgetId: number) {
    const budgets = this.getBudgets()
    const filteredBudgets = budgets.filter(b => b.id !== budgetId)
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(filteredBudgets))
    console.log('🗑️ Budget supprimé:', budgetId)
  }

  // ===== STATISTIQUES =====

  // Obtenir les statistiques
  static getStatistics() {
    const transactions = this.getTransactions()
    const totalRevenues = transactions
      .filter(t => t.type === 'revenu')
      .reduce((sum, t) => sum + t.amount, 0)
      
    const totalExpenses = transactions
      .filter(t => t.type === 'depense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalRevenues,
      totalExpenses,
      currentBalance: totalRevenues - totalExpenses,
      transactionCount: transactions.length
    }
  }

  // Obtenir le solde actuel
  static getCurrentBalance(): number {
    const stats = this.getStatistics()
    return stats.currentBalance
  }

  // Obtenir le solde initial
  static getInitialBalance(): number {
    if (typeof window === 'undefined') return 0;
    return parseFloat(localStorage.getItem(KEYS.INITIAL_BALANCE) || '0')
  }

  // Définir le solde initial
  static setInitialBalance(amount: number) {
    localStorage.setItem(KEYS.INITIAL_BALANCE, amount.toString())
    console.log('💰 Solde initial défini:', amount)
  }

  // ===== SYNCHRONISATION =====

  // Déclencher un événement de synchronisation
  static triggerGlobalSync(eventType: string, data: any) {
    const event = new CustomEvent('globalSync', {
      detail: { type: eventType, data, timestamp: Date.now() }
    })
    window.dispatchEvent(event)
    
    localStorage.setItem(KEYS.LAST_SYNC, Date.now().toString())
    console.log(`🌐 Synchronisation globale: ${eventType}`, data)
  }

  // Écouter les événements de synchronisation
  static onSync(callback: (event: CustomEvent) => void) {
    window.addEventListener('globalSync', callback as EventListener)
  }

  // Nettoyer les écouteurs d'événements
  static cleanup(callback: (event: CustomEvent) => void) {
    window.removeEventListener('globalSync', callback as EventListener)
  }
}

// Exporter les utilitaires
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
