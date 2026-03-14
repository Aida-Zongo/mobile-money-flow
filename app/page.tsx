'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          {/* Titre */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900">
              Gérez vos
              <span className="text-blue-600"> Mobile Money</span>
              <br />
              simplement
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La solution complète pour suivre vos dépenses Orange Money, 
              MTN, Moov Money et Wave au Burkina Faso.
            </p>
          </div>

          {/* Illustration simple */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">MF</span>
                </div>
                <span className="font-bold text-2xl text-gray-900">MoneyFlow</span>
              </div>

              {/* Solde */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90">Solde total</p>
                <p className="text-3xl font-bold">125 750 FCFA</p>
                <p className="text-sm opacity-75">+12% ce mois</p>
              </div>

              {/* Transactions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">OM</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Orange Money</p>
                      <p className="text-sm text-gray-500">Transfert</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">-5 000</p>
                    <p className="text-sm text-gray-500">Aujourd'hui</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">MTN</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">MoMo</p>
                      <p className="text-sm text-gray-500">Réception</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+15 000</p>
                    <p className="text-sm text-gray-500">Hier</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">2.8K</p>
                  <p className="text-sm text-gray-600">Utilisateurs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">15.2K</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">847K</p>
                  <p className="text-sm text-gray-600">Économisé</p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Chargement...</span>
                </div>
              ) : (
                'Commencer'
              )}
            </button>
            
            <button 
              onClick={() => router.push('/dashboard')}
              className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl transition-colors"
            >
              Voir Dashboard
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900">Multi-opérateurs</h3>
              <p className="text-sm text-gray-600">Orange, MTN, Moov, Wave</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900">Suivi en temps réel</h3>
              <p className="text-sm text-gray-600">Vos dépenses instantanément</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900">Sécurisé</h3>
              <p className="text-sm text-gray-600">Vos données protégées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
