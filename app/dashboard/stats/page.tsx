'use client';
import { useState, useEffect, useCallback }
  from 'react';
import api from '@/lib/api';
import {
  BarChart3, PieChart, TrendingUp,
  Calendar, DollarSign, ArrowUp,
  ArrowDown, Wallet, Target
} from 'lucide-react';

const MONTHS = ['Janvier','Février','Mars',
  'Avril','Mai','Juin','Juillet','Août',
  'Septembre','Octobre','Novembre','Décembre'];

const fmt = (n:number) =>
  new Intl.NumberFormat('fr-FR').format(n||0)
  +' FCFA';

export default function StatsPage() {
  const [stats, setStats] = useState<any>({});
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] =
    useState(new Date().getMonth()+1);
  const [year, setYear] =
    useState(new Date().getFullYear());

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      // Stats globales
      const statsRes = await api.get('/stats/summary');
      setStats(statsRes.data || {});
      
      // Stats par catégorie
      const catRes = await api.get('/stats/categories');
      setCategoryStats(catRes.data || []);
      
      // Stats quotidiennes
      const dailyRes = await api.get('/stats/daily');
      setDailyStats(dailyRes.data || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [month, year]);

  useEffect(()=>{ load(); }, [load]);

  return (
    <div style={{
      padding:24, backgroundColor:'#F5F7F5',
      minHeight:'100vh',
      fontFamily:'DM Sans, sans-serif'
    }}>
      <div style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center', marginBottom:24
      }}>
        <div>
          <h1 style={{
            fontSize:24, fontWeight:800,
            color:'#1A1D23', margin:0
          }}>Statistiques</h1>
          <p style={{
            color:'#8A94A6', fontSize:14,
            marginTop:4
          }}>
            Vue d'ensemble de vos finances
          </p>
        </div>
        <div style={{
          display:'flex', gap:12
        }}>
          <select value={month}
            onChange={e=>setMonth(Number(e.target.value))}
            style={{
              padding:'8px 12px',
              border:'1.5px solid #E2EAE7',
              borderRadius:8, fontSize:14,
              outline:'none',
              backgroundColor:'white',
              color:'#1A1D23',
              fontFamily:'DM Sans, sans-serif',
              cursor:'pointer'
            }}>
            {MONTHS.map((m,i)=>(
              <option key={i} value={i+1}>{m}</option>
            ))}
          </select>
          <input type='number'
            value={year}
            onChange={e=>setYear(Number(e.target.value))}
            style={{
              padding:'8px 12px',
              border:'1.5px solid #E2EAE7',
              borderRadius:8, fontSize:14,
              outline:'none',
              backgroundColor:'white',
              color:'#1A1D23',
              fontFamily:'DM Sans, sans-serif',
              width:100
            }}/>
        </div>
      </div>

      {loading ? (
        <div style={{
          backgroundColor:'white',
          borderRadius:16, padding:60,
          textAlign:'center',
          boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width:64, height:64,
            borderRadius:'50%',
            backgroundColor:'#E8F5F1',
            display:'flex', alignItems:'center',
            justifyContent:'center',
            margin:'0 auto 16px',
            animation:'spin 1s linear infinite'
          }}>
            <BarChart3 size={28}
              color="#0A7B5E" />
          </div>
          <h3 style={{
            color:'#1A1D23', fontWeight:700,
            marginBottom:8
          }}>
            Chargement des statistiques...
          </h3>
        </div>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
          gap:20
        }}>
          {/* Carte résumé */}
          <div style={{
            backgroundColor:'white',
            borderRadius:16, padding:24,
            boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
            gridColumn:'span 2'
          }}>
            <h2 style={{
              fontSize:18, fontWeight:700,
              color:'#1A1D23', marginBottom:20,
              display:'flex',
              alignItems:'center', gap:8
            }}>
              <BarChart3 size={20} color="#0A7B5E" />
              Résumé du mois
            </h2>
            
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(3, 1fr)',
              gap:16
            }}>
              <div style={{textAlign:'center'}}>
                <p style={{
                  color:'#8A94A6', fontSize:12,
                  margin:'0 0 8px'
                }}>Revenus</p>
                <p style={{
                  fontSize:24, fontWeight:800,
                  color:'#16A34A', margin:0
                }}>
                  {fmt(stats.totalIncome || 0)}
                </p>
                <div style={{
                  display:'flex', alignItems:'center', gap:4,
                  justifyContent:'center', marginTop:4
                }}>
                  <ArrowUp size={12} color="#16A34A" />
                  <span style={{
                    fontSize:11, color:'#16A34A'
                  }}>
                    +{stats.incomeGrowth || 0}%
                  </span>
                </div>
              </div>
              
              <div style={{textAlign:'center'}}>
                <p style={{
                  color:'#8A94A6', fontSize:12,
                  margin:'0 0 8px'
                }}>Dépenses</p>
                <p style={{
                  fontSize:24, fontWeight:800,
                  color:'#F04438', margin:0
                }}>
                  {fmt(stats.totalExpense || 0)}
                </p>
                <div style={{
                  display:'flex', alignItems:'center', gap:4,
                  justifyContent:'center', marginTop:4
                }}>
                  <ArrowDown size={12} color="#F04438" />
                  <span style={{
                    fontSize:11, color:'#F04438'
                  }}>
                    +{stats.expenseGrowth || 0}%
                  </span>
                </div>
              </div>
              
              <div style={{textAlign:'center'}}>
                <p style={{
                  color:'#8A94A6', fontSize:12,
                  margin:'0 0 8px'
                }}>Solde</p>
                <p style={{
                  fontSize:24, fontWeight:800,
                  color: stats.balance >= 0 ? '#16A34A' : '#F04438',
                  margin:0
                }}>
                  {fmt(stats.balance || 0)}
                </p>
                <div style={{
                  display:'flex', alignItems:'center', gap:4,
                  justifyContent:'center', marginTop:4
                }}>
                  <Wallet size={12} color={stats.balance >= 0 ? '#16A34A' : '#F04438'} />
                  <span style={{
                    fontSize:11,
                    color: stats.balance >= 0 ? '#16A34A' : '#F04438'
                  }}>
                    {stats.balance >= 0 ? '+' : '-'}{Math.abs(stats.balanceGrowth || 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphique catégories */}
          <div style={{
            backgroundColor:'white',
            borderRadius:16, padding:24,
            boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{
              fontSize:16, fontWeight:700,
              color:'#1A1D23', marginBottom:16,
              display:'flex',
              alignItems:'center', gap:8
            }}>
              <PieChart size={18} color="#0A7B5E" />
              Dépenses par catégorie
            </h3>
            <div style={{
              display:'flex',
              flexDirection:'column',
              gap:12
            }}>
              {categoryStats.slice(0, 6).map((cat:any, i)=>(
                <div key={i} style={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between'
                }}>
                  <div style={{
                    display:'flex',
                    alignItems:'center', gap:8
                  }}>
                    <div style={{
                      width:12, height:12,
                      borderRadius:'50%',
                      backgroundColor:cat.color || '#8A94A6'
                    }}/>
                    <span style={{
                      fontSize:13,
                      color:'#1A1D23'
                    }}>{cat.category}</span>
                  </div>
                  <div style={{
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'flex-end'
                  }}>
                    <span style={{
                      fontSize:14, fontWeight:600,
                      color:'#1A1D23'
                    }}>{fmt(cat.amount || 0)}</span>
                    <span style={{
                      fontSize:11, color:'#8A94A6'
                    }}>{cat.percentage || 0}%</span>
                  </div>
                </div>
                <div style={{
                  width:100, height:6,
                  backgroundColor:'#F0F2F8',
                  borderRadius:3,
                  marginTop:4
                }}>
                  <div style={{
                    width:cat.percentage || 0,
                    height:6,
                    backgroundColor:cat.color || '#8A94A6',
                    borderRadius:3
                  }}/>
                </div>
              </div>
              ))}
            </div>
          </div>

          {/* Tendances quotidiennes */}
          <div style={{
            backgroundColor:'white',
            borderRadius:16, padding:24,
            boxShadow:'0 1px 8px rgba(0,0,0,0.05)',
            gridColumn:'span 2'
          }}>
            <h3 style={{
              fontSize:16, fontWeight:700,
              color:'#1A1D23', marginBottom:16,
              display:'flex',
              alignItems:'center', gap:8
            }}>
              <Calendar size={18} color="#0A7B5E" />
              Évolution quotidienne
            </h3>
            <div style={{
              height:200,
              display:'flex',
              alignItems:'flex-end',
              gap:2,
              padding:'0 8px'
            }}>
              {dailyStats.slice(-30).map((day:any, i)=>(
                <div key={i} style={{
                  flex:1,
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center'
                }}>
                  <div style={{
                    width:'100%',
                    height:160,
                    backgroundColor: day.expense > day.income ? '#FEE2E2' : '#F0FDF4',
                    borderRadius:4,
                    marginBottom:8,
                    position:'relative',
                    overflow:'hidden'
                  }}>
                    <div style={{
                      position:'absolute',
                      bottom:0,
                      width:'100%',
                      height: `${Math.min((day.expense + day.income) / Math.max(...dailyStats.map(d => d.expense + d.income)) * 160, 160)}px`,
                      backgroundColor: day.expense > day.income ? '#F04438' : '#16A34A',
                      borderRadius:'4px 4px 0 0'
                    }}/>
                  </div>
                  <div style={{
                    fontSize:10, color:'#8A94A6',
                    textAlign:'center'
                  }}>
                    {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              display:'flex',
              justifyContent:'space-between',
              marginTop:8,
              fontSize:11, color:'#8A94A6'
            }}>
              <span>Dépenses</span>
              <span>Revenus</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
