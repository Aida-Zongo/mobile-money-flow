'use client';
import { useState, useEffect, useCallback }
  from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import {
  Plus, X, Trash2, Edit2, Target,
  Bell, AlertTriangle, ShoppingBag,
  Car, Heart, ShoppingCart, Home,
  Smartphone, BookOpen, Package, Check
} from 'lucide-react';

const getCats = (t: any) => [
  { id:'alimentation', label: t('shared.alimentation'),
    Icon:ShoppingBag, color:'#D97706',
    bg:'#FEF3E2' },
  { id:'transport', label: t('shared.transport'),
    Icon:Car, color:'#0A7B5E', bg:'#E8F5F1' },
  { id:'sante', label: t('shared.sante'),
    Icon:Heart, color:'#16A34A', bg:'#F0FDF4' },
  { id:'shopping', label: t('shared.shopping'),
    Icon:ShoppingCart, color:'#DB2777',
    bg:'#FDF2F8' },
  { id:'logement', label: t('shared.logement'),
    Icon:Home, color:'#2563EB', bg:'#EFF6FF' },
  { id:'telecom', label: t('shared.telecom'),
    Icon:Smartphone, color:'#0369A1',
    bg:'#F0F9FF' },
  { id:'education', label: t('shared.education'),
    Icon:BookOpen, color:'#CA8A04',
    bg:'#FEFCE8' },
  { id:'autre', label: t('shared.autre'),
    Icon:Package, color:'#6B7280',
    bg:'var(--bg)' },
];

const getMonths = (t: any) => [
  t('shared.january'), t('shared.february'), t('shared.march'),
  t('shared.april'), t('shared.may'), t('shared.june'),
  t('shared.july'), t('shared.august'), t('shared.september'),
  t('shared.october'), t('shared.november'), t('shared.december')
];

