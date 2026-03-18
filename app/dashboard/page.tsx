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
      
      setSoldeInitial(initialBalance)
      setTransactions(DataSync.getTransactions())
      setRevenusActuels(stats.totalRevenues)
      setDepensesActuelles(stats.totalExpenses)
      setSoldeActuel(stats.currentBalance)
      
      console.log('📊 Données synchronisées:', stats)
    }
    
    loadInitialData()
    
    // Écouter les événements de synchronisation
    const handleSync = (event: CustomEvent) => {
      console.log('🔄 Événement de synchronisation reçu:', event.detail)
      loadInitialData() // Recharger les données
    }
    
    DataSync.onSync(handleSync)
    
    // Nettoyer l'écouteur
    return () => {
      DataSync.cleanup(handleSync)
    }
  }, [])
  
  // Ajout de transaction
  const saveTransaction = (type: 'revenu' | 'depense', label: string, amount: number) => {
    const transaction = {
      id: Date.now(),
      type: type,
      label: label,
      amount: amount,
      category: type === 'revenu' ? 'salary' : 'other',
      operator: 'cash',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isToday: true
    }
    
    DataSync.addTransaction(transaction)
    console.log("💾 Transaction ajoutée:", transaction)
    console.log("💰 Nouveau solde:", DataSync.getCurrentBalance())
    
    // Pas besoin de recharger, la synchronisation automatique mettra à jour les données
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
            onClick={() => saveTransaction('revenu', 'Salaire', 50000)}
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
            onClick={() => saveTransaction('depense', 'Dépense quotidienne', 5000)}
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
              <CardTitle>Transactions Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${transaction.type === 'revenu' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {transaction.type === 'revenu' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.label}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'revenu' ? '+' : '-'}{formatMoney(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

export default function DashboardPage() {
  // Plus besoin de AuthGuard - si on arrive ici, c'est qu'on est déjà connecté !
  return <DashboardContent />
}
