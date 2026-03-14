'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Simulation de login pour les tests
      if (email && password) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', 'test-token');
          localStorage.setItem('user', JSON.stringify({ 
            name: 'Test User', 
            email: email 
          }));
        }
        router.push('/dashboard');
      } else {
        setError('Veuillez remplir tous les champs');
      }
    } catch (err: any) {
      setError('Erreur de connexion: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex" 
      style={{ 
        backgroundColor: '#F5F7F5', 
        fontFamily: "'DM Sans', sans-serif" 
      }}
    >
      {/* LEFT PANEL */}
      <div 
        className="hidden lg:flex flex-col 
          justify-between w-1/2 p-12"
        style={{ backgroundColor: '#0A7B5E' }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-2xl bg-white 
              flex items-center justify-center"
          >
            <span 
              style={{ 
                color: '#0A7B5E', 
                fontWeight: 800, 
                fontSize: 16 
              }}
            >
              MF
            </span>
          </div>
          <span className="text-white font-bold text-xl">
            MoneyFlow
          </span>
        </div>
        <div>
          <div 
            className="w-16 h-16 rounded-3xl mb-6 
              flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <span className="text-3xl">💰</span>
          </div>
          <h1 
            className="text-white text-4xl font-bold 
              leading-tight mb-4"
          >
            Votre argent,<br />sous contrôle.
          </h1>
          <p 
            style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: 16, 
              lineHeight: 1.6 
            }}
          >
            Suivez vos dépenses Mobile Money, gérez vos 
            budgets et comprenez vos habitudes financières.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap">
            {['Orange Money', 'Wave', 'Moov Money'].map(
              (op) => (
                <span 
                  key={op} 
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.15)', 
                    color: 'rgba(255,255,255,0.9)' 
                  }}
                >
                  {op}
                </span>
              )
            )}
          </div>
        </div>
        <div 
          style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: 14 
          }}
        >
          © 2026 MoneyFlow — Burkina Faso
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div 
        className="flex-1 flex items-center 
          justify-center p-6"
      >
        <div className="w-full max-w-md">
          <div 
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <h2 
              className="text-2xl font-bold mb-1"
              style={{ color: '#1A1D23' }}
            >
              Bon retour 👋
            </h2>
            <p 
              className="mb-8 text-sm"
              style={{ color: '#8A94A6' }}
            >
              Connectez-vous à votre compte
            </p>

            {error && (
              <div 
                className="mb-4 px-4 py-3 rounded-2xl text-sm"
                style={{ 
                  backgroundColor: '#FEF2F2', 
                  color: '#F04438' 
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#1A1D23' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full px-4 py-3 rounded-xl 
                    outline-none text-sm"
                  style={{ 
                    border: '1.5px solid #E2EAE7', 
                    color: '#1A1D23', 
                    backgroundColor: '#FAFBFC' 
                  }}
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#1A1D23' }}
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl 
                      outline-none text-sm pr-12"
                    style={{ 
                      border: '1.5px solid #E2EAE7', 
                      color: '#1A1D23', 
                      backgroundColor: '#FAFBFC' 
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 
                      -translate-y-1/2 text-lg"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link 
                  href="/forgot-password"
                  className="text-sm font-medium"
                  style={{ color: '#0A7B5E' }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-semibold 
                  text-white text-sm transition-all"
                style={{ 
                  backgroundColor: loading 
                    ? '#7BBDAD' 
                    : '#0A7B5E',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Connexion...' : 'Se connecter →'}
              </button>
            </form>

            <p 
              className="text-center mt-6 text-sm"
              style={{ color: '#8A94A6' }}
            >
              Pas encore de compte ?{' '}
              <Link 
                href="/register"
                className="font-semibold"
                style={{ color: '#0A7B5E' }}
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
