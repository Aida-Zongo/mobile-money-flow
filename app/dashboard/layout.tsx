'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home, TrendingDown, Target,
  DollarSign, BarChart3, LogOut,
  User, Settings, Bell, HelpCircle
} from 'lucide-react';
import { t } from '@/lib/i18n';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    if (raw) {
      try { setUser(JSON.parse(raw)); }
      catch(e) {}
    }
    setReady(true);

    loadNotifications(token);
    const interval = setInterval(() => {
      loadNotifications(token);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/notifications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const unread = (data.notifications || []).filter((n: any) => !n.isRead);
        setNotifCount(unread.length);
        setNotifs(data.notifications || []);
      }
    } catch(e) {}
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/auth/notifications/read`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifCount(0);
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch(e) {}
  };

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            borderRadius: '50%',
            border: '3px solid var(--primary-light)',
            borderTopColor: 'var(--primary)',
            margin: '0 auto 12px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: t('nav.home'), icon: Home, path: '/dashboard' },
    { label: t('nav.transactions'), icon: TrendingDown, path: '/dashboard/transactions' },
    { label: t('nav.budgets'), icon: Target, path: '/dashboard/budgets' },
    { label: t('nav.incomes'), icon: DollarSign, path: '/dashboard/revenus' },
    { label: t('nav.stats'), icon: BarChart3, path: '/dashboard/stats' },
  ];

  const bottomLinks = [
    { label: t('nav.profile'), icon: User, path: '/dashboard/profil' },
    { label: t('nav.settings'), icon: Settings, path: '/dashboard/parametres' },
    { label: 'Aide', icon: HelpCircle, path: '/dashboard/aide' },
  ];

  const isActive = (path: string) =>
    pathname === path ||
    (path !== '/dashboard' && pathname?.startsWith(path));

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
      fontFamily: 'DM Sans, sans-serif',
    }} className="dashboard-root">
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .sidebar { 
            display: none !important; 
            width: 0 !important;
            flex: 0 !important;
          }
          .bottom-nav { display: flex !important; }
        }
      `}} />

      {/* ===== SIDEBAR FIXE ===== */}
      <aside 
        className="sidebar flex-col"
        style={{
          width: 260,
          flexShrink: 0,
          background:
            'linear-gradient(180deg, #ffffff 0%, #fafcfb 100%)',
          borderRight: '1px solid #E2EAE7',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflow: 'hidden',
        }}>

        {/* Accent ligne verte en haut */}
        <div style={{
          height: 3,
          background:
            'linear-gradient(90deg, #0A7B5E, #F5A623)',
        }} />

        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center',
              gap: 10, cursor: 'pointer',
            }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: 12,
              backgroundColor: 'var(--primary)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800, color: 'white',
              fontSize: 14,
            }}>MF</div>
            <span style={{
              fontWeight: 700, fontSize: 17,
              color: 'var(--text-main)',
            }}>MoneyFlow (v3)</span>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (!showNotifs && notifCount > 0) {
                  markAllRead();
                }
              }}
              style={{
                width: 36, height: 36,
                borderRadius: 10, border: 'none',
                backgroundColor: 'var(--bg)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
              <Bell size={18}
                color={notifCount > 0
                  ? '#F5A623' : 'var(--text-muted)'} />
              {notifCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -2, right: -2,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#F04438',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  color: 'white',
                }}>
                  {notifCount > 9 ? '9+' : notifCount}
                </div>
              )}
            </button>

            {/* Dropdown notifications */}
            {showNotifs && (
              <>
                <div
                  onClick={() => setShowNotifs(false)}
                  style={{
                    position: 'fixed', inset: 0,
                    zIndex: 40,
                  }} />
                <div style={{
                  position: 'absolute',
                  top: 44, left: 10,
                  width: 320, zIndex: 50,
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  boxShadow:
                    '0 8px 32px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <p style={{
                      fontWeight: 700, fontSize: 14,
                      color: 'var(--text-main)', margin: 0,
                    }}>
                      Notifications
                    </p>
                    {notifCount > 0 && (
                      <span style={{
                        backgroundColor: '#F04438',
                        color: 'white', fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 50,
                      }}>
                        {notifCount} non lues
                      </span>
                    )}
                  </div>

                  <div style={{
                    maxHeight: 300, overflowY: 'auto',
                  }}>
                    {notifs.length === 0 ? (
                      <div style={{
                        padding: 32, textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: 14,
                      }}>
                        Aucune notification
                      </div>
                    ) : notifs.slice(0, 10).map(
                      (n: any, i: number) => (
                      <div key={i} style={{
                        padding: '12px 16px',
                        borderBottom:
                          '1px solid var(--border)',
                        backgroundColor: !n.isRead
                          ? (n.type === 'danger'
                            ? 'rgba(240,68,56,0.05)'
                            : 'rgba(245,166,35,0.05)')
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                      }}>
                        <div style={{
                          width: 32, height: 32,
                          borderRadius: 8, flexShrink: 0,
                          backgroundColor:
                            n.type === 'danger'
                              ? '#FEF2F2' : '#FFFBEB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 16,
                        }}>
                          {n.type === 'danger'
                            ? '🔴' : '🟡'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: 13,
                            fontWeight: !n.isRead ? 600 : 400,
                            color: 'var(--text-main)',
                            margin: 0,
                          }}>
                            {n.message}
                          </p>
                          <p style={{
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            margin: '2px 0 0',
                          }}>
                            {new Date(n.createdAt)
                              .toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {notifs.length > 0 && (
                    <div style={{
                      padding: '10px 16px',
                      textAlign: 'center',
                      borderTop: '1px solid var(--border)',
                    }}>
                      <button
                        onClick={() => {
                          markAllRead();
                          setShowNotifs(false);
                        }}
                        style={{
                          background: 'none', border: 'none',
                          color: '#0A7B5E', fontSize: 13,
                          fontWeight: 600, cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                        }}>
                        Tout marquer comme lu
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation principale */}
        <nav style={{
          flex: 1, padding: '12px 12px', overflowY: 'auto',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '8px 8px 4px', margin: 0,
          }}>
            Menu principal
          </p>

          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                style={{
                  width: '100%', display: 'flex',
                  alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  border: 'none', cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  marginBottom: 2, textAlign: 'left',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: active ? 'var(--primary)' : 'var(--bg)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={active ? 'white' : 'var(--text-muted)'} />
                </div>
                {link.label}
              </button>
            );
          })}

          <div style={{
            margin: '16px 0 8px', borderTop: '1px solid var(--border)',
            paddingTop: 12,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 8px 4px', margin: 0,
            }}>
              Compte
            </p>

            {bottomLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  style={{
                    width: '100%', display: 'flex',
                    alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 12,
                    border: 'none', cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    marginBottom: 2, textAlign: 'left',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    backgroundColor: active ? 'var(--primary)' : 'var(--bg)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color={active ? 'white' : 'var(--text-muted)'} />
                  </div>
                  {link.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info + Déconnexion */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 10, marginBottom: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: 'var(--primary)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              {getInitials(user?.name || '')}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{
                fontWeight: 600, fontSize: 13,
                color: 'var(--text-main)', margin: 0,
                whiteSpace: 'nowrap', overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.name || 'Utilisateur'}
              </p>
              <p style={{
                fontSize: 11, color: 'var(--text-muted)',
                margin: 0, whiteSpace: 'nowrap',
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
            padding: '8px 12px', borderRadius: 10, border: 'none',
            backgroundColor: '#FEF2F2', color: '#F04438',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif',
          }}>
            <LogOut size={14} />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* ===== CONTENU SCROLLABLE ===== */}
      <main style={{
        flex: 1, overflowY: 'auto',
        height: '100vh', backgroundColor: 'var(--bg)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', 
          padding: '24px clamp(16px, 4vw, 28px)',
        }}>
          {children}
        </div>

        {/* BOTTOM NAV (Mobile Only) */}
        <nav 
          className="lg:hidden"
          style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            height: 64, backgroundColor: 'white',
            borderTop: '1px solid #E2EAE7',
            display: 'flex', justifyContent: 'space-around',
            alignItems: 'center', zIndex: 100,
            padding: '0 10px',
          }}>
          {[
            { icon: Home, path: '/dashboard' },
            { icon: TrendingDown, path: '/dashboard/transactions' },
            { icon: Target, path: '/dashboard/budgets' },
            { icon: BarChart3, path: '/dashboard/stats' },
            { icon: User, path: '/dashboard/profil' },
          ].map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <button 
                key={link.path}
                onClick={() => router.push(link.path)}
                style={{
                  background: 'none', border: 'none',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4,
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer', flex: 1,
                }}>
                <Icon size={22} />
              </button>
            )
          })}
        </nav>
      </main>
    </div>
  );
}
