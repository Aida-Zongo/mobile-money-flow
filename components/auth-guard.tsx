"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import FirebaseService from "../services/firebase.service"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié avec Firebase
        if (!FirebaseService.isAuthenticated()) {
          // Vérifier localStorage pour l'état initial
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('firebaseToken')
            const user = localStorage.getItem('user')
            
            if (!token || !user) {
              router.push('/login')
              return
            }
          } else {
            router.push('/login')
            return
          }
        }

        // Optionnel : Valider avec le backend
        // await FirebaseService.getMe()
        
        setIsLoading(false)
      } catch (error) {
        console.error('Erreur authentification:', error)
        await FirebaseService.logout()
        
        // Nettoyer localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('firebaseToken')
          localStorage.removeItem('user')
        }
        
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Authentification Firebase...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
