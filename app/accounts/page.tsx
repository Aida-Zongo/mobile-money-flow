"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Plus,
  Wallet,
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  CreditCard,
} from "lucide-react"

const operators = [
  { id: "orange", label: "Orange Money", color: "#FF6600", logo: "🟠" },
  { id: "moov", label: "Moov Money", color: "#0066CC", logo: "🔵" },
  { id: "coris", label: "Coris Money", color: "#00A651", logo: "🟢" },
]

const mockAccounts = [
  {
    id: 1,
    operator: "orange",
    phoneNumber: "+226 70 12 34 56",
    name: "Compte principal",
    balance: 125000,
    isActive: true,
    isDefault: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    operator: "moov",
    phoneNumber: "+226 76 98 76 54",
    name: "Compte secondaire",
    balance: 45000,
    isActive: true,
    isDefault: false,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    operator: "coris",
    phoneNumber: "+226 71 23 45 67",
    name: "Compte business",
    balance: 250000,
    isActive: true,
    isDefault: false,
    createdAt: "2024-01-05",
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

export default function AccountsPage() {
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
  const [accounts, setAccounts] = useState(mockAccounts)
  const [selectedOperator, setSelectedOperator] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [showErrors, setShowErrors] = useState(false)

  const getOperatorInfo = (operatorId: string) => {
    return operators.find((o) => o.id === operatorId)
  }

  const totalBalance = accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance, 0)

  const handleAddAccount = () => {
    if (!selectedOperator || !phoneNumber || !accountName) {
      setShowErrors(true)
      return
    }

    const newAccount = {
      id: accounts.length + 1,
      operator: selectedOperator,
      phoneNumber,
      name: accountName,
      balance: 0,
      isActive: true,
      isDefault: accounts.length === 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setAccounts([...accounts, newAccount])
    setSelectedOperator("")
    setPhoneNumber("")
    setAccountName("")
    setShowErrors(false)
    setIsAddSheetOpen(false)
  }

  const handleDeleteAccount = (accountId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      setAccounts(accounts.filter(account => account.id !== accountId))
    }
  }

  const handleSetDefault = (accountId: number) => {
    setAccounts(accounts.map(account => ({
      ...account,
      isDefault: account.id === accountId
    })))
  }

  const handleToggleActive = (accountId: number) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isActive: !account.isActive }
        : account
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Comptes Mobile Money</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Gestion de vos comptes
            </p>
          </div>
          <Button
            onClick={() => setIsAddSheetOpen(true)}
            className="rounded-full bg-primary hover:bg-primary/90 btn-primary-shadow gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter un compte
          </Button>
        </div>

        {/* Total Balance Card */}
        <Card className="p-6 rounded-2xl shadow-sm border border-border/60 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Solde total</p>
              <p className="text-3xl font-black text-foreground mt-1">{formatCurrency(totalBalance)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {accounts.filter(a => a.isActive).length} compte(s) actif(s)
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
        </Card>

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((account) => {
            const operator = getOperatorInfo(account.operator)
            
            return (
              <Card 
                key={account.id} 
                className={`rounded-2xl shadow-sm border ${
                  !account.isActive 
                    ? "border-border/40 bg-muted/30" 
                    : "border-border/60"
                } p-6`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${operator?.color}15` }}
                      >
                        {operator?.logo}
                      </div>
                      {account.isDefault && (
                        <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {!account.isActive && (
                        <div className="absolute -top-1 -right-1 bg-muted rounded-full p-1">
                          <AlertCircle className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{account.name}</h3>
                        {account.isDefault && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{account.phoneNumber}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${operator?.color}15`,
                            color: operator?.color,
                          }}
                        >
                          {operator?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Ajouté le {new Date(account.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        account.isActive ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {formatCurrency(account.balance)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {account.isActive ? "Actif" : "Inactif"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleActive(account.id)}
                        className="h-8 w-8 p-0"
                      >
                        {account.isActive ? (
                          <Shield className="w-4 h-4 text-success" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      
                      {!account.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(account.id)}
                          className="h-8 w-8 p-0"
                        >
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <Card className="rounded-2xl shadow-sm border border-border/60 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Aucun compte Mobile Money</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Ajoutez votre premier compte Mobile Money pour commencer à suivre vos transactions
            </p>
            <Button
              onClick={() => setIsAddSheetOpen(true)}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Ajouter un compte
            </Button>
          </Card>
        )}
      </div>

      {/* Add Account Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-2xl font-black">Nouveau compte Mobile Money</SheetTitle>
            <SheetDescription>
              Ajoutez un nouveau compte Mobile Money à votre profil
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6">
            {/* Operator Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Opérateur</Label>
              <div className="grid grid-cols-1 gap-3">
                {operators.map((operator) => (
                  <button
                    key={operator.id}
                    onClick={() => setSelectedOperator(operator.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedOperator === operator.id
                        ? "border-primary bg-primary-light"
                        : "border-border bg-card hover:border-primary/50 card-hover"
                    }`}
                  >
                    <div className="text-2xl">{operator.logo}</div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{operator.label}</p>
                      <p className="text-xs text-muted-foreground">
                        Compte {operator.label.toLowerCase()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Numéro de téléphone</Label>
              <Input
                placeholder="+226 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`rounded-xl h-12 input-glow ${
                  showErrors && !phoneNumber ? "border-red-500 border-2" : ""
                }`}
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Nom du compte</Label>
              <Input
                placeholder="Ex: Compte principal"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className={`rounded-xl h-12 input-glow ${
                  showErrors && !accountName ? "border-red-500 border-2" : ""
                }`}
              />
            </div>
          </div>

          {/* Error Message */}
          {showErrors && (!selectedOperator || !phoneNumber || !accountName) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 font-medium">
                ⚠️ Veuillez remplir tous les champs obligatoires
              </p>
            </div>
          )}

          <SheetFooter className="pt-6 border-t">
            <Button
              onClick={handleAddAccount}
              className="w-full rounded-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold btn-primary-shadow"
            >
              Ajouter le compte
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
