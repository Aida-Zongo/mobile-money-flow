"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, TrendingDown, DollarSign, ArrowDown, ShoppingCart, Car, Home, Zap, Heart, GraduationCap, Shirt, Gamepad2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataSync, formatMoney, formatDate } from "@/lib/data-sync"
// Plus besoin de AuthRequired/AuthGuard - si on est sur ces pages, on est déjà connecté
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 🎨 PALETTE COHÉRENTE MONEYFLOW
const COLORS = {
  primary: {
    50: '#f0fdf4',   // emerald-50
    100: '#dcfce7',  // emerald-100
    200: '#bbf7d0',  // emerald-200
    300: '#86efac',  // emerald-300
    400: '#4ade80',  // emerald-400
    500: '#22c55e',  // emerald-500
    600: '#16a34a',  // emerald-600
    700: '#15803d',  // emerald-700
    800: '#166534',  // emerald-800
    900: '#14532d',  // emerald-900
  },
  success: {
    bg: '#dcfce7',    // green-100
    border: '#bbf7d0',  // green-200
    text: '#16a34a',    // green-600
    hover: '#bbf7d0',  // green-100 hover
  },
  warning: {
    bg: '#fef3c7',    // amber-100
    border: '#fde68a',  // amber-200
    text: '#d97706',    // amber-600
    hover: '#fde68a',  // amber-100 hover
  },
  danger: {
    bg: '#fee2e2',    // red-100
    border: '#fecaca',  // red-200
    text: '#dc2626',    // red-600
    hover: '#fecaca',  // red-100 hover
  },
  neutral: {
    50: '#f8fafc',   // slate-50
    100: '#f1f5f9',  // slate-100
    200: '#e2e8f0',  // slate-200
    300: '#cbd5e1',  // slate-300
    400: '#94a3b8',  // slate-400
    500: '#64748b',  // slate-500
    600: '#475569',  // slate-600
    700: '#334155',  // slate-700
    800: '#1e293b',  // slate-800
    900: '#0f172a',  // slate-900
  }
}

export default function ExpensesPage() {
  // Plus besoin de AuthRequired/AuthGuard - si on est sur ces pages, on est déjà connecté
  return <ExpensesContent />
}

