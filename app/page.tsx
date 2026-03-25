'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Target, Bell, Smartphone,
  Lock, TrendingUp, Star, ArrowRight,
  Check, ChevronRight, Shield, Users,
  Zap, Award
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [realReviews, setRealReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 248, avgRating: 4.9 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
    const handleScroll = () =>
      setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch avis dynamiques
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reviews) {
            setRealReviews(data.reviews.slice(0, 3));
            if (data.total > 0) {
              setStats({ total: data.total, avgRating: data.avgRating });
            }
          }
        }
      } catch (err) {
        console.error('Erreur fetch avis', err);
      }
    };
    fetchReviews();

    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  const scroll = (id: string) => {
    document.getElementById(id)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const ratingLabels: Record<number, string> = {
    1: 'Mauvais',
    2: 'Passable',
    3: 'Bien',
    4: 'Très bien',
    5: 'Excellent !',
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Statistiques en temps réel',
      desc: 'Visualisez vos habitudes de dépenses avec des graphiques clairs et intuitifs.',
      featured: false,
      color: '#0A7B5E',
      bg: '#E8F5F1',
    },
    {
      icon: Target,
      title: 'Budgets intelligents',
      desc: 'Définissez des limites par catégorie et recevez des alertes avant dépassement.',
      featured: true,
      color: 'white',
      bg: 'rgba(255,255,255,0.2)',
    },
    {
      icon: Bell,
      title: 'Alertes automatiques',
      desc: 'Notifications instantanées quand vous approchez de vos limites budgétaires.',
      featured: false,
      color: '#F5A623',
      bg: '#FEF3DC',
    },
    {
      icon: Smartphone,
      title: 'Mobile Money intégré',
      desc: 'Compatible Orange Money, Wave, Moov Money et espèces. Tout centralisé.',
      featured: false,
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      icon: Lock,
      title: 'Sécurité maximale',
      desc: "Vos données sont chiffrées de bout en bout et protégées selon les normes de l'industrie.",
      featured: false,
      color: '#16A34A',
      bg: '#F0FDF4',
    },
    {
      icon: TrendingUp,
      title: 'Rapports mensuels',
      desc: 'Exportez vos données et analysez votre évolution financière.',
      featured: false,
      color: '#0369A1',
      bg: '#F0F9FF',
    },
  ];

  const testimonials = [
    {
      name: 'Amadou Ouédraogo',
      role: 'Commerçant, Ouagadougou',
      text: 'Depuis que j\'utilise MoneyFlow, j\'ai économisé plus de 45 000 FCFA en 3 mois. Les alertes budget sont vraiment efficaces !',
      initials: 'AO',
      avatarBg: '#0A7B5E',
      featured: false,
    },
    {
      name: 'Fatoumata Traoré',
      role: 'Étudiante, Bobo-Dioulasso',
      text: 'L\'application la plus simple pour gérer mon argent Wave. Je recommande à tous mes amis sans hésitation !',
      initials: 'FT',
      avatarBg: '#F5A623',
      featured: true,
    },
    {
      name: 'Ibrahim Sawadogo',
      role: 'Entrepreneur, Koudougou',
      text: 'Enfin une app qui comprend notre contexte ! Orange Money, Wave, Moov... tout est là. Design magnifique en plus.',
      initials: 'IS',
      avatarBg: '#16A34A',
      featured: false,
    },
  ];

  const S = {
    page: {
      fontFamily: 'DM Sans, sans-serif',
      backgroundColor: 'white',
      color: '#1A1D23',
    } as React.CSSProperties,

    nav: {
      position: 'fixed' as const,
      top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: scrolled
        ? 'rgba(255,255,255,0.95)' : 'white',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: '1px solid #E2EAE7',
      boxShadow: scrolled
        ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.3s',
    } as React.CSSProperties,

    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 32px',
    } as React.CSSProperties,

    btnPrimary: {
      backgroundColor: '#0A7B5E',
      color: 'white', border: 'none',
      borderRadius: 50, fontWeight: 600,
      cursor: 'pointer', fontSize: 15,
      padding: '12px 28px',
      fontFamily: 'DM Sans, sans-serif',
      boxShadow: '0 4px 20px rgba(10,123,94,0.35)',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center', gap: 6,
    } as React.CSSProperties,

    btnOutline: {
      backgroundColor: 'white',
      color: '#1A1D23',
      border: '2px solid #E2EAE7',
      borderRadius: 50, fontWeight: 600,
      cursor: 'pointer', fontSize: 15,
      padding: '12px 28px',
      fontFamily: 'DM Sans, sans-serif',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center', gap: 6,
    } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .nav-links { display: none !important; }
          .hidden-mobile { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* ===== NAVBAR ===== */}
      <nav style={S.nav}>
        <div style={{
          ...S.container,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div
            onClick={() => router.push('/')}
            style={{
              display: 'flex',
              alignItems: 'center', gap: 10,
              cursor: 'pointer',
            }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: 11,
              backgroundColor: '#0A7B5E',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800, color: 'white',
              fontSize: 14,
            }}>MF</div>
            <span style={{
              fontWeight: 700, fontSize: 17,
              color: 'var(--text-main)',
            }}>MoneyFlow (v2)</span>
          </div>

          <div className="nav-links">
            {[
              { label: 'Fonctionnalités',
                id: 'fonctionnalites' },
              { label: 'Témoignages',
                id: 'temoignages' },
              { label: 'Tarifs', id: 'tarifs' },
            ].map(link => (
              <button key={link.id}
                onClick={() => scroll(link.id)}
                style={{
                  background: 'none', border: 'none',
                  padding: '8px 14px', borderRadius: 10,
                  fontSize: 14, fontWeight: 500,
                  color: '#8A94A6', cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color =
                    '#1A1D23')}
                onMouseLeave={e =>
                  (e.currentTarget.style.color =
                    '#8A94A6')}>
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {isLoggedIn ? (
              <>
                <button
                  className="hidden-mobile"
                  onClick={() =>
                    router.push('/dashboard')}
                  style={{
                    ...S.btnOutline,
                    fontSize: 14,
                    padding: '9px 18px',
                  }}>
                  Tableau de bord
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    document.cookie =
                      'token=; path=/; max-age=0';
                    setIsLoggedIn(false);
                  }}
                  style={{
                    ...S.btnPrimary,
                    fontSize: 14,
                    padding: '9px 18px',
                  }}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  className="hidden-mobile"
                  onClick={() =>
                    router.push('/login')}
                  style={{
                    ...S.btnOutline,
                    fontSize: 14,
                    padding: '9px 18px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor =
                      '#0A7B5E';
                    e.currentTarget.style.color =
                      '#0A7B5E';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor =
                      '#E2EAE7';
                    e.currentTarget.style.color =
                      '#1A1D23';
                  }}>
                  Se connecter
                </button>
                <button
                  onClick={() =>
                    router.push('/register')}
                  style={{
                    ...S.btnPrimary,
                    fontSize: 14,
                    padding: '9px 18px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor
                      = '#076548';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor
                      = '#0A7B5E';
                  }}>
                  Commencer
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #0A7B5E 0%, #076548 50%, #054d36 100%)',
      }}>
        {/* Image background Afrique subtile */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          filter: 'grayscale(60%)',
        }} />

        {/* Pattern géométrique africain */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute',
          top: -100, right: -100,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -150, left: -100,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'rgba(245,166,35,0.08)',
          animation: 'pulse 6s ease-in-out infinite',
        }} />

        {/* Ligne décorative dorée */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent, #F5A623, transparent)',
        }} />

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        {/* Contenu hero existant */}
        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1280, margin: '0 auto',
          padding: '0 24px',
          width: '100%',
        }}>
          <div className="hero-grid">
            {/* Left */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center', gap: 8,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                padding: '6px 16px', borderRadius: 50,
                fontSize: 13, fontWeight: 600,
                marginBottom: 24,
              }}>
                <Shield size={14} />
                Conçu pour l'Afrique de l'Ouest
              </div>

              <h1 style={{
                fontSize: 56, fontWeight: 900,
                lineHeight: 1.1, color: 'white',
                marginBottom: 20,
              }}>
                Maîtrisez vos<br />
                finances{' '}
                <span style={{ color: '#F5A623' }}>
                  Mobile Money
                </span><br />
                comme un pro.
              </h1>

              <p style={{
                fontSize: 17, color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7, marginBottom: 32,
                maxWidth: 480,
              }}>
                Suivez chaque franc CFA dépensé,
                créez des budgets intelligents et
                atteignez vos objectifs financiers.
                Orange Money, Wave, Moov — tout en un.
              </p>

              <div style={{
                display: 'flex', gap: 14,
                marginBottom: 40,
              }}>
                <button
                  onClick={() => router.push('/register')}
                  style={{
                    ...S.btnPrimary,
                    backgroundColor: '#F5A623',
                    boxShadow: '0 4px 20px rgba(245,166,35,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,166,35,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,166,35,0.3)';
                  }}>
                  Commencer gratuitement
                  <ArrowRight size={16} />
                </button>
                <button
                  className="hidden-mobile"
                  onClick={() => scroll('fonctionnalites')}
                  style={{
                    ...S.btnOutline,
                    backgroundColor: 'transparent',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}>
                  Voir les fonctionnalités
                </button>
              </div>

              {/* Social proof */}
              <div style={{
                display: 'flex',
                alignItems: 'center', gap: 12,
              }}>
                <div style={{ display: 'flex' }}>
                  {['AO','FT','IS','KB','MT'].map((init, i) => (
                    <div key={i} style={{
                      width: 34, height: 34,
                      borderRadius: '50%',
                      backgroundColor: ['#0A7B5E','#F5A623','#16A34A','#2563EB','#DB2777'][i],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white', fontSize: 11,
                      fontWeight: 700,
                      marginLeft: i > 0 ? -8 : 0,
                      border: '2px solid white',
                    }}>{init}</div>
                  ))}
                </div>
                <div>
                  <div style={{
                    display: 'flex', gap: 2,
                    marginBottom: 2,
                  }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={13} fill="#F5A623" color="#F5A623" />
                    ))}
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
                    +2 400 utilisateurs satisfaits
                  </span>
                </div>
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div style={{ position: 'relative' }} className="hero-right">
              <div style={{
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                borderRadius: 28, padding: 24,
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              }}>
                {/* Mini dashboard */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                }}>
                  {/* Header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0A7B5E, #0D9B76)',
                    padding: '20px 20px 24px',
                  }}>
                    <p style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: 11, margin: '0 0 4px',
                    }}>Total dépensé ce mois</p>
                    <p style={{
                      color: 'white', fontWeight: 900,
                      fontSize: 26, margin: 0,
                    }}>127 450 FCFA</p>
                    <div style={{
                      display: 'flex', gap: 16,
                      marginTop: 12,
                    }}>
                      {[
                        { label: 'Revenus', val: '+85K', color: '#4ade80' },
                        { label: 'Dépenses', val: '-42K', color: '#fca5a5' },
                        { label: 'Économies', val: '+12K', color: '#fcd34d' },
                      ].map(s => (
                        <div key={s.label}>
                          <p style={{
                            color: s.color, fontWeight: 700,
                            fontSize: 14, margin: 0,
                          }}>{s.val}</p>
                          <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 10, margin: 0,
                          }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Transactions */}
                  <div style={{ padding: '12px 16px' }}>
                    {[
                      { label: 'Marché Sankariaré', amt: '-15 000', color: '#F04438' },
                      { label: 'Recharge Orange', amt: '-5 000', color: '#F04438' },
                      { label: 'Salaire reçu', amt: '+85 000', color: '#16A34A' },
                    ].map((t, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center', gap: 10,
                        padding: '8px 0',
                        borderBottom: i < 2 ? '1px solid #F0F2F8' : 'none',
                      }}>
                        <div style={{
                          width: 28, height: 28,
                          borderRadius: 8,
                          backgroundColor: '#E8F5F1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Smartphone size={12} color="#0A7B5E" />
                        </div>
                        <span style={{
                          flex: 1, fontSize: 11,
                          color: '#1A1D23', fontWeight: 500,
                        }}>{t.label}</span>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: t.color,
                        }}>{t.amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div style={{
                position: 'absolute',
                top: -16, right: -20,
                backgroundColor: 'white',
                borderRadius: 16, padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                animation: 'float 3s ease-in-out infinite',
              }}>
                <p style={{ fontWeight: 700, color: '#16A34A', fontSize: 14, margin: 0 }}>+45 000 FCFA</p>
                <p style={{ color: '#8A94A6', fontSize: 11, margin: 0 }}>Économies ce mois</p>
              </div>

              <div style={{
                position: 'absolute',
                bottom: 20, left: -24,
                backgroundColor: 'white',
                borderRadius: 16, padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                <p style={{
                  fontWeight: 700, color: '#0A7B5E',
                  fontSize: 13, margin: '0 0 6px',
                  display: 'flex',
                  alignItems: 'center', gap: 4,
                }}>
                  <Target size={12} />
                  Budget respecté
                </p>
                <div style={{ width: 120, height: 6, backgroundColor: '#F0F2F8', borderRadius: 50 }}>
                  <div style={{ width: '73%', height: 6, backgroundColor: '#00C48C', borderRadius: 50 }} />
                </div>
                <p style={{ color: '#8A94A6', fontSize: 10, margin: '4px 0 0' }}>73%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <div style={{
        backgroundColor: '#0A7B5E',
        padding: '48px 32px',
      }}>
        <div style={S.container} className="stats-grid">
          {[
            { num: '2 400+', label: 'Utilisateurs actifs' },
            { num: '12M+', label: 'FCFA suivis' },
            { num: '98%', label: 'Satisfaction' },
            { num: stats.avgRating.toString(), label: 'Note moyenne' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{
                fontSize: 36, fontWeight: 900,
                color: 'white', margin: 0,
              }}>{s.num}</p>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14, margin: '4px 0 0',
              }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <section
        id="fonctionnalites"
        style={{
          position: 'relative',
          padding: '80px 0',
          backgroundColor: '#F5F7F5',
          overflow: 'hidden',
        }}>
        {/* Pattern points discrets */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230A7B5E' fill-opacity='0.04' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Blob décoratif en haut à droite */}
        <div style={{
          position: 'absolute',
          top: -80, right: -80,
          width: 300, height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(10,123,94,0.06) 0%, transparent 70%)',
        }} />

        {/* Contenu existant */}
        <div style={{
          ...S.container,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{
            textAlign: 'center', marginBottom: 48,
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#E8F5F1',
              color: '#0A7B5E',
              padding: '6px 16px', borderRadius: 50,
              fontSize: 13, fontWeight: 600,
              marginBottom: 16,
            }}>
              Fonctionnalités
            </div>
            <h2 style={{
              fontSize: 36, fontWeight: 800,
              color: '#1A1D23', marginBottom: 12,
            }}>
              Tout ce dont vous avez besoin<br />
              pour contrôler votre argent
            </h2>
            <p style={{
              color: '#8A94A6', fontSize: 16,
              maxWidth: 500, margin: '0 auto',
            }}>
              Des outils pensés pour la réalité
              financière burkinabè et ouest-africaine.
            </p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i}
                  style={{
                    padding: 28, borderRadius: 24,
                    border: f.featured
                      ? 'none'
                      : '1px solid #E2EAE7',
                    background: f.featured
                      ? 'linear-gradient(135deg, #0A7B5E, #0D9B76)'
                      : 'white',
                    transition: 'all 0.2s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    if (!f.featured) {
                      e.currentTarget.style.transform
                        = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow
                        = '0 12px 30px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform
                      = 'translateY(0)';
                    e.currentTarget.style.boxShadow
                      = 'none';
                  }}>
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 16,
                    backgroundColor: f.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Icon size={24} color={f.color} />
                  </div>
                  <h3 style={{
                    fontSize: 18, fontWeight: 700,
                    color: f.featured
                      ? 'white' : '#1A1D23',
                    marginBottom: 8,
                  }}>{f.title}</h3>
                  <p style={{
                    fontSize: 14, lineHeight: 1.6,
                    color: f.featured
                      ? 'rgba(255,255,255,0.8)'
                      : '#8A94A6',
                    margin: 0,
                  }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section style={{
        padding: '80px 32px',
        backgroundColor: '#F5F7F5',
      }}>
        <div style={S.container}>
          <div style={{
            textAlign: 'center', marginBottom: 48,
          }}>
            <h2 style={{
              fontSize: 36, fontWeight: 800,
              color: '#1A1D23',
            }}>
              Comment ça marche ?
            </h2>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', gap: 0,
            maxWidth: 800, margin: '0 auto',
          }}>
            {[
              {
                n: '1',
                title: 'Créez votre compte',
                desc: 'Inscrivez-vous en 2 minutes avec votre email.',
              },
              {
                n: '2',
                title: 'Ajoutez vos dépenses',
                desc: 'Enregistrez chaque transaction avec sa catégorie.',
              },
              {
                n: '3',
                title: 'Analysez et économisez',
                desc: 'Consultez vos stats et atteignez vos objectifs.',
              },
            ].map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  textAlign: 'center',
                  maxWidth: 200, padding: '0 16px',
                }}>
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '50%',
                    backgroundColor: '#0A7B5E',
                    color: 'white',
                    fontSize: 20, fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>{step.n}</div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#1A1D23', marginBottom: 8,
                  }}>{step.title}</h3>
                  <p style={{
                    fontSize: 13, color: '#8A94A6',
                    lineHeight: 1.5, margin: 0,
                  }}>{step.desc}</p>
                </div>
                {i < 2 && (
                  <div style={{
                    marginTop: 24, flexShrink: 0,
                  }}>
                    <ChevronRight
                      size={24}
                      color="#E2EAE7" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section
        id="temoignages"
        style={{
          padding: '80px 32px',
          backgroundColor: 'white',
        }}>
        <div style={S.container}>
          <div style={{
            textAlign: 'center', marginBottom: 48,
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#E8F5F1',
              color: '#0A7B5E',
              padding: '6px 16px', borderRadius: 50,
              fontSize: 13, fontWeight: 600,
              marginBottom: 16,
            }}>
              Témoignages
            </div>
            <h2 style={{
              fontSize: 36, fontWeight: 800,
              color: '#1A1D23', marginBottom: 20,
            }}>
              Ils font confiance à MoneyFlow
            </h2>
            <div>
              <p style={{
                fontSize: 52, fontWeight: 900,
                color: '#0A7B5E', margin: 0,
              }}>{stats.avgRating}</p>
              <div style={{
                display: 'flex',
                justifyContent: 'center', gap: 4,
                margin: '6px 0',
              }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20}
                    fill={i <= Math.round(stats.avgRating) ? "#F5A623" : "transparent"}
                    color={i <= Math.round(stats.avgRating) ? "#F5A623" : "#E2EAE7"} />
                ))}
              </div>
              <p style={{
                color: '#8A94A6', fontSize: 14,
              }}>
                Basé sur {stats.total} avis
              </p>
            </div>
          </div>

          <div className="testimonials-grid">
            {(realReviews.length > 0 ? realReviews : testimonials).map((t: any, i) => {
              const isFeatured = t.featured !== undefined ? t.featured : i === 1;
              const name = t.userName || t.name;
              const initials = t.initials || name.substring(0, 2).toUpperCase();
              const avatarBg = t.avatarBg || ['#0A7B5E','#F5A623','#16A34A'][i % 3];
              const role = t.role || 'Utilisateur MoneyFlow';
              const rRating = t.rating || 5;
              const text = t.comment || t.text;
              return (
              <div key={i}
                style={{
                  padding: 24, borderRadius: 24,
                  border: isFeatured
                    ? 'none' : '1px solid #E2EAE7',
                  background: isFeatured
                    ? 'linear-gradient(135deg, #0A7B5E, #0D9B76)'
                    : 'white',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!isFeatured) {
                    e.currentTarget.style.transform
                      = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow
                      = '0 8px 24px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform
                    = 'translateY(0)';
                  e.currentTarget.style.boxShadow
                    = 'none';
                }}>
                <div style={{
                  display: 'flex', gap: 2,
                  marginBottom: 16,
                }}>
                  {[1,2,3,4,5].map(j => (
                    <Star key={j} size={15}
                      fill={j <= rRating ? "#F5A623" : "transparent"}
                      color={j <= rRating ? "#F5A623" : (isFeatured ? "rgba(255,255,255,0.3)" : "#E2EAE7")} />
                  ))}
                </div>
                <p style={{
                  fontSize: 14, lineHeight: 1.7,
                  fontStyle: 'italic',
                  color: isFeatured
                    ? 'rgba(255,255,255,0.9)'
                    : '#1A1D23',
                  marginBottom: 20,
                }}>
                  "{text}"
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    backgroundColor: isFeatured
                      ? 'rgba(255,255,255,0.25)'
                      : avatarBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white', fontSize: 12,
                    fontWeight: 700,
                  }}>{initials}</div>
                  <div>
                    <p style={{
                      fontWeight: 700, fontSize: 13,
                      margin: 0,
                      color: isFeatured
                        ? 'white' : '#1A1D23',
                    }}>{name}</p>
                    <p style={{
                      fontSize: 11, margin: 0,
                      color: isFeatured
                        ? 'rgba(255,255,255,0.7)'
                        : '#8A94A6',
                    }}>{role}</p>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <Award size={16}
                      color={isFeatured
                        ? 'rgba(255,255,255,0.7)'
                        : '#0A7B5E'} />
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* ===== REVIEW FORM ===== */}
      <section style={{
        padding: '80px 32px',
        backgroundColor: '#F5F7F5',
      }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
        }}>
          <div style={{
            textAlign: 'center', marginBottom: 32,
          }}>
            <h2 style={{
              fontSize: 32, fontWeight: 800,
              color: '#1A1D23', marginBottom: 8,
            }}>
              Donnez votre avis
            </h2>
            <p style={{
              color: '#8A94A6', fontSize: 15,
            }}>
              Votre expérience aide d'autres utilisateurs
            </p>
          </div>

          {reviewSubmitted ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 24, padding: 40,
              textAlign: 'center',
              boxShadow:
                '0 1px 12px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: 64, height: 64,
                borderRadius: '50%',
                backgroundColor: '#E8F5F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Check size={28} color="#0A7B5E" />
              </div>
              <h3 style={{
                fontSize: 20, fontWeight: 700,
                color: '#1A1D23', marginBottom: 8,
              }}>
                Merci pour votre avis !
              </h3>
              <p style={{
                color: '#8A94A6', fontSize: 14,
                marginBottom: 20,
              }}>
                Votre avis est désormais en ligne !
              </p>
              <button
                onClick={() => {
                  setReviewSubmitted(false);
                  setRating(0);
                  setReviewName('');
                  setReviewText('');
                }}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#E8F5F1',
                  color: '#0A7B5E',
                  border: 'none', borderRadius: 50,
                  fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                Laisser un autre avis
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: 24, padding: 32,
              boxShadow:
                '0 1px 12px rgba(0,0,0,0.06)',
            }}>
              {/* Stars */}
              <div style={{
                textAlign: 'center',
                marginBottom: 24,
              }}>
                <p style={{
                  fontSize: 13, color: '#8A94A6',
                  marginBottom: 12,
                }}>
                  Votre note
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center', gap: 8,
                  marginBottom: 8,
                }}>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() =>
                        setHoverRating(star)}
                      onMouseLeave={() =>
                        setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        transform:
                          (hoverRating || rating)
                            >= star
                            ? 'scale(1.2)'
                            : 'scale(1)',
                        transition: 'transform 0.15s',
                      }}>
                      <Star
                        size={32}
                        fill={(hoverRating || rating)
                          >= star
                          ? '#F5A623' : 'transparent'}
                        color={(hoverRating || rating)
                          >= star
                          ? '#F5A623' : '#E2EAE7'}
                      />
                    </button>
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <p style={{
                    fontSize: 14, fontWeight: 600,
                    color: '#0A7B5E',
                  }}>
                    {ratingLabels[
                      hoverRating || rating]}
                  </p>
                )}
              </div>

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>
                  Votre prénom
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={e =>
                    setReviewName(e.target.value)}
                  placeholder="Jean Traoré"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #E2EAE7',
                    borderRadius: 10, fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#1A1D23',
                  }}
                />
              </div>

              {/* Comment */}
              <div style={{ marginBottom: 8 }}>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500, color: '#1A1D23',
                  marginBottom: 6,
                }}>
                  Votre commentaire
                </label>
                <textarea
                  value={reviewText}
                  onChange={e =>
                    setReviewText(
                      e.target.value.slice(0, 280))}
                  placeholder="Partagez votre expérience avec MoneyFlow..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #E2EAE7',
                    borderRadius: 10, fontSize: 14,
                    outline: 'none', resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#1A1D23',
                  }}
                />
                <p style={{
                  textAlign: 'right', fontSize: 11,
                  color: '#8A94A6',
                  margin: '3px 0 0',
                }}>
                  {reviewText.length}/280
                </p>
              </div>

              <button
                onClick={async () => {
                  if (!rating) {
                    alert('Donnez une note svp');
                    return;
                  }
                  if (!reviewName.trim()) {
                    alert('Entrez votre prénom svp');
                    return;
                  }
                  
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/reviews`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                      },
                      body: JSON.stringify({
                        rating,
                        comment: reviewText,
                        userName: reviewName,
                      })
                    });
                    
                    // Rafraîchir
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/reviews`);
                    if (res.ok) {
                      const data = await res.json();
                      if (data.success && data.reviews) {
                        setRealReviews(data.reviews.slice(0, 3));
                        setStats({ total: data.total, avgRating: data.avgRating || 4.9 });
                      }
                    }
                  } catch(e) {}

                  setReviewSubmitted(true);
                }}
                style={{
                  width: '100%', padding: '13px',
                  backgroundColor: '#0A7B5E',
                  color: 'white', border: 'none',
                  borderRadius: 50, fontSize: 15,
                  fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow:
                    '0 4px 14px rgba(10,123,94,0.35)',
                  marginTop: 8,
                }}>
                Publier mon avis
              </button>
              <p style={{
                textAlign: 'center', fontSize: 12,
                color: '#8A94A6', marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', gap: 4,
              }}>
                <Lock size={12} />
                Système d'avis sécurisé
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ===== TARIFS ===== */}
      <section
        id="tarifs"
        style={{
          padding: '80px 32px',
          backgroundColor: 'white',
        }}>
        <div style={S.container}>
          <div style={{
            textAlign: 'center', marginBottom: 48,
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#E8F5F1',
              color: '#0A7B5E',
              padding: '6px 16px', borderRadius: 50,
              fontSize: 13, fontWeight: 600,
              marginBottom: 16,
            }}>
              Tarifs
            </div>
            <h2 style={{
              fontSize: 36, fontWeight: 800,
              color: '#1A1D23', marginBottom: 8,
            }}>
              Simple et transparent
            </h2>
            <p style={{
              color: '#8A94A6', fontSize: 16,
            }}>
              MoneyFlow est 100% gratuit
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 24, maxWidth: 720,
            margin: '0 auto',
          }}>
            {/* Free */}
            <div style={{
              border: '2px solid #0A7B5E',
              borderRadius: 24, padding: 28,
            }}>
              <h3 style={{
                fontSize: 20, fontWeight: 700,
                color: '#1A1D23', marginBottom: 4,
              }}>Gratuit</h3>
              <p style={{
                color: '#8A94A6', fontSize: 14,
                marginBottom: 16,
              }}>Pour toujours</p>
              <p style={{
                fontSize: 40, fontWeight: 900,
                color: '#0A7B5E', marginBottom: 20,
              }}>0 FCFA</p>
              {[
                'Suivi illimité des dépenses',
                'Budgets par catégorie',
                'Alertes automatiques',
                'Statistiques mensuelles',
                'Orange Money, Wave, Moov',
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10,
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <Check size={16}
                    color="#0A7B5E" />
                  <span style={{
                    fontSize: 14, color: '#1A1D23',
                  }}>{f}</span>
                </div>
              ))}
              <button
                onClick={() =>
                  router.push('/register')}
                style={{
                  ...S.btnPrimary,
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: 20,
                  padding: '13px',
                }}>
                Commencer gratuitement
              </button>
            </div>

            {/* Premium */}
            <div style={{
              border: '2px solid #E2EAE7',
              borderRadius: 24, padding: 28,
              backgroundColor: '#F5F7F5',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: 16, right: 16,
                backgroundColor: '#F5A623',
                color: 'white',
                padding: '4px 12px',
                borderRadius: 50, fontSize: 11,
                fontWeight: 700,
              }}>Bientôt</div>
              <h3 style={{
                fontSize: 20, fontWeight: 700,
                color: '#8A94A6', marginBottom: 4,
              }}>Premium</h3>
              <p style={{
                color: '#8A94A6', fontSize: 14,
                marginBottom: 16,
              }}>En développement</p>
              <p style={{
                fontSize: 40, fontWeight: 900,
                color: '#8A94A6', marginBottom: 20,
              }}>?.???</p>
              {[
                'Tout du plan Gratuit',
                'Export PDF/Excel',
                'Plusieurs comptes',
                'Objectifs épargne',
                'Support prioritaire',
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10,
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <Zap size={16} color="#8A94A6" />
                  <span style={{
                    fontSize: 14, color: '#8A94A6',
                  }}>{f}</span>
                </div>
              ))}
              <button disabled style={{
                width: '100%', marginTop: 20,
                padding: '13px', borderRadius: 50,
                backgroundColor: '#E2EAE7',
                color: '#8A94A6', border: 'none',
                fontSize: 15, fontWeight: 600,
                cursor: 'not-allowed',
                fontFamily: 'DM Sans, sans-serif',
              }}>
                
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        padding: '80px 32px',
        background:
          'linear-gradient(135deg, #0A7B5E, #0D9B76)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: -80, right: -80,
          width: 320, height: 320,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -60, left: -60,
          width: 240, height: 240,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          ...S.container,
          textAlign: 'center',
          position: 'relative', zIndex: 2,
        }}>
          <h2 style={{
            fontSize: 40, fontWeight: 900,
            color: 'white', marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Prêt à reprendre le contrôle<br />
            de vos finances ?
          </h2>
          <p style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.75)',
            marginBottom: 36,
          }}>
            Rejoignez 2 400+ utilisateurs qui font
            confiance à MoneyFlow.
          </p>
          <div style={{
            display: 'flex', gap: 14,
            justifyContent: 'center',
          }}>
            <button
              onClick={() =>
                router.push('/register')}
              style={{
                padding: '14px 28px',
                borderRadius: 50,
                backgroundColor: 'white',
                color: '#0A7B5E', border: 'none',
                fontSize: 16, fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow:
                  '0 8px 24px rgba(0,0,0,0.2)',
                display: 'inline-flex',
                alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform =
                  'translateY(-2px)')}
              onMouseLeave={e =>
                (e.currentTarget.style.transform =
                  'translateY(0)')}>
              Créer mon compte gratuitement
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '14px 28px',
                borderRadius: 50,
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
                fontSize: 16, fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.backgroundColor =
                  'rgba(255,255,255,0.1)')}
              onMouseLeave={e =>
                (e.currentTarget.style.backgroundColor =
                  'transparent')}>
              Se connecter
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        backgroundColor: '#1A1D23',
        color: 'white', padding: '60px 32px 32px',
      }}>
        <div style={{
          ...S.container,
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40, marginBottom: 40,
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 10,
              marginBottom: 16,
            }}>
              <div style={{
                width: 34, height: 34,
                borderRadius: 10,
                backgroundColor: '#0A7B5E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800, color: 'white',
                fontSize: 13,
              }}>MF</div>
              <span style={{
                fontWeight: 700, fontSize: 17,
              }}>MoneyFlow</span>
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: 13, lineHeight: 1.6,
              maxWidth: 240,
            }}>
              La solution de gestion financière
              conçue pour l'Afrique de l'Ouest.
            </p>
          </div>
          {[
            {
              title: 'Produit',
              links: ['Fonctionnalités','Tarifs',
                'Témoignages'],
            },
            {
              title: 'Légal',
              links: ["Conditions d'utilisation",
                'Confidentialité'],
            },
            {
              title: 'Contact',
              links: ['aida04zng@gmail.com',
                'Ouagadougou, BF'],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 700, fontSize: 14,
                marginBottom: 14,
              }}>{col.title}</h4>
              {col.links.map((link, j) => (
                <p key={j} style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 13, marginBottom: 8,
                  cursor: 'pointer',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color =
                    'rgba(255,255,255,0.8)')}
                onMouseLeave={e =>
                  (e.currentTarget.style.color =
                    'rgba(255,255,255,0.4)')}>
                  {link}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 13,
          }}>
            2026 MoneyFlow. Tous droits réservés.
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: 13,
          }}>
            Made in Burkina Faso
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
