'use client';
import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer
} from 'recharts';
import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import {
  TrendingDown, BarChart3, Tag,
  ChevronLeft, ChevronRight, TrendingUp
} from 'lucide-react';

const COLORS = [
  '#F59E0B','#0A7B5E','#00C48C',
  '#DB2777','#2563EB','#0369A1',
  '#CA8A04','#6B7280'
];

const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai',
  'Juin','Juillet','Août','Septembre',
  'Octobre','Novembre','Décembre'
];

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n || 0)
  + ' FCFA';

export default function StatsPage() {
  const { t } = useLanguage();
  const [month, setMonth] =
    useState(new Date().getMonth());
  const [year, setYear] =
    useState(new Date().getFullYear());
  const [summary, setSummary] =
    useState<any>(null);
  const [cats, setCats] =
    useState<any[]>([]);
  const [daily, setDaily] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const p = `month=${month+1}&year=${year}`;
      const [s, c, d] = await Promise.all([
        api.get('/stats/summary?' + p),
        api.get('/stats/categories?' + p),
        api.get('/stats/daily?' + p),
      ]);
      setSummary(s.data);
      setCats(c.data.data || []);
      setDaily(d.data.data || []);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [month, year]);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const pieData = cats.map((c, i) => ({
    name: c._id,
    value: c.total,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div style={{
      padding: 24,
      backgroundColor: 'var(--bg)',
      minHeight: '100vh',
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 800,
            color: 'var(--text-main)', margin: 0,
          }}>
            Statistiques
          </h1>
          <p style={{
            color: 'var(--text-muted)', fontSize: 14,
            marginTop: 4,
          }}>
            Analysez vos habitudes financières
          </p>
        </div>

        {/* Sélecteur mois */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 10, backgroundColor: 'var(--bg-card)',
          padding: '8px 16px', borderRadius: 16,
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <button onClick={prev} style={{
            width: 32, height: 32,
            borderRadius: 10, border: 'none',
            backgroundColor: 'var(--bg)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ChevronLeft size={18}
              color="#1A1D23" />
          </button>
          <span style={{
            fontWeight: 600, fontSize: 14,
            color: 'var(--text-main)', minWidth: 130,
            textAlign: 'center',
          }}>
            {MONTHS[month]} {year}
          </span>
          <button onClick={next} style={{
            width: 32, height: 32,
            borderRadius: 10, border: 'none',
            backgroundColor: 'var(--bg)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ChevronRight size={18}
              color="#1A1D23" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16, marginBottom: 24,
      }}>
        {[
          {
            icon: TrendingDown,
            label: t('stats.total'),
            val: loading ? '...'
              : fmt(summary?.totalMonth || 0),
            bg: '#FEF2F2',
            color: '#F04438',
          },
          {
            icon: BarChart3,
            label: 'Transactions',
            val: loading ? '...'
              : String(summary?.totalCount || 0),
            bg: '#E8F5F1',
            color: '#0A7B5E',
          },
          {
            icon: Tag,
            label: 'Top catégorie',
            val: loading ? '...'
              : (summary?.topCategory || '—'),
            bg: '#F0FDF4',
            color: '#16A34A',
          },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 16, padding: 20,
              boxShadow:
                '0 1px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 14,
                backgroundColor: item.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={22}
                  color={item.color} />
              </div>
              <div>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: 12, margin: 0,
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontWeight: 700, fontSize: 18,
                  color: 'var(--text-main)',
                  margin: '4px 0 0',
                }}>
                  {item.val}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16, marginBottom: 24,
      }}>

        {/* Pie Chart */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 16, padding: 20,
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{
            fontSize: 16, fontWeight: 700,
            color: 'var(--text-main)', marginBottom: 16,
          }}>
            {t('stats.by_cat')}
          </h3>
          {pieData.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 40,
              color: 'var(--text-muted)',
            }}>
              Aucune donnée
            </div>
          ) : (
            <>
              <ResponsiveContainer
                width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) =>
                      [fmt(v), 'Montant']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap', gap: 6,
                marginTop: 12,
              }}>
                {pieData.map((d, i) => (
                  <span key={i} style={{
                    padding: '3px 10px',
                    borderRadius: 50, fontSize: 11,
                    fontWeight: 500,
                    backgroundColor: d.color + '20',
                    color: d.color,
                  }}>
                    {d.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar Chart */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 16, padding: 20,
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{
            fontSize: 16, fontWeight: 700,
            color: 'var(--text-main)', marginBottom: 16,
          }}>
            {t('stats.daily')}
          </h3>
          {daily.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 40,
              color: 'var(--text-muted)',
            }}>
              Aucune donnée
            </div>
          ) : (
            <ResponsiveContainer
              width="100%" height={220}>
              <BarChart data={daily}>
                <XAxis dataKey="day"
                  tick={{
                    fill: 'var(--text-muted)',
                    fontSize: 11
                  }}
                  axisLine={false}
                  tickLine={false} />
                <YAxis
                  tick={{
                    fill: 'var(--text-muted)',
                    fontSize: 11
                  }}
                  axisLine={false}
                  tickLine={false} />
                <Tooltip
                  formatter={(v: any) =>
                    [fmt(v), 'Dépenses']} />
                <Bar dataKey="total"
                  fill="#0A7B5E"
                  radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Insights */}
      {summary && (
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 16,
        }}>
          {[
            {
              icon: Tag,
              bg: '#E8F5F1',
              color: '#0A7B5E',
              text: `Principale: ${summary.topCategory || '—'}`,
            },
            {
              icon: BarChart3,
              bg: '#F0FDF4',
              color: '#16A34A',
              text: `${summary.totalCount || 0} transactions`,
            },
            {
              icon: TrendingUp,
              bg: '#FFFBEB',
              color: '#D97706',
              text: `Moy/jour: ${fmt(
                Math.round(
                  (summary.totalMonth || 0) /
                  new Date(year, month+1, 0)
                    .getDate()
                )
              )}`,
            },
          ].map((ins, i) => {
            const Icon = ins.icon;
            return (
              <div key={i} style={{
                borderRadius: 16, padding: 18,
                backgroundColor: ins.bg,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <Icon size={22}
                  color={ins.color} />
                <p style={{
                  fontSize: 13, fontWeight: 500,
                  color: ins.color, margin: 0,
                  lineHeight: 1.5,
                }}>
                  {ins.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
