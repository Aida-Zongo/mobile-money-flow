'use client';
import { useState, useEffect, useCallback }
  from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import {
  Plus, X, Trash2, DollarSign,
  Briefcase, Laptop, ShoppingCart,
  Users, Check
} from 'lucide-react';

const SOURCES = [
  { id:'salaire', label:'Salaire',
    Icon:Briefcase, color:'#16A34A',
    bg:'#F0FDF4' },
  { id:'freelance', label:'Freelance',
    Icon:Laptop, color:'#0A7B5E',
    bg:'#E8F5F1' },
  { id:'commerce', label:'Commerce',
    Icon:ShoppingCart, color:'#F5A623',
    bg:'#FEF3DC' },
  { id:'famille', label:'Famille',
    Icon:Users, color:'#8B5CF6',
    bg:'#F3F0FF' },
  { id:'autre', label:'Autre',
    Icon:DollarSign, color:'var(--text-muted)',
    bg:'var(--bg)' },
];

const MONTHS = ['Janvier','Février','Mars',
  'Avril','Mai','Juin','Juillet','Août',
  'Septembre','Octobre','Novembre','Décembre'];

const fmt = (n:number) =>
  new Intl.NumberFormat('fr-FR').format(n||0)
  +' FCFA';

export default function RevenusPage() {
  const { t } = useLanguage();
  const [incomes, setIncomes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [month, setMonth] =
    useState(new Date().getMonth()+1);
  const [form, setForm] = useState({
    amount:'', source:'salaire',
    month: new Date().getMonth()+1,
    year: new Date().getFullYear(),
    note:''
  });

  const showToast = (msg:string, err=false) => {
    setToast({msg,err});
    setTimeout(()=>setToast(null), 3000);
  };

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const r = await api.get(
        `/incomes?month=${month}&year=${year}`);
      setIncomes(r.data.incomes || []);
      setTotal(r.data.total || 0);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [month]);

  useEffect(()=>{ load(); }, [load]);

  const save = async() => {
    if (!form.amount) {
      showToast('Montant requis', true); return;
    }
    setSaving(true);
    try {
      await api.post('/incomes', {
        ...form, amount: Number(form.amount)
      });
      showToast('Revenu ajouté');
      setModal(false);
      setForm({
        amount:'', source:'salaire',
        month: new Date().getMonth()+1,
        year: new Date().getFullYear(), note:''
      });
      load();
    } catch(e:any) {
      showToast('Erreur: '+e.message, true);
    }
    setSaving(false);
  };

  const del = async(id:string) => {
    try {
      await api.delete('/incomes/'+id);
      showToast('Revenu supprimé');
      load();
    } catch(e) {
      showToast('Erreur', true);
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
          }}>{t('page.incomes')}</h1>
          <p style={{
            color:'var(--text-muted)', fontSize:14,
            marginTop:4
          }}>
            {incomes.length} source
            {incomes.length!==1?'s':''}
          </p>
        </div>
        <button onClick={()=>setModal(true)}
          style={{
            display:'flex', alignItems:'center',
            gap:6, backgroundColor:'#16A34A',
            color:'var(--bg-card)', border:'none',
            borderRadius:50, padding:'10px 20px',
            fontSize:14, fontWeight:600,
            cursor:'pointer',
            fontFamily:'DM Sans, sans-serif',
            boxShadow:'0 4px 14px rgba(22,163,74,0.35)'
          }}>
          <Plus size={16} />
          {t('income.new')}
        </button>
      </div>

      {/* Total card */}
      <div style={{
        background:
          'linear-gradient(135deg,#16A34A,#22C55E)',
        borderRadius:20, padding:24,
        marginBottom:20, color:'var(--bg-card)'
      }}>
        <p style={{
          color:'rgba(255,255,255,0.7)',
          fontSize:13, margin:'0 0 6px'
        }}>
          {t('income.total')} — {MONTHS[month-1]}
        </p>
        <p style={{
          fontSize:36, fontWeight:900,
          margin:0
        }}>
          {loading ? '...' : fmt(total)}
        </p>
      </div>

      {/* Filter */}
      <div style={{
        backgroundColor:'var(--bg-card)', borderRadius:14,
        padding:14, marginBottom:16,
        boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
      }}>
        <select value={month}
          onChange={e=>setMonth(Number(e.target.value))}
          style={{...inp, width:'auto',
            cursor:'pointer'}}>
          {MONTHS.map((m,i)=>(
            <option key={i} value={i+1}>{m}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div style={{
        backgroundColor:'var(--bg-card)', borderRadius:16,
        overflow:'hidden',
        boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
      }}>
        {loading ? (
          <div style={{
            padding:40, textAlign:'center',
            color:'var(--text-muted)'
          }}>Chargement...</div>
        ) : incomes.length===0 ? (
          <div style={{
            padding:60, textAlign:'center'
          }}>
            <div style={{
              width:64, height:64,
              borderRadius:'50%',
              backgroundColor:'#F0FDF4',
              display:'flex', alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 16px'
            }}>
              <DollarSign size={28}
                color="#16A34A" />
            </div>
            <h3 style={{
              color:'var(--text-main)', fontWeight:700,
              marginBottom:8
            }}>
              {t('income.none')}
            </h3>
            <p style={{
              color:'var(--text-muted)', fontSize:14,
              marginBottom:20
            }}>
              Ajoutez votre salaire ou vos revenus
            </p>
            <button
              onClick={()=>setModal(true)}
              style={{
                backgroundColor:'#16A34A',
                color:'var(--bg-card)', border:'none',
                borderRadius:50, padding:'10px 20px',
                cursor:'pointer', fontSize:14,
                fontWeight:600,
                fontFamily:'DM Sans, sans-serif'
              }}>
              Ajouter
            </button>
          </div>
        ) : incomes.map((inc:any, i:number)=>{
          const src = SOURCES.find(
            s=>s.id===inc.source) || SOURCES[4];
          const SrcIcon = src.Icon;
          return (
            <div key={inc.id||i} style={{
              display:'flex', alignItems:'center',
              gap:14, padding:'14px 20px',
              borderBottom: i<incomes.length-1
                ?'1px solid var(--border)':'none'
            }}>
              <div style={{
                width:42, height:42,
                borderRadius:12,
                backgroundColor:src.bg,
                display:'flex', alignItems:'center',
                justifyContent:'center',
                flexShrink:0
              }}>
                <SrcIcon size={20}
                  color={src.color} />
              </div>
              <div style={{flex:1}}>
                <p style={{
                  fontWeight:600, fontSize:14,
                  color:'var(--text-main)', margin:0
                }}>
                  {src.label}
                  {inc.note && (
                    <span style={{
                      color:'var(--text-muted)',
                      fontWeight:400
                    }}>
                      {' '}— {inc.note}
                    </span>
                  )}
                </p>
                <p style={{
                  color:'var(--text-muted)', fontSize:12,
                  margin:'2px 0 0'
                }}>
                  {MONTHS[inc.month-1]} {inc.year}
                </p>
              </div>
              <p style={{
                fontWeight:700, fontSize:15,
                color:'#16A34A', margin:0
              }}>
                +{fmt(inc.amount)}
              </p>
              <button onClick={()=>del(inc.id)}
                style={{
                  width:32, height:32,
                  borderRadius:8, border:'none',
                  backgroundColor:'#FEF2F2',
                  cursor:'pointer',
                  display:'flex', alignItems:'center',
                  justifyContent:'center'
                }}>
                <Trash2 size={14} color="#F04438" />
              </button>
            </div>
          );
        })}
      </div>

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
              }}>Nouveau revenu</h2>
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
                color:'var(--text-muted)', marginBottom:8
              }}>{t('tx.amount')}</label>
              <div style={{position:'relative'}}>
                <input type='number'
                  value={form.amount}
                  onChange={e=>setForm({
                    ...form,
                    amount:e.target.value})}
                  placeholder='0'
                  style={{
                    ...inp, textAlign:'center',
                    fontSize:36, fontWeight:800,
                    padding:'16px 60px 16px 20px',
                    border:'2px solid #E2EAE7',
                    borderRadius:14
                  }}/>
                <span style={{
                  position:'absolute', right:14,
                  bottom:14, color:'var(--text-muted)',
                  fontSize:12
                }}>FCFA</span>
              </div>
            </div>

            <div style={{marginBottom:16}}>
              <label style={{
                display:'block', fontSize:13,
                color:'var(--text-muted)', marginBottom:10
              }}>{t('income.source')}</label>
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(5,1fr)',
                gap:8
              }}>
                {SOURCES.map(src=>{
                  const SrcIcon = src.Icon;
                  const sel = form.source===src.id;
                  return (
                    <button key={src.id}
                      type='button'
                      onClick={()=>setForm({
                        ...form,
                        source:src.id})}
                      style={{
                        padding:'10px 4px',
                        borderRadius:12,
                        cursor:'pointer',
                        textAlign:'center',
                        border: sel
                          ?'2px solid #16A34A'
                          :'2px solid transparent',
                        backgroundColor: sel
                          ?'#F0FDF4':'var(--bg)'
                      }}>
                      <div style={{
                        display:'flex',
                        justifyContent:'center',
                        marginBottom:4
                      }}>
                        <SrcIcon size={20}
                          color={sel
                            ?'#16A34A':src.color}
                        />
                      </div>
                      <div style={{
                        fontSize:10, fontWeight:500,
                        color:sel
                          ?'#16A34A':src.color
                      }}>
                        {src.label}
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
              }}>Note (optionnel)</label>
              <input type='text' value={form.note}
                onChange={e=>setForm({
                  ...form,
                  note:e.target.value})}
                placeholder='Ex: Salaire Mars 2026'
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
                }}>Mois</label>
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
                }}>Année</label>
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
                  ?'#86EFAC':'#16A34A',
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
              {saving ? 'Enregistrement...' : <>
                <Check size={16} />
                Ajouter le revenu
              </>}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
