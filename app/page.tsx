"use client"

import { useEffect } from "react"
import { DataSync } from "@/lib/data-sync"

export default function HomePage() {
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    if (DataSync.isLoggedIn()) {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/auth"
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <span className="text-3xl font-bold text-white">MF</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MoneyFlow</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Gérez vos finances avec style et simplicité
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    </div>
  )
}
