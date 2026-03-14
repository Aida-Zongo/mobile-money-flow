"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AuthCheckSimple from "@/components/auth-check-simple"
import { getTransactions, getRevenues, getExpenses, getTotalRevenues, getTotalExpenses, getCurrentBalance, getInitialBalance, setInitialBalance, addTransaction } from "@/lib/transactions"

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

export default function DashboardPage() {
  const [soldeInitial, setSoldeInitial] = useState<number | null>(null)
  const [showSoldeForm, setShowSoldeForm] = useState(false)
  const [soldeInput, setSoldeInput] = useState('')
  
  // Vérifier si c'est un nouvel utilisateur
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // Premier visite : initialisation avec solde à 0
      localStorage.setItem('userTransactions', JSON.stringify([]));
      localStorage.setItem('soldeInitial', '0');
      localStorage.setItem('hasVisitedBefore', 'true');
      setSoldeInitial(0);
      setShowSoldeForm(false);
      console.log("👋 Premier visite - Solde initial de 0 FCFA");
    } else {
      // Utilisateur existant : charger les données existantes
      const initialBalance = getInitialBalance();
      setSoldeInitial(initialBalance);
      setShowSoldeForm(false);
      console.log("🔄 Utilisateur existant - Données chargées");
    }
  }, [])
  
  // Utiliser le système localStorage simple
  const transactions = getTransactions()
  const revenusActuels = getTotalRevenues()
  const depensesActuelles = getTotalExpenses()
  const soldeActuel = getCurrentBalance()
  
  // Gestion du solde initial
  const handleSetSoldeInitial = () => {
    const montant = parseFloat(soldeInput)
    if (!isNaN(montant) && montant >= 0) {
      // Nettoyer les transactions existantes pour un nouveau départ
      localStorage.setItem('userTransactions', JSON.stringify([]))
      setInitialBalance(montant)
      setSoldeInitial(montant)
      setShowSoldeForm(false)
      setSoldeInput('')
      console.log("🔄 Nouveau solde initial défini, transactions nettoyées")
    }
  }

  // Ajout de transaction
  const saveTransaction = (type: 'revenu' | 'depense', label: string, amount: number) => {
    const transaction = {
      id: Date.now(),
      type: type,
      label: label,
      amount: amount,
      date: new Date().toLocaleDateString('fr-FR'),
      icon: type === 'revenu' ? '🟢' : '🔴',
      isToday: true
    }
    
    addTransaction(transaction)
    console.log("💾 Transaction ajoutée:", transaction)
    console.log("💰 Nouveau solde:", getCurrentBalance())
    
    // Recharger la page
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <AuthCheckSimple>
      <main className="min-h-screen bg-background">
        <Navbar />

        <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-black text-foreground">Tableau de bord</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Vue d&apos;ensemble de vos finances
            </p>
          </div>

          {/* Hero Card - Solde - ANCIEN DESIGN */}
          <Card className="bg-gradient-to-r from-[#0A7B5E] to-[#0D9B76] text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Solde Actuel</p>
                    <p className="text-sm opacity-75">MoneyFlow Finance</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-4xl font-bold mb-2">{formatMoney(soldeActuel)}</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowDown className="w-5 h-5 text-white/80" />
                    <p className="text-sm font-medium">Revenus</p>
                  </div>
                  <p className="text-2xl font-bold text-white/90">{formatMoney(revenusActuels)}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowUp className="w-5 h-5 text-white/80" />
                    <p className="text-sm font-medium">Dépenses</p>
                  </div>
                  <p className="text-2xl font-bold text-white/90">{formatMoney(depensesActuelles)}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-white/80" />
                    <p className="text-sm font-medium">Économies</p>
                  </div>
                  <p className="text-2xl font-bold text-white/90">{formatMoney(soldeActuel)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ajout rapide de transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Ajouter un revenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                  <input
                    type="text"
                    id="revenueLabel"
                    placeholder="Ex: Salaire, Prime..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    id="revenueAmount"
                    placeholder="Ex: 50000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    const label = (document.getElementById('revenueLabel') as HTMLInputElement).value
                    const amount = parseFloat((document.getElementById('revenueAmount') as HTMLInputElement).value)
                    if (label && amount > 0) {
                      saveTransaction('revenu', label, amount)
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Ajouter un revenu
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Ajouter une dépense</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Libellé</label>
                  <input
                    type="text"
                    id="expenseLabel"
                    placeholder="Ex: Courses, Transport..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FCFA)</label>
                  <input
                    type="number"
                    id="expenseAmount"
                    placeholder="Ex: 25000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    const label = (document.getElementById('expenseLabel') as HTMLInputElement).value
                    const amount = parseFloat((document.getElementById('expenseAmount') as HTMLInputElement).value)
                    if (label && amount > 0) {
                      saveTransaction('depense', label, amount)
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Ajouter une dépense
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des transactions */}
          {transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Transactions récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border-b">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{transaction.icon}</span>
                        <div>
                          <p className="font-medium">{transaction.label}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold ${transaction.type === 'revenu' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'revenu' ? '+' : '-'}{formatMoney(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </AuthCheckSimple>
  )
}
