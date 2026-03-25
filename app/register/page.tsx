'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  // const { register } = useUser();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [operator, setOperator] = useState('orange');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Remplissez tous les champs');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mots de passe différents');
      return;
    }
    if (password.length < 6) {
      setError('Mot de passe trop court');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(
        name.trim(), email.trim(), password,
        phone?.trim(), operator
      );
      window.location.href = '/onboarding';
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Erreur inscription');
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

  const operators = [
    { id: 'orange', label: 'Orange Money' },
    { id: 'wave', label: 'Wave' },
    { id: 'moov', label: 'Moov Money' },
    { id: 'other', label: 'Autre' }
  ];

  return (
    <div className="auth-grid" style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'DM Sans, sans-serif',
      backgroundColor: '#F5F7F5',
    }}>
      {/* LEFT */}
      <div 
        className="hidden lg:flex"
        style={{
          width: '45%',
          backgroundColor: '#0A7B5E',
          padding: 48,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 12,
            backgroundColor: 'white',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800, color: '#0A7B5E',
            fontSize: 15,
          }}>MF</div>
          <span style={{
            color: 'white', fontWeight: 700,
            fontSize: 20,
          }}>MoneyFlow</span>
        </div>
        <div>
          <h1 style={{
            color: 'white', fontSize: 36,
            fontWeight: 800, lineHeight: 1.2,
            marginBottom: 16,
          }}>
            Rejoignez<br />MoneyFlow.
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 15, lineHeight: 1.6,
          }}>
            Créez votre compte en quelques secondes
            et commencez à suivre vos finances
            Mobile Money dès aujourd'hui.
          </p>
          <div style={{
            display: 'flex', gap: 10,
            marginTop: 24, flexWrap: 'wrap',
          }}>
            {['Orange Money', 'Wave', 'Moov Money']
              .map(op => (
                <span key={op} style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                  padding: '6px 14px', borderRadius: 50,
                  fontSize: 13,
                }}>{op}</span>
              ))}
          </div>
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.5)', fontSize: 13,
        }}>
          2026 MoneyFlow — Burkina Faso
        </p>
      </div>

      {/* RIGHT */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 24, padding: 32,
            boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
          }}>
            <h2 style={{
              fontSize: 24, fontWeight: 800,
              color: '#1A1D23', marginBottom: 4,
            }}>
              Créer un compte
            </h2>
            <p style={{
              color: '#8A94A6', fontSize: 14,
              marginBottom: 24,
            }}>
              Rejoignez MoneyFlow gratuitement
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
                }}>Nom complet</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Votre nom"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+226 XX XX XX XX"
                  style={inputStyle}
                />
              </div>

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

              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>Opérateur Mobile Money</label>
                <div style={{
                  display: 'flex', gap: 8,
                  flexWrap: 'wrap',
                }}>
                  {operators.map(op => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setOperator(op.id)}
                      style={{
                        padding: '8px 16px',
                        border: '1.5px solid',
                        borderColor: operator === op.id ? '#0A7B5E' : '#E2EAE7',
                        backgroundColor: operator === op.id ? '#0A7B5E' : 'white',
                        color: operator === op.id ? 'white' : '#1A1D23',
                        borderRadius: 50,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
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
                  ? 'Création...'
                  : 'Créer mon compte'}
              </button>
            </form>

            <p style={{
              textAlign: 'center', marginTop: 20,
              fontSize: 14, color: '#8A94A6',
            }}>
              Déjà un compte ?{' '}
              <span
                onClick={() => router.push('/login')}
                style={{
                  color: '#0A7B5E', fontWeight: 600,
                  cursor: 'pointer',
                }}>
                Se connecter
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
