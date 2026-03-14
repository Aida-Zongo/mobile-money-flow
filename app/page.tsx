'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Smartphone, Wallet, Target, Users, Star, ChevronRight, Zap, Lock, Globe, CreditCard, PiggyBank, BarChart3, PieChart, Activity } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Hero Section avec illustrations */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Votre Solution
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                  Mobile Money
                </span>
                <br />
                <span className="text-3xl md:text-4xl">Intelligente</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Gérez facilement vos transactions Orange Money, Wave et Moov Money 
                avec une interface moderne et sécurisée.
              </p>
            </div>

            {/* Illustrations principales */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mobile First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Application optimisée pour mobile avec design responsive
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurisé</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vos données protégées par chiffrement de bout en bout
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Rapide</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transactions instantanées et interface ultra-rapide
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 text-lg"
              >
                Commencer Gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-lg"
              >
                Se connecter
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-500" />
                <span>100% Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Disponible 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>150K+ Utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer vos finances
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi des Dépenses</h3>
                <p className="text-gray-600 leading-relaxed">
                  Enregistrez et catégorisez toutes vos dépenses Mobile Money
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Statistiques Détaillées</h3>
                <p className="text-gray-600 leading-relaxed">
                  Graphiques interactifs et analyses de vos habitudes financières
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Budgets Intelligents</h3>
                <p className="text-gray-600 leading-relaxed">
                  Définissez des limites et recevez des alertes automatiques
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-opérateurs</h3>
                <p className="text-gray-600 leading-relaxed">
                  Orange Money, Wave et Moov Money en une seule application
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Épargne Objectif</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fixez des objectifs d'épargne et suivez votre progression
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 h-full hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Transactions en Temps Réel</h3>
                <p className="text-gray-600 leading-relaxed">
                  Suivez vos transactions instantanément après validation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Approuvé par des Milliers d'Utilisateurs
            </h2>
            <p className="text-xl text-white/90">
              Rejoignez la communauté MoneyFlow dès aujourd'hui
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">150K+</div>
              <div className="text-white/80">Utilisateurs Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">2.5M+</div>
              <div className="text-white/80">Transactions Traitées</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80">Uptime Garanti</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">Support Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Prêt à Transformer Votre Gestion Financière ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font déjà confiance à MoneyFlow 
            pour gérer leurs finances Mobile Money simplement et efficacement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 text-lg"
            >
              Commencer Gratuitement
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 text-lg"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MF</span>
                </div>
                <span className="font-bold text-xl">MoneyFlow</span>
              </div>
              <p className="text-gray-400">
                La solution complète pour gérer vos transactions Mobile Money au Burkina Faso.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Sécurité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Aide</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-300">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 MoneyFlow. Tous droits réservés. 🇧🇫</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
