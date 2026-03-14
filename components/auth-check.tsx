"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataSync } from "@/lib/data-sync"

interface User {
  email: string
  name: string
  isLoggedIn: boolean
}

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    // Nettoyer les anciennes données pour éviter les conflits
    const cleanupOldData = () => {
      localStorage.removeItem('moneyFlowUser')
      localStorage.removeItem('userTransactions')
      localStorage.removeItem('soldeInitial')
      console.log('🧹 Anciennes données nettoyées')
    }
    
    // Utiliser DataSync pour la cohérence
    const savedUser = DataSync.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      cleanupOldData() // Nettoyer après avoir récupéré l'utilisateur
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    if (email && password) {
      const userData: User = {
        email,
        name: email.split('@')[0],
        isLoggedIn: true
      }
      setUser(userData)
      DataSync.setCurrentUser(userData)
      console.log('👤 Utilisateur connecté:', userData.name)
    }
  }

  const handleRegister = () => {
    if (email && password && name) {
      const userData: User = {
        email,
        name,
        isLoggedIn: true
      }
      setUser(userData)
      DataSync.setCurrentUser(userData)
      console.log('👤 Nouvel utilisateur créé:', userData.name)
    }
  }

  const handleLogout = () => {
    setUser(null)
    DataSync.resetAll()
    console.log('👋 Déconnexion')
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div>Chargement...</div>
    </div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              MoneyFlow
            </CardTitle>
            <p className="text-muted-foreground">
              {isRegistering ? "Créez votre compte" : "Connectez-vous à votre compte"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  className="w-full"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full"
              />
            </div>
            <Button
              onClick={isRegistering ? handleRegister : handleLogin}
              className="w-full"
              disabled={!email || !password || (isRegistering && !name)}
            >
              {isRegistering ? "Créer un compte" : "Se connecter"}
            </Button>
            <div className="text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-primary hover:underline"
              >
                {isRegistering 
                  ? "Déjà un compte ? Connectez-vous" 
                  : "Pas de compte ? Inscrivez-vous"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Utilisateur connecté : afficher seulement le contenu (pas de barre de bienvenue)
  return <>{children}</>
}
