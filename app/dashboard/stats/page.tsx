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


export default function StatsPage() {
  const { t, lang } = useLanguage();
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

  const fmt = (n: number) => {
    const locale = lang === 'en' ? 'en-US' : 'fr-FR';
    return new Intl.NumberFormat(locale).format(n || 0) + ' FCFA';
  };

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
    name: t(`shared.${c._id.toLowerCase()}`) || c._id,
    value: c.total,
    color: COLORS[i % COLORS.length],
  }));

  const monthNames = [
    t('shared.january'), t('shared.february'), t('shared.march'), t('shared.april'),
    t('shared.may'), t('shared.june'), t('shared.july'), t('shared.august'),
    t('shared.september'), t('shared.october'), t('shared.november'), t('shared.december')
  ];

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
            {t('stats.transactions')}
          </h1>
          <p style={{
            color: 'var(--text-muted)', fontSize: 13,
            marginTop: 4,
          }}>
            {t('stats.desc')}
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
              color="var(--text-main)" />
          </button>
          <span style={{
            fontWeight: 600, fontSize: 14,
            color: 'var(--text-main)', minWidth: 130,
            textAlign: 'center',
          }}>
            {monthNames[month]} {year}
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
              color="var(--text-main)" />
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
            bg: 'var(--bg-red-soft)',
            color: 'var(--red)',
          },
          {
            icon: BarChart3,
            label: t('stats.transactions'),
            val: loading ? '...'
              : String(summary?.totalCount || 0),
            bg: 'var(--bg-green-soft)',
            color: 'var(--green)',
          },
          {
            icon: Tag,
            label: t('stats.top'),
            val: loading ? '...'
              : (t(`shared.${summary?.topCategory?.toLowerCase()}`) || summary?.topCategory || '—'),
            bg: 'var(--bg-blue-soft)',
            color: 'var(--blue)',
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
              {t('shared.none')}
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
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                    formatter={(v: any) =>
                      [fmt(v), t('shared.amount')]} />
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
              {t('shared.none')}
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
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                  formatter={(v: any) =>
                    [fmt(v), t('dashboard.depenses')]} />
                <Bar dataKey="total"
                  fill="var(--primary)"
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
              bg: 'var(--bg-green-soft)',
              color: 'var(--green)',
              text: `${t('stats.main')}: ${t(`shared.${summary.topCategory?.toLowerCase()}`) || summary.topCategory || '—'}`,
            },
            {
              icon: BarChart3,
              bg: 'var(--bg-blue-soft)',
              color: 'var(--blue)',
              text: `${summary.totalCount || 0} ${t('stats.transactions').toLowerCase()}`,
            },
            {
              icon: TrendingUp,
              bg: 'var(--bg-orange-soft)',
              color: 'var(--orange)',
              text: `${t('stats.average_day')}: ${fmt(
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
                  fontSize: 13, fontWeight: 600,
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
