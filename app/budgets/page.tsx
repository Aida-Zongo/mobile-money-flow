"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Calendar, TrendingUp, Target, PieChart, Settings, Trash2, ChevronDown, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthRequired from "@/components/auth-required"
import { DataSync, formatMoney, formatDate } from "@/lib/data-sync"
import AuthGuard from "@/components/AuthGuard"
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

function BudgetsContent() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("Ce mois")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetCategory, setBudgetCategory] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState("monthly")
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  // Catégories de base (modifiables par l'utilisateur)
  const [categories, setCategories] = useState([
    { id: "alimentation", label: "Alimentation", color: "#F5A623", icon: "🍔" },
    { id: "transport", label: "Transport", color: "#F97316", icon: "🚗" },
    { id: "logement", label: "Logement", color: "#3B82F6", icon: "🏠" },
    { id: "sante", label: "Santé", color: "#EF4444", icon: "🏥" },
    { id: "education", label: "Éducation", color: "#8B5CF6", icon: "📚" },
    { id: "loisirs", label: "Loisirs", color: "#EC4899", icon: "🎮" },
    { id: "shopping", label: "Shopping", color: "#14B8A6", icon: "🛍️" },
    { id: "autre", label: "Autre", color: "#6B7280", icon: "📦" },
  ])

  // Synchronisation des données
  useEffect(() => {
    // Charger les données initiales
    const loadInitialData = () => {
      const savedBudgets = DataSync.getBudgets()
      const savedCategories = localStorage.getItem('budgetCategories')
      
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
      
      setBudgets(savedBudgets)
      
      // Calculer les totaux
      const total = savedBudgets.reduce((sum, b) => sum + b.limit, 0)
      const spent = savedBudgets.reduce((sum, b) => sum + (b.spent || 0), 0)
      
      setTotalBudget(total)
      setTotalSpent(spent)
      
      console.log('📊 Budgets synchronisés:', savedBudgets.length)
    }
    
    loadInitialData()
    
    // Écouter les événements de synchronisation
    const handleSync = (event: CustomEvent) => {
      console.log('🔄 Événement de synchronisation reçu:', event.detail)
      if (event.detail.type === 'budget-added' || event.detail.type === 'budget-updated') {
        loadInitialData()
      }
    }
    
    DataSync.onSync(handleSync)
    
    // Nettoyer l'écouteur
    return () => {
      DataSync.cleanup(handleSync)
    }
  }, [])

  const handleSaveBudget = () => {
    if (!budgetAmount || !budgetCategory) return

    const newBudget = {
      id: Date.now(),
      category: budgetCategory,
      limit: parseFloat(budgetAmount),
      spent: 0,
      period: budgetPeriod as 'monthly' | 'weekly',
      createdAt: new Date().toISOString()
    }

    DataSync.addBudget(newBudget)
    console.log("💰 Budget ajouté:", newBudget)
    
    // Réinitialiser le formulaire
    setBudgetAmount("")
    setBudgetCategory("")
    setBudgetPeriod("monthly")
    setIsSheetOpen(false)
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory = {
      id: newCategoryName.toLowerCase().replace(/\s+/g, '_'),
      label: newCategoryName,
      color: "#" + Math.floor(Math.random()*16777215).toString(16),
      icon: "📁"
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem('budgetCategories', JSON.stringify(updatedCategories))
    
    setNewCategoryName("")
    setShowCategoryDialog(false)
    
    console.log('📂 Nouvelle catégorie ajoutée:', newCategory)
  }

  const handleDeleteBudget = (budgetId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      DataSync.deleteBudget(budgetId)
      console.log('🗑️ Budget supprimé:', budgetId)
    }
  }

  const filteredBudgets = budgets.filter(budget =>
    categories.find(c => c.id === budget.category)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0]
  }

  const getBudgetProgress = (budget: any) => {
    const percentage = (budget.spent || 0) / budget.limit * 100
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-12 py-12 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Budgets</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Gestion de vos budgets
            </p>
          </div>
          <div className="flex gap-3">
            <AuthRequired action="add" message="Pour créer des budgets, veuillez créer un compte gratuitement et accéder à toutes les fonctionnalités.">
              <Button
                onClick={() => setShowCategoryDialog(true)}
                variant="outline"
                className="rounded-lg border-border h-10 px-4 gap-2"
              >
                <Settings className="w-4 h-4" />
                Catégories
              </Button>
              <Button
                onClick={() => setIsSheetOpen(true)}
                className="rounded-lg bg-primary hover:bg-primary/90 h-10 px-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau Budget
              </Button>
            </AuthRequired>
          </div>
        </div>

        {/* Key Metrics - Style Statistiques */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-black text-primary mt-1">{formatAmount(totalBudget)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {budgets.length} budget{budgets.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-2 ring-offset-2 ring-primary/20">
                  <Target className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dépensé</p>
                  <p className="text-2xl font-black text-destructive mt-1">{formatAmount(totalSpent)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((totalSpent / totalBudget) * 100) || 0}% utilisé
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center ring-2 ring-offset-2 ring-destructive/20">
                  <TrendingUp className="w-7 h-7 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponible</p>
                  <p className="text-2xl font-black text-green-600 mt-1">{formatAmount(totalBudget - totalSpent)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(((totalBudget - totalSpent) / totalBudget) * 100) || 0}% restant
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
            className="pl-12 h-12 rounded-xl border-border/60 bg-background"
          />
        </div>

        {/* Budgets Grid - Style Statistiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget List */}
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
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
                      <div key={budget.id} className="flex items-center justify-between p-4 border border-border/30 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ backgroundColor: category.color + '20' }}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{category.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {budget.period === 'monthly' ? 'Mensuel' : 'Hebdomadaire'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{formatAmount(budget.limit)}</p>
                          <p className="text-sm text-destructive">{formatAmount(budget.spent || 0)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Aucun budget créé</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Progress */}
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Progression des Budgets</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryDialog(true)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {filteredBudgets.length > 0 ? (
                <div className="space-y-6">
                  {filteredBudgets.map((budget) => {
                    const category = getCategoryInfo(budget.category)
                    const percentage = (budget.spent || 0) / budget.limit * 100
                    
                    return (
                      <div key={budget.id} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <span className={`text-sm font-medium ${
                            percentage >= 100 ? 'text-red-600' : 
                            percentage >= 80 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${getBudgetProgress(budget)}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{formatAmount(budget.spent || 0)}</span>
                            <span>{formatAmount(budget.limit)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PieChart className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Créez des budgets pour voir la progression</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {filteredBudgets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucun budget trouvé" : "Aucun budget créé"}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? "Essayez une autre recherche" 
                : "Utilisez les boutons en haut pour créer vos premiers budgets"
              }
            </p>
          </div>
        )}

        {/* Add Budget Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto px-8">
            <SheetHeader className="px-8 pt-8">
              <SheetTitle>Créer un budget</SheetTitle>
              <SheetDescription>
                Définissez une limite de dépense pour une catégorie
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-8 py-8">
              <div className="space-y-3">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="amount">Montant du budget (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ex: 50000"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  min="0"
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="period">Période</Label>
                <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionner une période" />
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
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleSaveBudget}>
                Créer le budget
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Add Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter une catégorie</DialogTitle>
              <DialogDescription>
                Créez une nouvelle catégorie pour vos budgets
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nom de la catégorie</Label>
                <Input
                  id="categoryName"
                  placeholder="Ex: Voyages, Cadeaux..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCategoryDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddCategory}>
                Ajouter la catégorie
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function BudgetsPage() {
  return (
    <AuthGuard>
      <BudgetsContent />
    </AuthGuard>
  )
}
