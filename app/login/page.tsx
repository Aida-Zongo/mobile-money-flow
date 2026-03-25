'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  // const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Remplissez tous les champs');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await loginUser(email.trim(), password);
      
      console.log('=== LOGIN DEBUG ===');
      console.log('result:', result);
      console.log('token:', result?.token);
      console.log('user:', result?.user);
      console.log('localStorage token:',
        localStorage.getItem('token'));
      console.log('===================');

      window.location.href = '/dashboard';
    } catch (err: any) {
      setLoading(false);
      setError(
        err.message || 'Email ou mot de passe incorrect'
      );
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #E2EAE7',
    borderRadius: 10,
    fontSize: 14,
    outline: 'none',
    backgroundColor: '#FAFBFC',
    color: '#1A1D23',
    fontFamily: 'DM Sans, sans-serif',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'DM Sans, sans-serif',
      backgroundColor: 'white',
    }}>
      {/* GAUCHE (background image) */}
      <div style={{
        flex: 1,
        position: 'relative',
        background:
          'linear-gradient(135deg, #0A7B5E, #054d36)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '100vh',
      }} className="hidden lg:flex">

        {/* Image Ouagadougou / BF */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
        }} />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,123,94,0.7), rgba(5,77,54,0.9))',
        }} />

        {/* Pattern africain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Contenu gauche */}
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', padding: 40,
          color: 'white',
        }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: 20,
            backgroundColor: 'white',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 24, fontWeight: 800,
            color: '#0A7B5E',
          }}>
            MF
          </div>
          <h1 style={{
            fontSize: 32, fontWeight: 800,
            marginBottom: 12, color: 'white',
          }}>
            MoneyFlow
          </h1>
          <p style={{
            fontSize: 16, opacity: 0.85,
            lineHeight: 1.6, maxWidth: 300,
            margin: '0 auto 32px',
            color: 'white',
          }}>
            Gérez vos finances Mobile Money<br />
            au Burkina Faso
          </p>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: 24,
            justifyContent: 'center',
          }}>
            {[
              { val: '3', label: 'Opérateurs' },
              { val: '100%', label: 'Sécurisé' },
              { val: '24/7', label: 'Disponible' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: 22, fontWeight: 800,
                  color: '#F5A623',
                }}>{s.val}</div>
                <div style={{
                  fontSize: 12, opacity: 0.75,
                  color: 'white',
                }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Drapeau BF */}
          <div style={{
            marginTop: 40, fontSize: 13,
            opacity: 0.6, color: 'white',
          }}>
            🇧🇫 Fait au Burkina Faso
          </div>
        </div>
      </div>

      {/* DROITE (formulaire blanc) */}
      <div style={{
        flex: 1,
        maxWidth: '100%',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '32px 24px',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{
            fontSize: 24, fontWeight: 800,
            color: '#1A1D23', marginBottom: 4,
          }}>
            Bon retour
          </h2>
          <p style={{
            color: '#8A94A6', fontSize: 14,
            marginBottom: 24,
          }}>
            Connectez-vous à votre compte
          </p>

          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              color: '#F04438',
              padding: '12px 16px',
              borderRadius: 12, fontSize: 14,
              marginBottom: 16,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1A1D23',
                marginBottom: 6,
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500, color: '#1A1D23',
                marginBottom: 6,
              }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e =>
                    setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    ...inputStyle,
                    paddingRight: 44,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8A94A6',
                    display: 'flex',
                  }}>
                  {showPwd
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{
              textAlign: 'right', marginBottom: 20,
            }}>
              <span
                onClick={() => router.push('/forgot-password')}
                style={{
                  color: '#0A7B5E', fontSize: 13,
                  fontWeight: 500, cursor: 'pointer',
                }}>
                Mot de passe oublié ?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                backgroundColor: loading
                  ? '#7BBDAD' : '#0A7B5E',
                color: 'white', border: 'none',
                borderRadius: 50, fontSize: 15,
                fontWeight: 600,
                cursor: loading
                  ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none'
                  : '0 4px 14px rgba(10,123,94,0.35)',
                fontFamily: 'DM Sans, sans-serif',
              }}>
              {loading
                ? 'Connexion...'
                : 'Se connecter'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: 24,
            fontSize: 14, color: '#8A94A6',
          }}>
            Pas encore de compte ?{' '}
            <span
              onClick={() => router.push('/register')}
              style={{
                color: '#0A7B5E', fontWeight: 600,
                cursor: 'pointer',
              }}>
              Créer un compte
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