export default function BudgetsPage() {
  const { t, lang } = useLanguage();
  const CATS = getCats(t);
  const MONTHS = getMonths(t);

  const fmt = (n: number) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR').format(n || 0)
    + ' FCFA';
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [form, setForm] = useState({
    category:'alimentation', limitAmount:'',
    month: new Date().getMonth()+1,
    year: new Date().getFullYear()
  });

  const showToast = (msg:string, err=false) => {
    setToast({msg,err});
    setTimeout(()=>setToast(null), 3000);
  };

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const r = await api.get('/budgets/status');
      setBudgets(r.data.budgets || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(()=>{ load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      category:'alimentation', limitAmount:'',
      month: new Date().getMonth()+1,
      year: new Date().getFullYear()
    });
    setModal(true);
  };

  const save = async() => {
    if (!form.limitAmount) {
      showToast(t('budget.amount_required'), true); return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        limitAmount: Number(form.limitAmount)
      };
      const id = editing?.id || editing?._id;
      if (editing) {
        await api.put('/budgets/'+id, body);
        showToast(t('budget.updated'));
      } else {
        await api.post('/budgets', body);
        showToast(t('budget.created'));
      }
      setModal(false);
      load();
    } catch(e:any) {
      showToast('Erreur: '+e.message, true);
    }
    setSaving(false);
  };

  const del = async(id:string) => {
    try {
      await api.delete('/budgets/'+id);
      showToast(t('budget.deleted'));
      load();
    } catch(e) {
      showToast(t('tx.error'), true);
    }
  };

  const inp = {
    width:'100%', padding:'10px 14px',
    border:'1.5px solid #E2EAE7', borderRadius:10,
    fontSize:14, outline:'none',
    backgroundColor:'var(--bg-input)', color:'var(--text-main)',
    fontFamily:'DM Sans, sans-serif',
    boxSizing:'border-box' as const,
  };

  return (
    <div style={{
      padding:24, backgroundColor:'var(--bg)',
      minHeight:'100vh',
      fontFamily:'DM Sans, sans-serif'
    }}>
      {toast && (
        <div style={{
          position:'fixed', top:16, right:16,
          zIndex:9999, padding:'12px 20px',
          borderRadius:16, fontSize:14,
          fontWeight:500, color:'var(--bg-card)',
          backgroundColor:toast.err
            ?'#F04438':'#00C48C',
          boxShadow:'0 4px 20px rgba(0,0,0,0.15)'
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center', marginBottom:24
      }}>
        <div>
          <h1 style={{
            fontSize:24, fontWeight:800,
            color:'var(--text-main)', margin:0
          }}>{t('page.budgets')}</h1>
          <p style={{
            color:'var(--text-muted)', fontSize:14,
            marginTop:4
          }}>
            {t('budget.manage_desc')}
          </p>
        </div>
        <button onClick={openAdd} style={{
          display:'flex', alignItems:'center',
          gap:6, backgroundColor:'#0A7B5E',
          color:'var(--bg-card)', border:'none',
          borderRadius:50, padding:'10px 20px',
          fontSize:14, fontWeight:600,
          cursor:'pointer',
          fontFamily:'DM Sans, sans-serif',
          boxShadow:'0 4px 14px rgba(10,123,94,0.35)'
        }}>
          <Plus size={16} />
          {t('budget.create')}
        </button>
      </div>

      {loading ? (
        <div style={{
          textAlign:'center', padding:40,
          color:'var(--text-muted)'
        }}>{t('shared.loading')}</div>
      ) : budgets.length===0 ? (
        <div style={{
          backgroundColor:'var(--bg-card)', borderRadius:16,
          padding:60, textAlign:'center',
          boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width:64, height:64,
            borderRadius:'50%',
            backgroundColor:'#E8F5F1',
            display:'flex', alignItems:'center',
            justifyContent:'center',
            margin:'0 auto 16px'
          }}>
            <Target size={28} color="#0A7B5E" />
          </div>
          <h3 style={{
            color:'var(--text-main)', fontWeight:700,
            marginBottom:8
          }}>{t('budget.none')}</h3>
          <p style={{
            color:'var(--text-muted)', fontSize:14,
            marginBottom:20
          }}>
            {t('budget.none_desc')}
          </p>
          <button onClick={openAdd} style={{
            backgroundColor:'#0A7B5E',
            color:'var(--bg-card)', border:'none',
            borderRadius:50, padding:'10px 20px',
            cursor:'pointer', fontSize:14,
            fontWeight:600,
            fontFamily:'DM Sans, sans-serif'
          }}>
            {t('budget.create')}
          </button>
        </div>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns:
            'repeat(auto-fill,minmax(300px,1fr))',
          gap:16
        }}>
          {budgets.map((b:any)=>{
            const cat = CATS.find(
              c=>c.id===b.category) || CATS[7];
            const CatIcon = cat.Icon;
            const pct = Math.min(b.percent||0, 100);
            const barColor = pct>=100 ? '#F04438'
              : pct>=80 ? '#F5A623' : '#00C48C';
            const id = b.id || b._id;
            return (
              <div key={id} style={{
                backgroundColor:'var(--bg-card)',
                borderRadius:20, padding:20,
                boxShadow:
                  '0 1px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  display:'flex',
                  alignItems:'center', gap:12,
                  marginBottom:16
                }}>
                  <div style={{
                    width:44, height:44,
                    borderRadius:14,
                    backgroundColor:cat.bg,
                    display:'flex', alignItems:'center',
                    justifyContent:'center'
                  }}>
                    <CatIcon size={22}
                      color={cat.color} />
                  </div>
                  <div style={{flex:1}}>
                    <p style={{
                      fontWeight:700,
                      color:'var(--text-main)',
                      margin:0, fontSize:15
                    }}>{cat.label}</p>
                    <p style={{
                      color:'var(--text-muted)',
                      fontSize:12,
                      margin:'2px 0 0'
                    }}>
                      {MONTHS[(b.month||1)-1]}
                      {' '}{b.year}
                    </p>
                  </div>
                  {pct>=100 && (
                    <span style={{
                      display:'flex',
                      alignItems:'center', gap:4,
                      backgroundColor:'#FEF2F2',
                      color:'#F04438',
                      padding:'4px 10px',
                      borderRadius:50, fontSize:11,
                      fontWeight:600
                    }}>
                      <AlertTriangle size={11} />
                      {t('budget.exceeded')}
                    </span>
                  )}
                  {pct>=80 && pct<100 && (
                    <span style={{
                      display:'flex',
                      alignItems:'center', gap:4,
                      backgroundColor:'#FFFBEB',
                      color:'#F59E0B',
                      padding:'4px 10px',
                      borderRadius:50, fontSize:11,
                      fontWeight:600
                    }}>
                      <Bell size={11} />
                      {t('budget.warning')}
                    </span>
                  )}
                </div>

                <div style={{
                  width:'100%', height:8,
                  backgroundColor:'var(--bg-sub)',
                  borderRadius:50, marginBottom:14
                }}>
                  <div style={{
                    width:pct+'%', height:8,
                    backgroundColor:barColor,
                    borderRadius:50,
                    transition:'width 0.3s'
                  }}/>
                </div>

                <div style={{
                  display:'flex',
                  justifyContent:'space-between',
                  marginBottom:14
                }}>
                  <div>
                    <p style={{
                      color:'var(--text-muted)', fontSize:11,
                      margin:0
                    }}>{t('budget.spent')}</p>
                    <p style={{
                      fontWeight:700,
                      color:'#F04438', fontSize:13,
                      margin:'2px 0 0'
                    }}>
                      {fmt(b.spent||0)}
                    </p>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{
                      color:'var(--text-muted)', fontSize:11,
                      margin:0
                    }}>{t('budget.used')}</p>
                    <p style={{
                      fontWeight:700,
                      color:barColor, fontSize:13,
                      margin:'2px 0 0'
                    }}>
                      {b.percent||0}%
                    </p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{
                      color:'var(--text-muted)', fontSize:11,
                      margin:0
                    }}>{t('budget.limit')}</p>
                    <p style={{
                      fontWeight:700,
                      color:'var(--text-main)', fontSize:13,
                      margin:'2px 0 0'
                    }}>
                      {fmt(b.limitAmount)}
                    </p>
                  </div>
                </div>

                <div style={{
                  display:'flex', gap:8
                }}>
                  <button onClick={()=>{
                    setEditing(b);
                    setForm({
                      category:b.category,
                      limitAmount:String(b.limitAmount),
                      month:b.month,
                      year:b.year
                    });
                    setModal(true);
                  }} style={{
                    flex:1, padding:'8px',
                    borderRadius:10, border:'none',
                    backgroundColor:'#E8F5F1',
                    color:'#0A7B5E', cursor:'pointer',
                    fontSize:13, fontWeight:500,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center', gap:6,
                    fontFamily:'DM Sans, sans-serif'
                  }}>
                    <Edit2 size={13} />
                    {t('shared.edit')}
                  </button>
                  <button onClick={()=>del(id)}
                    style={{
                      flex:1, padding:'8px',
                      borderRadius:10, border:'none',
                      backgroundColor:'#FEF2F2',
                      color:'#F04438', cursor:'pointer',
                      fontSize:13, fontWeight:500,
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center', gap:6,
                      fontFamily:'DM Sans, sans-serif'
                  }}>
                    <Trash2 size={13} />
                    {t('shared.delete')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && <>
        <div onClick={()=>setModal(false)} style={{
          position:'fixed', inset:0, zIndex:40,
          backgroundColor:'rgba(0,0,0,0.4)'
        }}/>
        <div style={{
          position:'fixed', inset:0, zIndex:50,
          display:'flex', alignItems:'center',
          justifyContent:'center', padding:16
        }}>
          <div style={{
            backgroundColor:'var(--bg-card)',
            borderRadius:24, padding:28,
            maxWidth:440, width:'100%'
          }}>
            <div style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center', marginBottom:20
            }}>
              <h2 style={{
                fontSize:18, fontWeight:800,
                color:'var(--text-main)', margin:0
              }}>
                {editing
                  ?'Modifier le budget'
                  :'Nouveau budget'}
              </h2>
              <button onClick={()=>setModal(false)} style={{
                width:34, height:34,
                borderRadius:10, border:'none',
                backgroundColor:'var(--bg)',
                cursor:'pointer',
                display:'flex', alignItems:'center',
                justifyContent:'center'
              }}>
                <X size={16} color="#8A94A6" />
              </button>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{
                display:'block', fontSize:13,
                color:'var(--text-muted)', marginBottom:10
              }}>{t('tx.category')}</label>
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(4,1fr)',
                gap:8
              }}>
                {CATS.map(cat=>{
                  const CatIcon = cat.Icon;
                  const sel =
                    form.category===cat.id;
                  return (
                    <button key={cat.id}
                      type='button'
                      onClick={()=>setForm({
                        ...form,
                        category:cat.id})}
                      style={{
                        padding:'10px 6px',
                        borderRadius:12,
                        cursor:'pointer',
                        textAlign:'center',
                        border: sel
                          ?'2px solid #0A7B5E'
                          :'2px solid transparent',
                        backgroundColor: sel
                          ?'#E8F5F1':'var(--bg)'
                      }}>
                      <div style={{
                        display:'flex',
                        justifyContent:'center',
                        marginBottom:4
                      }}>
                        <CatIcon size={20}
                          color={sel
                            ?'#0A7B5E':cat.color}
                        />
                      </div>
                      <div style={{
                        fontSize:10, fontWeight:500,
                        color:sel
                          ?'#0A7B5E':cat.color
                      }}>
                        {cat.label.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <label style={{
                display:'block', fontSize:13,
                color:'var(--text-muted)', marginBottom:6
              }}>{t('budget.limit_label')} (FCFA)</label>
              <input type='number'
                value={form.limitAmount}
                onChange={e=>setForm({
                  ...form,
                  limitAmount:e.target.value})}
                placeholder='50 000'
                style={inp}/>
            </div>

            <div style={{
              display:'grid',
              gridTemplateColumns:'1fr 1fr',
              gap:12, marginBottom:20
            }}>
              <div>
                <label style={{
                  display:'block', fontSize:13,
                  color:'var(--text-muted)', marginBottom:6
                }}>
                  {t('settings.report_month')}
                </label>
                <select value={form.month}
                  onChange={e=>setForm({
                    ...form,
                    month:Number(e.target.value)})}
                  style={{...inp, cursor:'pointer'}}>
                  {MONTHS.map((m,i)=>(
                    <option key={i} value={i+1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{
                  display:'block', fontSize:13,
                  color:'var(--text-muted)', marginBottom:6
                }}>
                  {t('settings.report_year') || 'Année'}
                </label>
                <input type='number'
                  value={form.year}
                  onChange={e=>setForm({
                    ...form,
                    year:Number(e.target.value)})}
                  style={inp}/>
              </div>
            </div>

            <button onClick={save}
              disabled={saving} style={{
                width:'100%', padding:'13px',
                backgroundColor:saving
                  ?'#7BBDAD':'#0A7B5E',
                color:'var(--bg-card)', border:'none',
                borderRadius:50, fontSize:15,
                fontWeight:600,
                cursor:saving
                  ?'not-allowed':'pointer',
                fontFamily:'DM Sans, sans-serif',
                display:'flex',
                alignItems:'center',
                justifyContent:'center', gap:8
              }}>
              {saving ? t('shared.saving') : <>
                <Check size={16} />
                {editing
                  ? t('shared.edit')
                  : t('budget.create')}
              </>}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
