'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setError('Veuillez remplir tous les champs');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      
      // Simulation de register pour les tests
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('user', JSON.stringify({ 
          name: name, 
          email: email 
        }));
        
        // Notification de bienvenue
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            alert(`🎉 Bienvenue ${name} !\n\nVotre compte MoneyFlow a été créé avec succès.`);
          }, 500);
        }
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError('Erreur d\'inscription: ' + err.message);
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
            <span className="text-3xl">🚀</span>
          </div>
          <h1 
            className="text-white text-4xl font-bold 
              leading-tight mb-4"
          >
            Rejoignez-nous<br />dès aujourd'hui.
          </h1>
          <p 
            style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: 16, 
              lineHeight: 1.6 
            }}
          >
            Créez votre compte et commencez à suivre 
            vos finances Mobile Money gratuitement.
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
              Créer un compte 🎉
            </h2>
            <p 
              className="mb-8 text-sm"
              style={{ color: '#8A94A6' }}
            >
              Rejoignez MoneyFlow gratuitement
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

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#1A1D23' }}
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
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

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#1A1D23' }}
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 
                      -translate-y-1/2 text-lg"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
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
                {loading ? 'Inscription...' : 'Créer un compte →'}
              </button>
            </form>

            <p 
              className="text-center mt-6 text-sm"
              style={{ color: '#8A94A6' }}
            >
              Déjà un compte ?{' '}
              <Link 
                href="/login"
                className="font-semibold"
                style={{ color: '#0A7B5E' }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
