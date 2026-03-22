'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { t } from '@/lib/i18n';
import {
  TrendingDown, CreditCard, Target,
  Calendar, ShoppingBag, Car, Heart,
  ShoppingCart, Home, Smartphone,
  BookOpen, Package
} from 'lucide-react';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n || 0)
  + ' FCFA';

const getCategoryIcon = (category: string) => {
  const icons: Record<string, any> = {
    alimentation: {
      icon: ShoppingBag,
      color: '#D97706', bg: '#FEF3E2'
    },
    transport: {
      icon: Car,
      color: '#0A7B5E', bg: '#E8F5F1'
    },
    sante: {
      icon: Heart,
      color: '#16A34A', bg: '#F0FDF4'
    },
    shopping: {
      icon: ShoppingCart,
      color: '#DB2777', bg: '#FDF2F8'
    },
    logement: {
      icon: Home,
      color: '#2563EB', bg: '#EFF6FF'
    },
    telecom: {
      icon: Smartphone,
      color: '#0369A1', bg: '#F0F9FF'
    },
    education: {
      icon: BookOpen,
      color: '#CA8A04', bg: '#FEFCE8'
    },
    autre: {
      icon: Package,
      color: '#6B7280', bg: 'var(--bg-hover)'
    },
  };
  return icons[category] || icons.autre;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] =
    useState<any>(null);
  const [expenses, setExpenses] =
    useState<any[]>([]);
  const [incomes, setIncomes] =
    useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const monthName = now.toLocaleDateString(
    'fr-FR', { month: 'long', year: 'numeric' }
  );

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try { setUser(JSON.parse(raw)); }
      catch(e) {}
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e, inc] = await Promise.all([
        api.get(
          `/stats/summary?month=${month}&year=${year}`
        ),
        api.get(
          `/expenses?month=${month}&year=${year}&limit=5`
        ),
        api.get(
          `/incomes?month=${month}&year=${year}`
        ),
      ]);
      setSummary(s.data);
      setExpenses(e.data.expenses || []);
      setIncomes(inc.data.incomes || []);
    } catch(err) {
      console.error('Dashboard error:', err);
    }
    setLoading(false);
  };

  const totalIncomes = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = summary?.totalMonth || 0;
  const solde = totalIncomes - totalExpenses;

  return (
    <div style={{
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 800,
          color: 'var(--text-main)', margin: 0,
        }}>
          {t('dashboard.greeting')}, {user?.name?.split(' ')[0]
            || 'Utilisateur'}
        </h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: 14,
          marginTop: 4,
        }}>
          {t('dashboard.subtitle')} — {monthName}
        </p>
      </div>

      {/* Hero Card */}
      <div style={{
        background:
          'linear-gradient(135deg, #0A7B5E, #0D9B76)',
        borderRadius: 24, padding: 28,
        marginBottom: 20, position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40,
          right: -40, width: 200, height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }} />
        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 13, margin: '0 0 6px',
        }}>
          Solde actuel
        </p>
        <p style={{
          fontSize: 42, fontWeight: 900,
          color: 'white', margin: '0 0 20px',
        }}>
          {loading ? '...'
            : fmt(solde)}
        </p>
        <div style={{
          display: 'flex', gap: 24,
        }}>
          {[
            { label: 'Revenus',
              val: fmt(totalIncomes) },
            { label: 'Dépenses',
              val: fmt(totalExpenses) },
            { label: 'Transactions',
              val: summary?.totalCount || 0 },
          ].map((s, i) => (
            <div key={i} style={{
              paddingRight: 16,
              borderRight: i < 2
                ? '1px solid rgba(255,255,255,0.2)'
                : 'none',
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 11, margin: '0 0 2px',
              }}>
                {s.label}
              </p>
              <p style={{
                color: 'white', fontWeight: 700,
                fontSize: 15, margin: 0,
              }}>
                {loading ? '...' : String(s.val)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16, marginBottom: 20,
      }}>
        {[
          {
            icon: CreditCard, label: 'Transactions',
            val: loading ? '...'
              : String(summary?.totalCount || 0),
            border: '#0A7B5E', bg: '#E8F5F1',
            color: '#0A7B5E',
          },
          {
            icon: Target, label: 'Budget utilisé',
            val: loading ? '...'
              : (summary?.budgetUsedPercent || 0)
                + '%',
            border: '#F5A623', bg: '#FEF3DC',
            color: '#F5A623',
          },
          {
            icon: Calendar, label: 'Moy. par jour',
            val: loading ? '...'
              : fmt(Math.round(
                  (summary?.totalMonth || 0) /
                  now.getDate()
                )),
            border: '#16A34A', bg: '#F0FDF4',
            color: '#16A34A',
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 16, padding: 20,
              borderLeft: `4px solid ${s.border}`,
              boxShadow:
                '0 1px 8px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10, marginBottom: 12,
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  backgroundColor: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18}
                    color={s.color} />
                </div>
                <span style={{
                  fontSize: 13, color: 'var(--text-muted)',
                  fontWeight: 500,
                }}>
                  {s.label}
                </span>
              </div>
              <p style={{
                fontSize: 26, fontWeight: 800,
                color: 'var(--text-main)', margin: 0,
              }}>
                {s.val}
              </p>
            </div>
          );
        })}
      </div>

      {/* Transactions récentes */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{
            fontSize: 16, fontWeight: 700,
            color: 'var(--text-main)', margin: 0,
          }}>
            {t('dashboard.recent')}
          </h3>
          <button
            onClick={() => router.push(
              '/dashboard/transactions')}
            style={{
              background: 'none', border: 'none',
              color: '#0A7B5E', fontSize: 13,
              fontWeight: 600, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
            {t('dashboard.viewAll')} →
          </button>
        </div>

        {loading ? (
          <div style={{
            padding: 40, textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            Chargement...
          </div>
        ) : expenses.length === 0 ? (
          <div style={{
            padding: 48, textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: '50%',
              backgroundColor: '#E8F5F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <TrendingDown size={24}
                color="#0A7B5E" />
            </div>
            <p style={{
              color: 'var(--text-muted)', fontSize: 14,
              marginBottom: 14,
            }}>
              {t('dashboard.noExpense')}
            </p>
            <button
              onClick={() => router.push(
                '/dashboard/transactions')}
              style={{
                backgroundColor: '#0A7B5E',
                color: 'white', border: 'none',
                borderRadius: 50,
                padding: '10px 20px', fontSize: 13,
                fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}>
              Ajouter une dépense
            </button>
          </div>
        ) : (
          expenses.map((exp, i) => {
            const catInfo = getCategoryIcon(
              exp.category
            );
            const CatIcon = catInfo.icon;
            return (
              <div key={exp.id || exp._id || i}
                style={{
                  display: 'flex',
                  alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  borderBottom:
                    i < expenses.length - 1
                      ? '1px solid var(--border)'
                      : 'none',
                }}>
                <div style={{
                  width: 42, height: 42,
                  borderRadius: 12,
                  backgroundColor: catInfo.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CatIcon size={18}
                    color={catInfo.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontWeight: 600, fontSize: 14,
                    color: 'var(--text-main)', margin: 0,
                  }}>
                    {exp.description
                      || exp.category}
                  </p>
                  <p style={{
                    color: 'var(--text-muted)', fontSize: 12,
                    margin: '2px 0 0',
                  }}>
                    {new Date(exp.date)
                      .toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                  </p>
                </div>
                <p style={{
                  fontWeight: 700,
                  color: '#F04438', fontSize: 14,
                  margin: 0,
                }}>
                  -{fmt(exp.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
