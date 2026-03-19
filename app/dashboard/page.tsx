"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown, DollarSign, X, Minus, Plus, ShoppingCart } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataSync, formatMoney } from "@/lib/data-sync"
import SyncIndicator from "@/components/sync-indicator"
// Plus besoin de AuthGuard - si on est sur cette page, on est déjà authentifié !

function DashboardContent() {
  const [soldeInitial, setSoldeInitial] = useState<number | null>(null)
  const [showSoldeForm, setShowSoldeForm] = useState(false)
  const [soldeInput, setSoldeInput] = useState('')
  const [transactions, setTransactions] = useState<any[]>([])
  const [revenusActuels, setRevenusActuels] = useState(0)
  const [depensesActuelles, setDepensesActuelles] = useState(0)
  const [soldeActuel, setSoldeActuel] = useState(0)
  
  // Synchronisation des données
  useEffect(() => {
    // Charger les données initiales
    const loadInitialData = () => {
      const user = DataSync.getCurrentUser()
      const initialBalance = DataSync.getInitialBalance()
      const stats = DataSync.getStatistics()
      const allTransactions = DataSync.getTransactions()
      
      setSoldeInitial(initialBalance)
      setTransactions(allTransactions)
      setRevenusActuels(stats.totalRevenues)
      setDepensesActuelles(stats.totalExpenses)
      setSoldeActuel(stats.currentBalance)
      
      console.log('📊 Données synchronisées:', stats)
      console.log('🔍 Debug - Transactions chargées:', allTransactions.length, allTransactions)
    }
    
    loadInitialData()
    
    // Écouter les événements de synchronisation LOCAUX
    const handleSync = (event: CustomEvent) => {
      console.log('🔄 Événement de synchronisation reçu:', event.detail)
      loadInitialData() // Recharger les données
    }
    
    // Écouter les événements de synchronisation GLOBAUX (entre pages)
    const handleGlobalSync = (event: CustomEvent) => {
      console.log('🌐 Synchronisation globale reçue:', event.detail)
      loadInitialData() // Recharger toutes les données
    }
    
    DataSync.onSync(handleSync)
    DataSync.onGlobalSync(handleGlobalSync)
    
    // Nettoyer les écouteurs
    return () => {
      DataSync.cleanup(handleSync)
      DataSync.cleanupGlobalSync(handleGlobalSync)
    }
  }, [])
  
  // Ajout de transaction avec formulaire
  const [showRevenueForm, setShowRevenueForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    label: '',
    type: 'revenu' as 'revenu' | 'depense'
  })

  const saveTransaction = (type: 'revenu' | 'depense', label?: string, amount?: number) => {
    if (type === 'revenu') {
      setShowRevenueForm(true)
      setFormData({ type: 'revenu', label: '', amount: '' })
    } else {
      setShowExpenseForm(true)
      setFormData({ type: 'depense', label: '', amount: '' })
    }
  }

  const handleSubmitTransaction = () => {
    if (!formData.amount || !formData.label) {
      alert('Veuillez remplir tous les champs')
      return
    }

    const transaction = {
      id: Date.now(),
      type: formData.type,
      label: formData.label,
      amount: parseFloat(formData.amount),
      category: formData.type === 'revenu' ? 'salary' : 'other',
      operator: 'cash',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isToday: true
    }
    
    DataSync.addTransaction(transaction)
    console.log("💾 Transaction ajoutée:", transaction)
    console.log("💰 Nouveau solde:", DataSync.getCurrentBalance())
    
    // Debug : Vérifier que les transactions sont bien sauvegardées
    setTimeout(() => {
      const allTransactions = DataSync.getTransactions()
      console.log("🔍 Debug - Toutes les transactions:", allTransactions)
      console.log("🔍 Debug - Nombre de transactions:", allTransactions.length)
    }, 100)
    
    // Fermer le formulaire
    setShowRevenueForm(false)
    setShowExpenseForm(false)
    setFormData({ amount: '', label: '', type: 'revenu' })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Page Title and Sync Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Tableau de bord</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Vue d&apos;ensemble de vos finances
            </p>
          </div>
          <SyncIndicator />
        </div>

        {/* Hero Card - Solde */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Welcome Message */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                👋 Bienvenue sur MoneyFlow !
              </h1>
              <p className="text-white/90 text-lg">
                Gérez vos finances avec style et simplicité
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90 mb-1">Votre Solde Actuel</p>
                  <p className="text-4xl font-bold text-white">{formatMoney(soldeActuel)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Actif</span>
                </div>
                <p className="text-sm text-white/80">Ce mois</p>
                <p className="text-lg font-semibold">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Revenus</p>
                  <p className="text-2xl font-bold text-green-700">{formatMoney(revenusActuels)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Dépenses</p>
                  <p className="text-2xl font-bold text-red-700">{formatMoney(depensesActuelles)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Économies</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatMoney(revenusActuels - depensesActuelles)}</p>
                </div>
                <Wallet className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => saveTransaction('revenu')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Ajouter un Revenu</h3>
                  <p className="text-sm text-muted-foreground">Enregistrer une entrée d&apos;argent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => saveTransaction('depense')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Ajouter une Dépense</h3>
                  <p className="text-sm text-muted-foreground">Enregistrer une sortie d&apos;argent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions Récentes</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {transactions.length} transaction{transactions.length > 1 ? 's' : ''} au total
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${transaction.type === 'revenu' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {transaction.type === 'revenu' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.label}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                          {transaction.isToday && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              Aujourd'hui
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'revenu' ? '+' : '-'}{formatMoney(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {transactions.length > 5 && (
                <div className="text-center pt-4">
                  <button 
                    onClick={() => setShowAllTransactions(true)}
                    className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Voir toutes les transactions ({transactions.length - 5} supplémentaires)
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulaire Modal Revenu */}
        {showRevenueForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
              {/* Header avec dégradé vert */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Ajouter un Revenu</h3>
                      <p className="text-emerald-100 text-sm">Enrichissez votre finances</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRevenueForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Montant (FCFA)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <DollarSign className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="50 000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold transition-all duration-200 bg-emerald-50/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      placeholder="Salaire, Prime, Freelance..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg transition-all duration-200 bg-emerald-50/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => setShowRevenueForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitTransaction}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Ajouter le Revenu
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire Modal Dépense */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
              {/* Header avec dégradé rouge */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <ArrowDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Ajouter une Dépense</h3>
                      <p className="text-red-100 text-sm">Maîtrisez vos dépenses</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowExpenseForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Montant (FCFA)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Wallet className="w-5 h-5 text-red-500" />
                    </div>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="5 000"
                      className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold transition-all duration-200 bg-red-50/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <ShoppingCart className="w-5 h-5 text-red-500" />
                    </div>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({...formData, label: e.target.value})}
                      placeholder="Courses, Transport, Loisirs..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg transition-all duration-200 bg-red-50/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 px-6 pb-6">
                <button
                  onClick={() => setShowExpenseForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitTransaction}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Minus className="w-5 h-5" />
                    Ajouter la Dépense
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal pour afficher toutes les transactions */}
      <AllTransactionsModal 
        isOpen={showAllTransactions}
        onClose={() => setShowAllTransactions(false)}
        transactions={transactions}
      />
    </main>
  )
}

export default function DashboardPage() {
  // Plus besoin de AuthGuard - si on arrive ici, c'est qu'on est déjà connecté !
  return <DashboardContent />
}

// Modal pour afficher toutes les transactions
function AllTransactionsModal({ isOpen, onClose, transactions }: { isOpen: boolean; onClose: () => void; transactions: any[] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden transform transition-all duration-300">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Historique Complet</h3>
                <p className="text-indigo-100 text-sm">Toutes vos transactions</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune transaction</h3>
              <p className="text-gray-500">Commencez par ajouter votre première transaction</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${transaction.type === 'revenu' ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                      {transaction.type === 'revenu' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-gray-900">{transaction.label}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-full font-medium">
                          {transaction.category}
                        </span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        {transaction.isToday && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-xs">
                            Aujourd'hui
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-xl ${transaction.type === 'revenu' ? 'text-emerald-600' : 'text-red-600'} group-hover:text-2xl transition-all duration-200`}>
                      {transaction.type === 'revenu' ? '+' : '-'}{formatMoney(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{transactions.length}</span> transaction{transactions.length > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-lg text-gray-800">
                  {formatMoney(transactions.reduce((sum, t) => sum + (t.type === 'revenu' ? t.amount : -t.amount), 0))}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