function ExpensesContent() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseLabel, setExpenseLabel] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [expenseDate, setExpenseDate] = useState("")
  const [expenseOperator, setExpenseOperator] = useState("")
  const [totalDepenses, setTotalDepenses] = useState(0)

  // Categories pour les dépenses
  const expenseCategories = [
    { id: "alimentation", label: "Alimentation", icon: ShoppingCart },
    { id: "transport", label: "Transport", icon: Car },
    { id: "logement", label: "Logement", icon: Home },
    { id: "utilities", label: "Factures", icon: Zap },
    { id: "sante", label: "Santé", icon: Heart },
    { id: "education", label: "Éducation", icon: GraduationCap },
    { id: "shopping", label: "Shopping", icon: Shirt },
    { id: "loisirs", label: "Loisirs", icon: Gamepad2 },
    { id: "autre", label: "Autre", icon: DollarSign },
  ]

  // Operateurs
  const operators = [
    { id: "cash", label: "Cash" },
    { id: "mobile", label: "Mobile Money" },
    { id: "bank", label: "Banque" },
    { id: "card", label: "Carte" },
  ]

  // Synchronisation des données
  useEffect(() => {
    // Charger les données initiales
    const loadInitialData = () => {
      const allTransactions = DataSync.getTransactions()
      const expenses = allTransactions.filter(t => t.type === 'depense')
      setExpenses(expenses)
      setTotalDepenses(expenses.reduce((sum, e) => sum + e.amount, 0))
      console.log('💸 Dépenses synchronisées:', expenses.length)
    }
    
    loadInitialData()
    
    // Écouter les événements de synchronisation
    const handleSync = (event: CustomEvent) => {
      console.log('🔄 Événement de synchronisation reçu:', event.detail)
      if (event.detail.type === 'transaction-added' || event.detail.type === 'transaction-updated') {
        loadInitialData() // Recharger les dépenses
      }
    }
    
    DataSync.onSync(handleSync)
    
    // Nettoyer l'écouteur
    return () => {
      DataSync.cleanup(handleSync)
    }
  }, [])

  const handleSaveExpense = () => {
    if (!expenseAmount || !expenseLabel || !expenseCategory || !expenseDate || !expenseOperator) return

    const expense = {
      id: Date.now(),
      type: 'depense',
      label: expenseLabel,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      operator: expenseOperator,
      date: expenseDate,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isToday: expenseDate === new Date().toISOString().split('T')[0]
    }

    DataSync.addTransaction(expense)
    console.log("💸 Dépense ajoutée:", expense)
    
    // Réinitialiser le formulaire
    setExpenseAmount("")
    setExpenseLabel("")
    setExpenseCategory("")
    setExpenseDate("")
    setExpenseOperator("")
    setIsSheetOpen(false)
  }

  const filteredExpenses = expenses.filter(expense => 
    expense.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Grouper par date
  const groupedExpenses = filteredExpenses.reduce((groups: any, expense: any) => {
    const date = expense.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
    return groups
  }, {} as Record<string, any[]>)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-12 py-12 space-y-12">
        {/* Header and Total */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-foreground">Mes Dépenses</h1>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                  {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </p>
              </div>
              <AuthRequired action="add" message="Pour ajouter des dépenses, veuillez créer un compte gratuitement et accéder à toutes les fonctionnalités.">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsSheetOpen(true)}
                    className="rounded-full bg-primary hover:bg-primary/90 btn-primary-shadow gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>
              </AuthRequired>
            </div>
          </div>
          
          {/* Compact Summary Card */}
          <Card className="p-4 rounded-2xl shadow-sm border border-border/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-black text-destructive">
                  {formatMoney(totalDepenses)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center ring-2 ring-offset-2 ring-destructive/20">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher une dépense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-xl border-border/60 bg-background"
          />
        </div>

        {/* Expense List */}
        <div className="space-y-6">
          {Object.entries(groupedExpenses).map(([date, dayExpenses]: [string, any[]]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {formatDate(date)}
                </h3>
                <span className="text-xs text-muted-foreground">
                  ({dayExpenses.length} {dayExpenses.length === 1 ? 'dépense' : 'dépenses'})
                </span>
              </div>
              <Card className="rounded-2xl shadow-sm border border-border/60">
                <CardContent className="p-0">
                  {dayExpenses.map((expense) => {
                    const category = expenseCategories.find(c => c.id === expense.category) || expenseCategories[0]
                    const Icon = category.icon
                    
                    return (
                      <div key={expense.id} className="flex items-center justify-between p-4 border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{expense.label}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{category.label}</span>
                              <span>•</span>
                              <span>{expense.operator}</span>
                              {expense.isToday && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                  Aujourd'hui
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">
                            -{formatMoney(expense.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {expense.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowDown className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucune dépense trouvée" : "Aucune dépense enregistrée"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Essayez une autre recherche" 
                : "Commencez par ajouter votre première dépense"
              }
            </p>
            {!searchTerm && (
              <AuthRequired action="add" message="Pour ajouter des dépenses, veuillez créer un compte gratuitement et accéder à toutes les fonctionnalités.">
                <Button
                  onClick={() => setIsSheetOpen(true)}
                  className="rounded-full bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une dépense
                </Button>
              </AuthRequired>
            )}
          </div>
        )}

        {/* Add Expense Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto px-8">
            <SheetHeader className="px-8 pt-8">
              <SheetTitle>Ajouter une dépense</SheetTitle>
              <SheetDescription>
                Enregistrez une nouvelle dépense
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-8 py-8">
              <div className="space-y-3">
                <Label htmlFor="label">Libellé</Label>
                <Input
                  id="label"
                  placeholder="Ex: Courses, Transport, Restaurant..."
                  value={expenseLabel}
                  onChange={(e) => setExpenseLabel(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="amount">Montant (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ex: 50000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  min="0"
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="operator">Opérateur</Label>
                <Select value={expenseOperator} onValueChange={setExpenseOperator}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner un opérateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((operator) => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <SheetFooter className="px-8 pb-8">
              <Button
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleSaveExpense}>
                Enregistrer la dépense
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </main>
  )
}

export default function ExpensesPage() {
  // Plus besoin de AuthGuard - si on arrive ici, c'est qu'on est déjà connecté !
  return <ExpensesContent />
}
