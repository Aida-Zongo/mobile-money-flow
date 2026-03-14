'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Shield, Smartphone, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Ne plus rediriger automatiquement
    // L'utilisateur choisit lui-même
  }, [])

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gérez vos
                  <span className="text-blue-600"> Mobile Money</span>
                  <br />
                  simplement
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  La solution complète pour suivre vos dépenses Orange Money, 
                  MTN, Moov Money et Wave au Burkina Faso.
                </p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-opérateurs</h3>
                    <p className="text-sm text-gray-600">Orange, MTN, Moov, Wave</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Suivi en temps réel</h3>
                    <p className="text-sm text-gray-600">Vos dépenses instantanément</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sécurisé</h3>
                    <p className="text-sm text-gray-600">Vos données protégées</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Commencer</span>
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="border-2 border-gray-300 px-8 py-3 text-lg"
                >
                  Voir Dashboard
                </Button>
              </div>
            </div>

            {/* Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
                {/* Illustration stylisée */}
                <div className="relative">
                  {/* Phone mock */}
                  <div className="bg-white rounded-2xl shadow-2xl p-6 mx-auto w-64">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900">MoneyFlow</span>
                        </div>
                        <div className="text-xs text-gray-500">9:41</div>
                      </div>

                      {/* Balance */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Solde total</p>
                        <p className="text-2xl font-bold">125 750 FCFA</p>
                        <p className="text-xs opacity-75">+12% ce mois</p>
                      </div>

                      {/* Transactions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-orange-600">OM</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Orange Money</p>
                              <p className="text-xs text-gray-500">Transfert</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-red-600">-5 000</p>
                            <p className="text-xs text-gray-500">Aujourd'hui</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-yellow-600">MTN</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">MoMo</p>
                              <p className="text-xs text-gray-500">Réception</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">+15 000</p>
                            <p className="text-xs text-gray-500">Hier</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="flex justify-around pt-4 border-t">
                        <div className="text-center">
                          <div className="w-6 h-6 bg-blue-600 rounded mx-auto mb-1"></div>
                          <p className="text-xs text-gray-600">Accueil</p>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-1"></div>
                          <p className="text-xs text-gray-600">Stats</p>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-300 rounded mx-auto mb-1"></div>
                          <p className="text-xs text-gray-600">Plus</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-full shadow-lg p-3">
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-full shadow-lg p-3">
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">2,847</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">15.2K</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Économisé</p>
                  <p className="text-2xl font-bold text-gray-900">847K</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">98%</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
