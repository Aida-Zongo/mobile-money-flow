"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown } from "lucide-react"
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
        <div className="bg-gradient-to-r from-[#0A7B5E] to-[#0D9B76] text-white rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Solde Actuel</p>
                <p className="text-3xl font-bold text-white">{formatMoney(soldeActuel)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Ce mois</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
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

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Économies</p>
                  <p className="text-2xl font-bold text-blue-700">{formatMoney(revenusActuels - depensesActuelles)}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-600" />
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Ajouter un Revenu</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="50000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Salaire, Prime, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRevenueForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitTransaction}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire Modal Dépense */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Ajouter une Dépense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    placeholder="Courses, Transport, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowExpenseForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitTransaction}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Ajouter
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Toutes les Transactions</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune transaction enregistrée</p>
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${transaction.type === 'revenu' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {transaction.type === 'revenu' ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.label}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                  <p className={`font-bold text-lg ${transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'revenu' ? '+' : '-'}{formatMoney(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            Total: {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
