"use client"

import { useState } from "react"
import { DataSync } from "@/lib/data-sync"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, LogIn } from "lucide-react"

interface AuthRequiredProps {
  children: React.ReactNode
  action?: "add" | "view" | "edit"
  message?: string
}

export default function AuthRequired({ children, action = "add", message }: AuthRequiredProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const user = DataSync.getCurrentUser()

  if (user) {
    return <>{children}</>
  }

  const handleLogin = () => {
    if (email && password) {
      const userData = {
        email,
        name: email.split('@')[0],
        isLoggedIn: true
      }
      DataSync.setCurrentUser(userData)
      window.location.reload()
    }
  }

  const handleRegister = () => {
    if (email && password && name) {
      const userData = {
        email,
        name,
        isLoggedIn: true
      }
      DataSync.setCurrentUser(userData)
      window.location.reload()
    }
  }

  const defaultMessage = action === "add" 
    ? "Pour ajouter des revenus ou des dépenses, veuillez créer un compte gratuitement."
    : "Pour accéder à cette fonctionnalité, veuillez vous connecter."

  return (
    <>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {action === "add" ? (
            <UserPlus className="w-8 h-8 text-gray-400" />
          ) : (
            <LogIn className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {action === "add" ? "Connexion requise" : "Compte requis"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {message || defaultMessage}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setShowLoginModal(true)}
            className="rounded-lg bg-primary hover:bg-primary/90"
          >
            {isRegistering ? "Créer un compte" : "Se connecter"}
          </Button>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
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
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLoginModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={isRegistering ? handleRegister : handleLogin}
                  className="flex-1"
                  disabled={!email || !password || (isRegistering && !name)}
                >
                  {isRegistering ? "Créer" : "Se connecter"}
                </Button>
              </div>
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
      )}
    </>
  )
}
