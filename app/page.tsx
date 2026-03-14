'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Smartphone, Wallet, Target, BarChart3, Users, Star, ChevronDown, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    features: false,
    stats: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Animation des sections au scroll
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          section.classList.add('animate-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialiser les animations après chargement
    setTimeout(() => {
      setVisibleSections({
        hero: true,
        features: true,
        stats: true,
        cta: true
      });
    }, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Money Intégré",
      description: "Support complet d'Orange Money, Wave et Moov Money pour toutes vos transactions",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Suivi en Temps Réel",
      description: "Visualisez vos revenus et dépenses instantanément avec des graphiques interactifs",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité Maximale",
      description: "Vos données financières protégées par un chiffrement de bout en bout",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Budgets Intelligents",
      description: "Définissez des limites et recevez des alertes avant de dépasser",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "150K+", label: "Utilisateurs Actifs" },
    { number: "2.5M+", label: "Transactions Traitées" },
    { number: "99.9%", label: "Uptime Garanti" },
    { number: "24/7", label: "Support Disponible" }
  ];

  const testimonials = [
    {
      name: "Aminata B.",
      role: "Commerçante à Ouagadougou",
      content: "MoneyFlow a transformé ma façon de gérer mon business. Je peux suivre toutes mes transactions Mobile Money en un seul endroit !",
      rating: 5
    },
    {
      name: "Karim T.",
      role: "Étudiant à Bobo-Dioulasso",
      content: "Simple, rapide et efficace. L'application m'aide à contrôler mes dépenses mensuelles et à mieux planifier mon budget.",
      rating: 5
    },
    {
      name: "Fatoumata K.",
      role: "Freelance à Koudougou",
      content: "Les alertes de budget sont géniales ! Je ne dépasse plus jamais mes limites grâce aux notifications en temps réel.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">MF</span>
              </div>
              <span className="font-bold text-xl text-gray-900">MoneyFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#stats" className="text-gray-600 hover:text-gray-900 transition-colors">
                Statistiques
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Témoignages
              </Link>
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                Commencer Gratuitement
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link href="#features" className="block text-gray-600 hover:text-gray-900">
                Fonctionnalités
              </Link>
              <Link href="#stats" className="block text-gray-600 hover:text-gray-900">
                Statistiques
              </Link>
              <Link href="#testimonials" className="block text-gray-600 hover:text-gray-900">
                Témoignages
              </Link>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-600">
                Commencer Gratuitement
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section avec Illustration */}
      <section className={`relative min-h-screen flex items-center justify-center px-4 py-20 transition-all duration-1000 ${
        visibleSections.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-purple-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gérez Votre Argent
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600">
                    Mobile Money
                  </span>
                  <br />
                  <span className="text-3xl lg:text-4xl">en Toute Simplicité</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  La première application burkinabè conçue pour suivre vos transactions 
                  <span className="font-semibold">Orange Money</span>, 
                  <span className="font-semibold">Wave</span> et 
                  <span className="font-semibold">Moov Money</span> 
                  en un seul endroit.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-lg px-8 py-4">
                  <Link href="/register" className="flex items-center gap-2">
                    Commencer Gratuitement
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <Link href="/login">Se Connecter</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">100% Sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Mobile First</span>
                </div>
              </div>
            </div>

            {/* Illustration SVG Personnage */}
            <div className="relative">
              <svg
                viewBox="0 0 400 500"
                className="w-full h-auto max-w-md lg:max-w-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Personnage tenant téléphone */}
                {/* Corps */}
                <ellipse cx="200" cy="380" rx="60" ry="80" fill="#3B82F6" />
                
                {/* Tête */}
                <circle cx="200" cy="280" r="35" fill="#FDB5A6" />
                
                {/* Cheveux */}
                <path d="M165 260 Q200 240, 235 260" fill="#1F2937" />
                <path d="M165 265 Q200 250, 235 265" fill="#1F2937" />
                
                {/* Yeux */}
                <circle cx="185" cy="275" r="3" fill="#1F2937" />
                <circle cx="215" cy="275" r="3" fill="#1F2937" />
                
                {/* Sourire */}
                <path d="M185 290 Q200 300, 215 290" stroke="#1F2937" strokeWidth="2" fill="none" />
                
                {/* Bras tenant téléphone */}
                <ellipse cx="140" cy="350" rx="15" ry="40" fill="#FDB5A6" transform="rotate(-30 140 350)" />
                <ellipse cx="260" cy="350" rx="15" ry="40" fill="#FDB5A6" transform="rotate(30 260 350)" />
                
                {/* Téléphone */}
                <rect x="170" y="320" width="60" height="100" rx="8" fill="#1F2937" />
                <rect x="175" y="325" width="50" height="90" rx="4" fill="#3B82F6" />
                
                {/* Écran du téléphone avec interface MoneyFlow */}
                <rect x="180" y="335" width="40" height="70" rx="2" fill="#000000" />
                
                {/* Interface sur l'écran */}
                <text x="200" y="355" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="bold">
                  MoneyFlow
                </text>
                
                {/* Lignes de transaction */}
                <line x1="185" y1="365" x2="215" y2="365" stroke="#10B981" strokeWidth="1" />
                <line x1="185" y1="375" x2="205" y2="375" stroke="#10B981" strokeWidth="1" />
                <line x1="185" y1="385" x2="210" y2="385" stroke="#10B981" strokeWidth="1" />
                
                {/* Symboles Mobile Money autour */}
                {/* Orange Money */}
                <g transform="translate(80, 300)">
                  <circle cx="20" cy="20" r="18" fill="#FF6600" opacity="0.8" />
                  <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    OM
                  </text>
                </g>
                
                {/* Wave */}
                <g transform="translate(300, 280)">
                  <circle cx="20" cy="20" r="18" fill="#00D4AA" opacity="0.8" />
                  <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    WV
                  </text>
                </g>
                
                {/* Moov Money */}
                <g transform="translate(100, 400)">
                  <circle cx="20" cy="20" r="18" fill="#FFA500" opacity="0.8" />
                  <text x="20" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                    MV
                  </text>
                </g>
                
                {/* Pièces et billets flottants */}
                <g transform="translate(50, 250)">
                  <circle cx="15" cy="15" r="12" fill="#FFD700" opacity="0.6" />
                  <text x="15" y="19" textAnchor="middle" fill="#B8860B" fontSize="8" fontWeight="bold">
                    FCFA
                  </text>
                </g>
                
                <g transform="translate(320, 350)">
                  <rect x="10" y="8" width="20" height="12" rx="2" fill="#10B981" opacity="0.7" />
                  <text x="20" y="17" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
                    5000
                  </text>
                </g>
                
                <g transform="translate(280, 420)">
                  <circle cx="12" cy="12" r="10" fill="#FFD700" opacity="0.5" />
                  <text x="12" y="16" textAnchor="middle" fill="#B8860B" fontSize="7" fontWeight="bold">
                    1000
                  </text>
                </g>
                
                {/* Lignes de connexion */}
                <path d="M100 320 Q150 300, 170 320" stroke="#10B981" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5" />
                <path d="M300 280 Q250 260, 230 300" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5" />
                <path d="M120 400 Q160 380, 170 400" stroke="#FFA500" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 transition-all duration-1000 delay-300 ${
        visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout Ce Dont Vous Avez Besoin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des fonctionnalités conçues spécifiquement pour le marché burkinabè
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className={`py-20 px-4 bg-gradient-to-r from-emerald-50 to-blue-50 transition-all duration-1000 delay-500 ${
        visibleSections.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Approuvé par des Milliers d'Utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez une communauté qui fait confiance à MoneyFlow
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 px-4 transition-all duration-1000 delay-700 ${
        visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi MoneyFlow est l'application préférée au Burkina Faso
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 transition-all duration-1000 delay-1000 ${
        visibleSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à Reprendre le Contrôle de Vos Finances ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de Burkinabè qui gèrent leur argent Mobile Money 
            simplement et efficacement avec MoneyFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4">
              <Link href="/register" className="flex items-center gap-2">
                Commencer Gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
              <Link href="/login">Se Connecter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MoneyFlow</h3>
              <p className="text-gray-400">
                La meilleure application pour gérer vos transactions Mobile Money au Burkina Faso.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Sécurité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Aide</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
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

      {/* CSS pour animations */}
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-300 {
          transition-delay: 300ms;
        }
        
        .delay-500 {
          transition-delay: 500ms;
        }
        
        .delay-700 {
          transition-delay: 700ms;
        }
        
        .delay-1000 {
          transition-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
