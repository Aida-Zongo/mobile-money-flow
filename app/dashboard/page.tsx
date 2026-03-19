'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';
import { ArrowUp, ArrowDown, TrendingUp, CreditCard, ArrowRight, LogOut, User, Home, PieChart, Target, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }

    // Simuler des transactions
    const mockTransactions = [
      { id: 1, type: 'expense', label: 'Orange Money', amount: 5000, date: '2024-03-19', category: 'Mobile Money' },
      { id: 2, type: 'income', label: 'Salaire', amount: 150000, date: '2024-03-18', category: 'Revenu' },
      { id: 3, type: 'expense', label: 'Wave', amount: 12000, date: '2024-03-18', category: 'Mobile Money' },
      { id: 4, type: 'expense', label: 'Moov Money', amount: 8000, date: '2024-03-17', category: 'Mobile Money' },
      { id: 5, type: 'income', label: 'Transfert reçu', amount: 25000, date: '2024-03-17', category: 'Transfert' },
    ];
    setTransactions(mockTransactions);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    await logoutUser();
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#8A94A6',
    textDecoration: 'none',
  };

  const navItemActiveStyle = {
    ...navItemStyle,
    backgroundColor: '#E8F5F1',
    color: '#0A7B5E',
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        backgroundColor: '#F5F7F5',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '4px solid #E2EAE7',
          borderTop: '4px solid #0A7B5E',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'DM Sans, sans-serif',
      backgroundColor: '#F5F7F5',
    }}>
      {/* SIDEBAR */}
      <div style={{
        width: 280,
        backgroundColor: 'white',
        padding: 24,
        borderRight: '1px solid #E2EAE7',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 32,
        }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: 12,
            backgroundColor: '#0A7B5E',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800, color: 'white',
            fontSize: 15,
          }}>MF</div>
          <span style={{
            color: '#1A1D23', fontWeight: 700,
            fontSize: 20,
          }}>MoneyFlow</span>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={navItemActiveStyle}>
            <Home size={20} />
            <span>Tableau de bord</span>
          </div>
          <a href="/dashboard/transactions" style={navItemStyle}>
            <CreditCard size={20} />
            <span>Transactions</span>
          </a>
          <a href="/dashboard/budgets" style={navItemStyle}>
            <Target size={20} />
            <span>Budgets</span>
          </a>
          <a href="/dashboard/revenus" style={navItemStyle}>
            <TrendingUp size={20} />
            <span>Revenus</span>
          </a>
          <a href="/dashboard/stats" style={navItemStyle}>
            <PieChart size={20} />
            <span>Statistiques</span>
          </a>
        </nav>

        <div style={{ borderTop: '1px solid #E2EAE7', paddingTop: 16 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: '50%',
              backgroundColor: '#E8F5F1',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={18} color="#0A7B5E" />
            </div>
            <div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: '#1A1D23',
              }}>{user?.name || 'Utilisateur'}</div>
              <div style={{
                fontSize: 12, color: '#8A94A6',
              }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: 'transparent',
              color: '#F04438',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 800,
            color: '#1A1D23', marginBottom: 8,
          }}>
            Bonjour, {user?.name || 'Utilisateur'}
          </h1>
          <p style={{
            fontSize: 16, color: '#8A94A6',
          }}>
            Voici un aperçu de vos finances
          </p>
        </div>

        {/* HERO CARD */}
        <div style={{
          background: 'linear-gradient(135deg, #0A7B5E 0%, #16A34A 100%)',
          borderRadius: 24,
          padding: 32,
          marginBottom: 32,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: -50, right: -50,
            width: 200, height: 200,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.1)',
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontSize: 14, opacity: 0.8,
              marginBottom: 8,
            }}>Total dépensé ce mois</p>
            <h2 style={{
              fontSize: 48, fontWeight: 800,
              marginBottom: 16,
            }}>{totalExpense.toLocaleString()} FCFA</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <ArrowUp size={20} />
              <span style={{ fontSize: 14 }}>
                +12% par rapport au mois dernier
              </span>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 24,
          marginBottom: 32,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid #E2EAE7',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                backgroundColor: '#E8F5F1',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TrendingUp size={24} color="#0A7B5E" />
              </div>
              <span style={{
                fontSize: 12, color: '#16A34A',
                fontWeight: 600,
              }}>+8.2%</span>
            </div>
            <h3 style={{
              fontSize: 24, fontWeight: 800,
              color: '#1A1D23', marginBottom: 4,
            }}>{totalIncome.toLocaleString()}</h3>
            <p style={{ fontSize: 14, color: '#8A94A6' }}>
              Revenus totaux
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid #E2EAE7',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                backgroundColor: '#FEF2F2',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ArrowDown size={24} color="#F04438" />
              </div>
              <span style={{
                fontSize: 12, color: '#F04438',
                fontWeight: 600,
              }}>+12.5%</span>
            </div>
            <h3 style={{
              fontSize: 24, fontWeight: 800,
              color: '#1A1D23', marginBottom: 4,
            }}>{totalExpense.toLocaleString()}</h3>
            <p style={{ fontSize: 14, color: '#8A94A6' }}>
              Dépenses totales
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            border: '1px solid #E2EAE7',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                backgroundColor: '#F0F9FF',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Wallet size={24} color="#0A7B5E" />
              </div>
              <span style={{
                fontSize: 12, color: '#16A34A',
                fontWeight: 600,
              }}>Solde</span>
            </div>
            <h3 style={{
              fontSize: 24, fontWeight: 800,
              color: '#1A1D23', marginBottom: 4,
            }}>{balance.toLocaleString()}</h3>
            <p style={{ fontSize: 14, color: '#8A94A6' }}>
              Solde actuel
            </p>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #E2EAE7',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            <h3 style={{
              fontSize: 18, fontWeight: 700,
              color: '#1A1D23',
            }}>Transactions récentes</h3>
            <a href="/dashboard/transactions" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#0A7B5E',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
            }}>
              Voir tout
              <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid #F5F7F5',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: 12,
                    backgroundColor: transaction.type === 'income' ? '#E8F5F1' : '#FEF2F2',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {transaction.type === 'income' ? 
                      <ArrowDown size={20} color="#16A34A" /> :
                      <ArrowUp size={20} color="#F04438" />
                    }
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: 600,
                      color: '#1A1D23', marginBottom: 2,
                    }}>{transaction.label}</div>
                    <div style={{
                      fontSize: 12, color: '#8A94A6',
                    }}>{transaction.category} • {transaction.date}</div>
                  </div>
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 700,
                  color: transaction.type === 'income' ? '#16A34A' : '#F04438',
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} FCFA
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
