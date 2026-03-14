'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Smartphone, Wallet, Target } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useState(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
              <span className="font-bold text-xl text-gray-900">MoneyFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    router.push('/dashboard')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg hover:from-emerald-600 hover:to-blue-700 transition-all"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Gérez Votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                Argent Mobile Money
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              La solution complète pour suivre vos transactions Orange Money, Wave et Moov Money 
              au Burkina Faso. Simple, rapide et sécurisée.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile Money Intégré</h3>
              <p className="text-gray-600 leading-relaxed">
                Support complet d'Orange Money, Wave et Moov Money pour toutes vos transactions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi en Temps Réel</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualisez vos revenus et dépenses instantanément avec des graphiques interactifs.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité Maximale</h3>
              <p className="text-gray-600 leading-relaxed">
                Vos données financières protégées par un chiffrement de bout en bout.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Budgets Intelligents</h3>
              <p className="text-gray-600 leading-relaxed">
                Définissez des limites et recevez des alertes avant de dépasser vos budgets.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Objectifs Financiers</h3>
              <p className="text-gray-600 leading-relaxed">
                Fixez des objectifs d'épargne et suivez votre progression en temps réel.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rapports Détaillés</h3>
              <p className="text-gray-600 leading-relaxed">
                Exportez vos données et analysez vos habitudes de dépenses mensuelles.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à Reprendre le Contrôle de Vos Finances ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de Burkinabè qui gèrent leur argent Mobile Money 
              simplement et efficacement avec MoneyFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white/10 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">150K+</div>
              <div className="text-gray-600">Utilisateurs Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">2.5M+</div>
              <div className="text-gray-600">Transactions Traitées</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Garanti</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Support Disponible</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MF</span>
              </div>
              <span className="font-bold text-xl">MoneyFlow</span>
            </div>
            <p className="text-gray-400 mb-6">
              La meilleure application pour gérer vos transactions Mobile Money au Burkina Faso.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">À propos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Tarifs</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 MoneyFlow. Tous droits réservés. 🇧🇫
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
