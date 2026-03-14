"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Phone, Mail, Lock, Smartphone, Wallet, FileText, MessageCircle, Star, Camera, ChevronRight, Shield, CreditCard, Bell, HelpCircle, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [securityOpen, setSecurityOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  
  const handleLogout = () => {
    // Déconnexion - nettoyer localStorage
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userPhone')
    
    // Rediriger vers la page de connexion
    window.location.href = "/login"
  }

  type MenuItemAction = {
  icon: any
  label: string
  action: () => void
  href?: never
  toggle?: never
  value?: never
  onChange?: never
}

type MenuItemToggle = {
  icon: any
  label: string
  action?: never
  href?: never
  toggle: true
  value: boolean
  onChange: (value: boolean) => void
}

type MenuItemLink = {
  icon: any
  label: string
  action?: never
  href: string
  toggle?: never
  value?: never
  onChange?: never
}

type MenuItem = MenuItemAction | MenuItemToggle | MenuItemLink

const menuSections = [
    {
      title: "Application",
      items: [
        {
          icon: User,
          label: "Mon profil",
          href: "/profile",
        },
        {
          icon: Shield,
          label: "Securite",
          action: () => setSecurityOpen(true),
        },
        {
          icon: CreditCard,
          label: "Comptes Mobile Money",
          href: "/accounts",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          toggle: true,
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          icon: Wallet,
          label: "Alertes budget",
          toggle: true,
          value: budgetAlerts,
          onChange: setBudgetAlerts,
        },
        {
          icon: FileText,
          label: "Rapport hebdomadaire",
          toggle: true,
          value: weeklyReport,
          onChange: setWeeklyReport,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Centre d'aide",
          action: () => alert("Centre d'aide bientôt disponible !"),
        },
        {
          icon: MessageCircle,
          label: "Nous contacter",
          action: () => alert("Contactez-nous à : support@moneyflow.bf"),
        },
        {
          icon: Star,
          label: "Noter l'application",
          action: () => alert("Merci d'utiliser MoneyFlow ! ⭐⭐⭐⭐⭐"),
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-foreground">Parametres</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
            Configuration de l'application
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Menu Sections */}
          <div className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  {section.title}
                </h3>
                <Card className="rounded-2xl shadow-sm border border-border/60 divide-y divide-border">
                  {section.items.map((item, index) => {
                    const hasHref = 'href' in item
                    const hasAction = 'action' in item
                    const hasToggle = 'toggle' in item
                    
                    if (hasHref) {
                      return (
                        <Link
                          key={index}
                          href={(item as MenuItemLink).href}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-all first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground">{item.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Link>
                      )
                    }
                    
                    if (hasToggle) {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-all first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-semibold text-foreground">{item.label}</span>
                          </div>
                          <Switch
                            checked={(item as MenuItemToggle).value}
                            onCheckedChange={(item as MenuItemToggle).onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      )
                    }
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-all first:rounded-t-2xl last:rounded-b-2xl"
                        onClick={hasAction ? (item as MenuItemAction).action : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-semibold text-foreground">{item.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )
                  })}
                </Card>
              </div>
            ))}
            {/* Logout Button */}
            <Card className="rounded-2xl shadow-sm border border-border/60">
              <button 
                className="flex items-center gap-3 p-4 w-full text-destructive hover:bg-destructive/5 transition-colors rounded-2xl"
                onClick={() => setShowLogoutConfirm(true)}
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-destructive" />
                </div>
                <span className="font-semibold">Se deconnecter</span>
              </button>
            </Card>

            {/* App Version */}
            <p className="text-center text-xs text-muted-foreground py-2">
              MoneyFlow v1.0.0 (Beta)
            </p>
          </div>
        </div>
      </div>

      
      {/* Security Sheet */}
      <Sheet open={securityOpen} onOpenChange={setSecurityOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-2xl font-black text-foreground">
              Securite
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm border border-border/60 divide-y divide-border">
              <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors first:rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Changer le mot de passe</p>
                    <p className="text-xs text-muted-foreground">
                      Derniere modification il y a 30 jours
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Code PIN</p>
                    <p className="text-xs text-muted-foreground">
                      Activer le deverrouillage par PIN
                    </p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-primary" />
              </div>

              <div className="flex items-center justify-between p-4 last:rounded-b-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Authentification biometrique</p>
                    <p className="text-xs text-muted-foreground">
                      Empreinte digitale ou Face ID
                    </p>
                  </div>
                </div>
                <Switch className="data-[state=checked]:bg-primary" />
              </div>
            </Card>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Sessions actives
              </h4>
              <Card className="rounded-2xl shadow-sm border border-border/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Cet appareil</p>
                    <p className="text-xs text-muted-foreground">
                      Ouagadougou, Burkina Faso
                    </p>
                  </div>
                  <span className="text-xs text-success font-semibold bg-success/10 px-2 py-1 rounded-full">
                    Actif
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      
      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm mx-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Se déconnecter ?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Êtes-vous sûr de vouloir vous déconnecter de MoneyFlow ?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-full"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex-1 rounded-full bg-destructive hover:bg-destructive/90"
                >
                  Se déconnecter
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
