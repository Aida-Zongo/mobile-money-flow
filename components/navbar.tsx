"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Wallet, BarChart3, Bell, ChevronDown, LogOut, Settings, User, TrendingUp, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { DataSync } from "@/lib/data-sync"
import { NotificationDropdown } from "@/components/NotificationDropdown"

const navItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/expenses", label: "Depenses", icon: Wallet },
  { href: "/revenues", label: "Revenus", icon: TrendingUp },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/statistics", label: "Statistiques", icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasNotifications, setHasNotifications] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('Utilisateur')
  
  const handleNavigation = (href: string) => {
    console.log('Navigation vers:', href)
    // Utiliser window.location.href pour forcer la navigation
    window.location.href = href
  }
  
  const handleLogout = () => {
    // Déconnexion avec DataSync
    DataSync.resetAll()
    
    // Rediriger vers la page de connexion (recharger la page)
    window.location.href = '/login'
  }

  useEffect(() => {
    const checkAuth = () => {
      // Vérifier l'état de connexion avec DataSync
      const user = DataSync.getCurrentUser()
      
      if (user) {
        setIsLoggedIn(true)
        setUserName(user.name || 'Utilisateur')
      } else {
        setIsLoggedIn(false)
        setUserName('Utilisateur')
      }
    }

    checkAuth()
  }, [])

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-[68px]">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-[#0D9B76] flex items-center justify-center">
            <span className="text-white font-bold text-sm">MF</span>
          </div>
          <span className="font-bold text-xl text-foreground">MoneyFlow</span>
        </div>

        {/* Center - Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-muted rounded-2xl p-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-xl cursor-pointer",
                  isActive
                    ? "bg-card shadow-sm text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <NotificationDropdown />

              {/* Divider */}
              <div className="h-6 w-px bg-border mx-2" />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{userName.split(" ").map(n => n[0]).join("").toUpperCase()}</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">Utilisateur</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-lg border border-border z-50">
                    <div className="p-2">
                      <button
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left cursor-pointer"
                        onClick={() => {
                          handleNavigation('/profile')
                          setShowDropdown(false)
                        }}
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Mon profil
                      </button>
                      <button
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left cursor-pointer"
                        onClick={() => {
                          handleNavigation('/settings')
                          setShowDropdown(false)
                        }}
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Parametres
                      </button>
                      <button
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-destructive cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Deconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNavigation('/login')}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => handleNavigation('/register')}
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Inscription
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 transition-colors cursor-pointer",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
