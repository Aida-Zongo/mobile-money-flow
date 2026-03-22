'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  Briefcase, Laptop, ShoppingCart,
  Users, DollarSign, ArrowRight
} from 'lucide-react';

const SOURCES = [
  { id:'salaire', label:'Salaire',
    icon: Briefcase, color:'#16A34A' },
  { id:'freelance', label:'Freelance',
    icon: Laptop, color:'#0A7B5E' },
  { id:'commerce', label:'Commerce',
    icon: ShoppingCart, color:'#F5A623' },
  { id:'famille', label:'Famille',
    icon: Users, color:'#8B5CF6' },
  { id:'autre', label:'Autre',
    icon: DollarSign, color:'#8A94A6' },
];

const MONTHS = ['Janvier','Février','Mars',
  'Avril','Mai','Juin','Juillet','Août',
  'Septembre','Octobre','Novembre','Décembre'];

export default function OnboardingPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [source, setSource] =
    useState('salaire');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [ready, setReady] = useState(false);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const token = localStorage.getItem('token');
      const raw = localStorage.getItem('user');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      if (raw) {
        try {
          const u = JSON.parse(raw);
          setUserName(u.name?.split(' ')[0] || '');
        } catch(e) {}
      }

      // Vérifie si l'utilisateur a déjà
      // des revenus dans la base
      try {
        const now = new Date();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL
            || 'http://localhost:5001/api'
          }/incomes?month=${
            now.getMonth() + 1
          }&year=${now.getFullYear()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.ok) {
          const data = await res.json();
          const hasIncomes =
            (data.incomes?.length || 0) > 0 ||
            (data.total || 0) > 0;

          if (hasIncomes) {
            // A déjà des revenus → dashboard
            console.log(
              'Revenus existants → dashboard'
            );
            window.location.href = '/dashboard';
            return;
          }
        }
      } catch(e) {
        // Erreur réseau → laisse passer
        console.warn('Check incomes failed:', e);
      }

      // Nouveau compte sans revenus
      // → reste sur onboarding
      setReady(true);
    };

    checkAndRedirect();
  }, []);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Entrez un montant valide');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/incomes', {
        amount: Number(amount),
        source, month, year,
        note: note || `Revenu ${MONTHS[month-1]} ${year}`,
      });
      window.location.href = '/dashboard';
    } catch(e: any) {
      setError('Erreur: ' + e.message);
      setSaving(false);
    }
  };

  const skip = () => {
    window.location.href = '/dashboard';
  };

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F5F7F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: '3px solid #E8F5F1',
            borderTopColor: '#0A7B5E',
            margin: '0 auto 12px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{
            color: '#8A94A6', fontSize: 14,
          }}>
            Vérification...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7F5',
      fontFamily: 'DM Sans, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24, padding: 40,
        maxWidth: 500, width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10, marginBottom: 32,
        }}>
          <div style={{
            width: 44, height: 44,
            borderRadius: 14,
            backgroundColor: '#0A7B5E',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800, color: 'white',
            fontSize: 16,
          }}>MF</div>
          <span style={{
            fontWeight: 700, fontSize: 20,
            color: '#1A1D23',
          }}>MoneyFlow</span>
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 800,
          color: '#1A1D23', marginBottom: 8,
        }}>
          Bienvenue{userName
            ? `, ${userName}` : ''} !
        </h1>
        <p style={{
          color: '#8A94A6', fontSize: 15,
          marginBottom: 32, lineHeight: 1.6,
        }}>
          Avant de commencer, entrez votre
          revenu de ce mois pour que MoneyFlow
          puisse gérer votre budget.
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

        {/* Montant */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1A1D23',
            marginBottom: 8,
          }}>
            Votre revenu ce mois
            ({MONTHS[month-1]} {year})
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={amount}
              onChange={e =>
                setAmount(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 40, fontWeight: 800,
                padding: '18px 70px 18px 20px',
                border: '2px solid #E2EAE7',
                borderRadius: 16, outline: 'none',
                color: '#1A1D23',
                fontFamily: 'DM Sans, sans-serif',
                boxSizing: 'border-box',
              }}
            />
            <span style={{
              position: 'absolute',
              right: 14, bottom: 14,
              color: '#8A94A6', fontSize: 13,
              fontWeight: 600,
            }}>FCFA</span>
          </div>
        </div>

        {/* Source */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1A1D23',
            marginBottom: 10,
          }}>
            Source du revenu
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap: 8,
          }}>
            {SOURCES.map(src => {
              const Icon = src.icon;
              const sel = source === src.id;
              return (
                <button key={src.id}
                  type="button"
                  onClick={() =>
                    setSource(src.id)}
                  style={{
                    padding: '10px 4px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: sel
                      ? '2px solid #16A34A'
                      : '2px solid transparent',
                    backgroundColor: sel
                      ? '#F0FDF4' : '#F5F7F5',
                    fontFamily:
                      'DM Sans, sans-serif',
                  }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}>
                    <Icon size={20}
                      color={sel
                        ? '#16A34A'
                        : src.color} />
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 500,
                    color: sel
                      ? '#16A34A' : src.color,
                  }}>
                    {src.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div style={{ marginBottom: 28 }}>
          <label style={{
            display: 'block', fontSize: 13,
            fontWeight: 500, color: '#1A1D23',
            marginBottom: 6,
          }}>
            Note (optionnel)
          </label>
          <input type="text" value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Ex: Salaire Mars 2026"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1.5px solid #E2EAE7',
              borderRadius: 10, fontSize: 14,
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              color: '#1A1D23',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Boutons */}
        <button onClick={handleSubmit}
          disabled={saving}
          style={{
            width: '100%', padding: '14px',
            backgroundColor: saving
              ? '#86EFAC' : '#16A34A',
            color: 'white', border: 'none',
            borderRadius: 50, fontSize: 15,
            fontWeight: 600, cursor: saving
              ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow: saving ? 'none'
              : '0 4px 14px rgba(22,163,74,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', gap: 8,
            marginBottom: 12,
          }}>
          {saving ? 'Enregistrement...' : (
            <>
              Commencer avec ce revenu
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <button onClick={skip} style={{
          width: '100%', padding: '13px',
          backgroundColor: 'transparent',
          color: '#8A94A6',
          border: '1.5px solid #E2EAE7',
          borderRadius: 50, fontSize: 14,
          cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          marginTop: 4,
          transition: 'all 0.2s',
        }}>
          Passer et accéder au tableau de bord →
        </button>
      </div>
    </div>
  );
}
