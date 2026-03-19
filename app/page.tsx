import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-3xl font-bold text-white">MF</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MoneyFlow</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Gérez vos finances avec style et simplicité
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/auth"
            className="inline-flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Commencer
          </Link>
          <p className="text-sm text-gray-500">
            Ou connectez-vous à votre compte existant
          </p>
        </div>
      </div>
    </div>
  )
}
