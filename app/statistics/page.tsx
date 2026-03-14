"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import AuthGuard from "@/components/AuthGuard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Smartphone,
  Zap,
  Heart,
  GraduationCap,
  MoreHorizontal,
  ChevronDown,
  ArrowRight
} from "lucide-react"
import { 
  getTransactions, 
  getRevenues, 
  getExpenses, 
  getTotalRevenues, 
  getTotalExpenses, 
  getCurrentBalance,
  getInitialBalance
} from "@/lib/transactions"

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

const defaultCategories = [
  { name: "Alimentation", color: "#F5A623", icon: Utensils },
  { name: "Transport", color: "#0A7B5E", icon: Car },
  { name: "Shopping", color: "#F04438", icon: ShoppingBag },
  { name: "Telecom", color: "#8B5CF6", icon: Smartphone },
  { name: "Energie", color: "#F59E0B", icon: Zap },
  { name: "Sante", color: "#16A34A", icon: Heart },
  { name: "Education", color: "#3B82F6", icon: GraduationCap },
  { name: "Autre", color: "#8A94A6", icon: MoreHorizontal },
]

const periods = ["Cette semaine", "Ce mois", "3 derniers mois", "Cette annee"]

function StatisticsContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("Ce mois")
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [showTrendModal, setShowTrendModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showEconomyModal, setShowEconomyModal] = useState(false)
  
  // Données réelles
  const [revenues, setRevenues] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  // Charger les données réelles
  useEffect(() => {
    const loadData = () => {
      const realRevenues = getRevenues()
      const realExpenses = getExpenses()
      
      console.log("📊 Chargement statistiques:")
      console.log("Revenus trouvés:", realRevenues.length)
      console.log("Dépenses trouvées:", realExpenses.length)
      
      setRevenues(realRevenues)
      setExpenses(realExpenses)
      
      // Calculer les données par catégorie
      const expensesByCategory = realExpenses.reduce((acc: any, expense: any) => {
        const categoryName = expense.category || 'autre'
        const category = defaultCategories.find(cat => 
          cat.name.toLowerCase() === categoryName.toLowerCase()
        ) || defaultCategories[7]
        
        if (!acc[categoryName]) {
          acc[categoryName] = { name: category.name, value: 0, color: category.color, icon: category.icon }
        }
        acc[categoryName].value += expense.amount
        return acc
      }, {})
      
      const categoryArray = Object.values(expensesByCategory).filter((cat: any) => cat.value > 0)
      setCategoryData(categoryArray)
      
      // Calculer les données mensuelles (simplifié pour l'exemple)
      const currentMonth = new Date().getMonth()
      const months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"]
      const monthlyArray = []
      
      for (let i = 0; i <= currentMonth && i < 6; i++) {
        const monthRevenues = realRevenues
          .filter((rev: any) => {
            const revDate = new Date(rev.date)
            return revDate.getMonth() === i
          })
          .reduce((sum: number, rev: any) => sum + rev.amount, 0)
        
        const monthExpenses = realExpenses
          .filter((exp: any) => {
            const expDate = new Date(exp.date)
            return expDate.getMonth() === i
          })
          .reduce((sum: number, exp: any) => sum + exp.amount, 0)
        
        monthlyArray.push({
          name: months[i],
          revenus: monthRevenues,
          depenses: monthExpenses
        })
      }
      
      console.log("Données mensuelles:", monthlyArray)
      setMonthlyData(monthlyArray)
    }
    
    loadData()
  }, [])

  const totalExpenses = categoryData.reduce((acc: number, item: any) => acc + item.value, 0)
  const totalRevenues = getTotalRevenues()
  const currentBalance = getCurrentBalance()
  const initialBalance = getInitialBalance()

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-4 rounded-xl shadow-lg border border-border">
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.dataKey === "revenus" ? "Revenus" : "Depenses"}: {formatAmount(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-12 py-12 space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Statistiques</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Analyse de vos finances
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-lg border-border h-10 px-4 gap-2"
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
          >
            {selectedPeriod}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solde Actuel</p>
                  <p className="text-2xl font-black text-primary mt-1">{formatAmount(currentBalance)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentBalance >= initialBalance ? "+" : ""}{formatAmount(currentBalance - initialBalance)} vs initial
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ring-2 ring-offset-2 ring-primary/20">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenus</p>
                  <p className="text-2xl font-black text-success mt-1">{formatAmount(totalRevenues)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {revenues.length} transaction{revenues.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center ring-2 ring-offset-2 ring-success/20">
                  <TrendingUp className="w-7 h-7 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Depenses</p>
                  <p className="text-2xl font-black text-destructive mt-1">{formatAmount(totalExpenses)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {expenses.length} transaction{expenses.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center ring-2 ring-offset-2 ring-destructive/20">
                  <TrendingDown className="w-7 h-7 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Répartition par Catégorie</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryModal(true)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatAmount(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Aucune dépense enregistrée</p>
                  </div>
                </div>
              )}
              
              {/* Category List */}
              {categoryData.length > 0 && (
                <div className="mt-6 space-y-3">
                  {categoryData.map((category: any) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{formatAmount(category.value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="rounded-2xl shadow-sm border border-border/60 card-hover">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Tendance Mensuelle</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrendModal(true)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenus" fill="#16A34A" name="Revenus" />
                    <Bar dataKey="depenses" fill="#F04438" name="Dépenses" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Aucune donnée mensuelle</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {categoryData.length === 0 && monthlyData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune donnée statistique</h3>
            <p className="text-gray-500 mb-6">
              Commencez par ajouter des revenus et des dépenses pour voir vos statistiques
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.href = '/revenues'}
                className="rounded-lg bg-success hover:bg-success/90"
              >
                Ajouter un revenu
              </Button>
              <Button
                onClick={() => window.location.href = '/expenses'}
                className="rounded-lg bg-destructive hover:bg-destructive/90"
              >
                Ajouter une dépense
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <Dialog open={showTrendModal} onOpenChange={setShowTrendModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analyse des Tendances</DialogTitle>
            <DialogDescription>
              Visualisez l'évolution de vos finances sur plusieurs mois
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Cette fonctionnalité vous permettra d'analyser en détail les tendances de vos revenus et dépenses.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analyse par Catégorie</DialogTitle>
            <DialogDescription>
              Découvrez où va votre argent par catégorie de dépenses
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Cette fonctionnalité vous permettra d'analyser en détail vos dépenses par catégorie.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEconomyModal} onOpenChange={setShowEconomyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Potentiel d'Économie</DialogTitle>
            <DialogDescription>
              Identifiez les opportunités d'économiser plus
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Cette fonctionnalité vous aidera à identifier où vous pouvez économiser.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default function StatisticsPage() {
  return (
    <AuthGuard>
      <StatisticsContent />
    </AuthGuard>
  )
}
