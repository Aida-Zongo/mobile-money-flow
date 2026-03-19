"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, TrendingUp, Target, PieChart, Settings, Trash2, ChevronDown, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataSync, formatMoney, formatDate } from "@/lib/data-sync"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetCategory, setBudgetCategory] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState("monthly")

  // Catégories de base
  const budgetCategories = [
    { id: 'food', label: 'Alimentation', icon: '🍔' },
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'shopping', label: 'Shopping', icon: '🛍' },
    { id: 'bills', label: 'Factures', icon: '📄' },
    { id: 'entertainment', label: 'Loisirs', icon: '🎮' },
    { id: 'health', label: 'Santé', icon: '🏥' },
    { id: 'education', label: 'Éducation', icon: '📚' },
    { id: 'other', label: 'Autres', icon: '📌' }
  ]

  // Synchronisation des données
  useEffect(() => {
    const loadInitialData = () => {
      const allBudgets = DataSync.getBudgets()
      const allTransactions = DataSync.getTransactions()
      
      // Calculer le montant dépensé pour chaque budget
      const budgetsWithSpent = allBudgets.map(budget => {
        const spent = allTransactions
          .filter(t => t.type === 'depense' && t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0)
        
        return {
          ...budget,
          spent,
          remaining: budget.limit - spent,
          percentage: (spent / budget.limit) * 100
        }
      })
      
      setBudgets(budgetsWithSpent)
      console.log('📊 Budgets synchronisés:', budgetsWithSpent.length)
    }
    
    loadInitialData()
    
    const handleSync = (event: CustomEvent) => {
      console.log('🔄 Événement de synchronisation reçu:', event.detail)
      if (event.detail.type === 'budget-added' || 
          event.detail.type === 'budget-updated' || 
          event.detail.type === 'budget-deleted' ||
          event.detail.type === 'transaction-added') {
        loadInitialData()
      }
    }
    
    DataSync.onSync(handleSync)
    
    return () => {
      DataSync.cleanup(handleSync)
    }
  }, [])

  const handleSaveBudget = () => {
    if (!budgetAmount || !budgetCategory) return

    const budget = {
      category: budgetCategory,
      limit: parseFloat(budgetAmount),
      spent: 0,
      period: budgetPeriod as 'monthly' | 'weekly'
    }

    DataSync.addBudget(budget)
    console.log("💰 Budget ajouté:", budget)
    
    // Réinitialiser le formulaire
    setBudgetAmount("")
    setBudgetCategory("")
    setBudgetPeriod("monthly")
    setIsSheetOpen(false)
  }

  const handleDeleteBudget = (budgetId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      DataSync.deleteBudget(budgetId)
      console.log('🗑️ Budget supprimé:', budgetId)
    }
  }

  const filteredBudgets = budgets.filter(budget =>
    budgetCategories.find(c => c.id === budget.category)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryInfo = (categoryId: string) => {
    return budgetCategories.find(c => c.id === categoryId) || budgetCategories[0]
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-12 py-12 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Budgets</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
              Gestion de vos budgets
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsSheetOpen(true)}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4" />
              Nouveau Budget
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Budget</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    {formatAmount(budgets.reduce((sum, b) => sum + b.limit, 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {budgets.length} budget{budgets.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center ring-2 ring-offset-2 ring-emerald-200">
                  <Target className="w-7 h-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Dépensé</p>
                  <p className="text-2xl font-black text-red-600 mt-1">
                    {formatAmount(budgets.reduce((sum, b) => sum + (b.spent || 0), 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((budgets.reduce((sum, b) => sum + (b.spent || 0), 0) / budgets.reduce((sum, b) => sum + b.limit, 0)) * 100) || 0}% utilisé
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center ring-2 ring-offset-2 ring-red-200">
                  <TrendingUp className="w-7 h-7 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Disponible</p>
                  <p className="text-2xl font-black text-green-600 mt-1">
                    {formatAmount(budgets.reduce((sum, b) => sum + b.limit - (b.spent || 0), 0))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(((budgets.reduce((sum, b) => sum + b.limit - (b.spent || 0), 0)) / budgets.reduce((sum, b) => sum + b.limit, 0)) * 100) || 0}% restant
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center ring-2 ring-offset-2 ring-green-200">
                  <PieChart className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Rechercher un budget..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-300 bg-white"
          />
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget List */}
          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Liste des Budgets</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSheetOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {filteredBudgets.length > 0 ? (
                <div className="space-y-4">
                  {filteredBudgets.map((budget) => {
                    const category = getCategoryInfo(budget.category)
                    const percentage = (budget.spent || 0) / budget.limit * 100
                    
                    return (
                      <div key={budget.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-emerald-100">
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{category.label}</p>
                            <p className="text-sm text-gray-500">
                              Limite: {formatAmount(budget.limit)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatAmount(budget.spent || 0)}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(percentage)}% utilisé
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Aucun budget trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-6">Statistiques Rapides</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="text-sm text-gray-500">Total des budgets</span>
                  <span className="font-bold text-gray-900">
                    {formatAmount(budgets.reduce((sum, b) => sum + b.limit, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="text-sm text-gray-500">Total dépensé</span>
                  <span className="font-bold text-red-600">
                    {formatAmount(budgets.reduce((sum, b) => sum + (b.spent || 0), 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <span className="text-sm text-gray-500">Total disponible</span>
                  <span className="font-bold text-green-600">
                    {formatAmount(budgets.reduce((sum, b) => sum + b.limit - (b.spent || 0), 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Budget Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto px-8">
            <SheetHeader className="px-8 pt-8">
              <SheetTitle>Ajouter un budget</SheetTitle>
              <SheetDescription>
                Définissez une limite de dépenses pour une catégorie
              </SheetDescription>
            </SheetHeader>
            
            <div className="px-8 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Montant</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  placeholder="Entrez le montant"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="h-12 rounded-xl border-gray-300 bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget-category">Catégorie</Label>
                <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-300 bg-white">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget-period">Période</Label>
                <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <SheetFooter className="px-8 pb-8">
              <Button 
                onClick={handleSaveBudget}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Ajouter le budget
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
