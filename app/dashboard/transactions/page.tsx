'use client';
import { useState, useEffect, useCallback }
  from 'react';
import api from '@/lib/api';
import {
  Plus, Edit2, Trash2, X, ShoppingBag,
  Car, Heart, ShoppingCart, Home,
  Smartphone, BookOpen, Package,
  TrendingDown, Check
} from 'lucide-react';

const CATS = [
  { id:'alimentation', label:'Alimentation',
    Icon:ShoppingBag, color:'#D97706',
    bg:'#FEF3E2' },
  { id:'transport', label:'Transport',
    Icon:Car, color:'#0A7B5E', bg:'#E8F5F1' },
  { id:'sante', label:'Santé',
    Icon:Heart, color:'#16A34A', bg:'#F0FDF4' },
  { id:'shopping', label:'Shopping',
    Icon:ShoppingCart, color:'#DB2777',
    bg:'#FDF2F8' },
  { id:'logement', label:'Logement',
    Icon:Home, color:'#2563EB', bg:'#EFF6FF' },
  { id:'telecom', label:'Télécom',
    Icon:Smartphone, color:'#0369A1',
    bg:'#F0F9FF' },
  { id:'education', label:'Éducation',
    Icon:BookOpen, color:'#CA8A04',
    bg:'#FEFCE8' },
  { id:'autre', label:'Autre',
    Icon:Package, color:'#6B7280',
    bg:'#F5F7F5' },
];

const OPS = [
  { id:'orange_money', label:'Orange Money',
    color:'#FF6600' },
  { id:'wave', label:'Wave',
    color:'#0088FF' },
  { id:'moov_money', label:'Moov Money',
    color:'#00AA44' },
  { id:'especes', label:'Espèces',
    color:'#8A94A6' },
];

const MONTHS = ['Janvier','Février','Mars',
  'Avril','Mai','Juin','Juillet','Août',
  'Septembre','Octobre','Novembre','Décembre'];

const fmt = (n:number) =>
  new Intl.NumberFormat('fr-FR').format(n||0)
  +' FCFA';

const getCat = (id:string) =>
  CATS.find(c=>c.id===id) || CATS[7];

export default function TransactionsPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [delId, setDelId] =
    useState<string|null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [month, setMonth] =
    useState(new Date().getMonth()+1);
  const [catFilter, setCatFilter] = useState('');
  const [form, setForm] = useState({
    amount:'', category:'alimentation',
    description:'', operator:'wave',
    date: new Date().toISOString().split('T')[0]
  });

  const showToast = (msg:string, err=false) => {
    setToast({msg,err});
    setTimeout(()=>setToast(null), 3000);
  };

  const load = useCallback(async()=>{
    setLoading(true);
    try {
      const p = new URLSearchParams();
      p.set('month', month.toString());
      if (catFilter) p.set('category', catFilter);
      const r = await api.get('/expenses?'+p);
      setExpenses(r.data.expenses || []);
    } catch(e) { console.error(e); }
    setLoading(false);
  }, [month, catFilter]);

  useEffect(()=>{ load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      amount:'', category:'alimentation',
      description:'', operator:'wave',
      date: new Date().toISOString().split('T')[0]
    });
    setDrawer(true);
  };

  const openEdit = (exp:any) => {
    setEditing(exp);
    setForm({
      amount: String(exp.amount),
      category: exp.category,
      description: exp.description||'',
      operator: exp.operator||'wave',
      date: (exp.date||'').split('T')[0]
    });
    setDrawer(true);
  };

  const save = async() => {
    if (!form.amount) {
      showToast('Montant requis', true); return;
    }
    setSaving(true);
    try {
      const id = editing?.id || editing?._id;
      const body = {
        ...form, amount: Number(form.amount)
      };
      if (editing) {
        await api.put('/expenses/'+id, body);
        showToast('Dépense modifiée');
      } else {
        await api.post('/expenses', body);
        showToast('Dépense ajoutée');
      }
      setDrawer(false);
      load();
    } catch(e:any) {
      showToast('Erreur: '+e.message, true);
    }
    setSaving(false);
  };

  const del = async() => {
    try {
      await api.delete('/expenses/'+delId);
      showToast('Supprimé');
      setDelId(null);
      load();
    } catch(e) {
      showToast('Erreur', true);
    }
  };

  const inp = {
    width:'100%', padding:'10px 14px',
    border:'1.5px solid #E2EAE7',
    borderRadius:10, fontSize:14, outline:'none',
    backgroundColor:'#FAFBFC', color:'#1A1D23',
    fontFamily:'DM Sans, sans-serif',
    boxSizing:'border-box' as const,
  };

  return (
    <div style={{
      padding:24, backgroundColor:'#F5F7F5',
      minHeight:'100vh',
      fontFamily:'DM Sans, sans-serif'
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', top:16, right:16,
          zIndex:9999, padding:'12px 20px',
          borderRadius:16, fontSize:14,
          fontWeight:500, color:'white',
          backgroundColor:toast.err
            ?'#F04438':'#00C48C',
          boxShadow:'0 4px 20px rgba(0,0,0,0.15)'
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        display:'flex', justifyContent:'space-between',
        alignItems:'center', marginBottom:24
      }}>
        <div>
          <h1 style={{
            fontSize:24, fontWeight:800,
            color:'#1A1D23', margin:0
          }}>
            Mes Dépenses
          </h1>
          <p style={{
            color:'#8A94A6', fontSize:14, marginTop:4
          }}>
            {expenses.length} transaction
            {expenses.length!==1?'s':''}
          </p>
        </div>
        <button onClick={openAdd} style={{
          display:'flex', alignItems:'center', gap:6,
          backgroundColor:'#0A7B5E', color:'white',
          border:'none', borderRadius:50,
          padding:'10px 20px', fontSize:14,
          fontWeight:600, cursor:'pointer',
          boxShadow:'0 4px 14px rgba(10,123,94,0.35)',
          fontFamily:'DM Sans, sans-serif'
        }}>
          <Plus size={16} />
          Nouvelle dépense
        </button>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor:'white', borderRadius:16,
        padding:14, marginBottom:16,
        display:'flex', gap:12, flexWrap:'wrap',
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
        <select value={catFilter}
          onChange={e=>setCatFilter(e.target.value)}
          style={{...inp, width:'auto',
            cursor:'pointer'}}>
          <option value=''>Toutes catégories</option>
          {CATS.map(c=>(
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div style={{
        backgroundColor:'white', borderRadius:16,
        overflow:'hidden',
        boxShadow:'0 1px 8px rgba(0,0,0,0.05)'
      }}>
        {loading ? (
          <div style={{
            padding:40, textAlign:'center',
            color:'#8A94A6'
          }}>
            Chargement...
          </div>
        ) : expenses.length===0 ? (
          <div style={{
            padding:60, textAlign:'center'
          }}>
            <div style={{
              width:64, height:64,
              borderRadius:'50%',
              backgroundColor:'#E8F5F1',
              display:'flex', alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 16px'
            }}>
              <TrendingDown size={28}
                color="#0A7B5E" />
            </div>
            <h3 style={{
              color:'#1A1D23', fontWeight:700,
              marginBottom:8
            }}>
              Aucune dépense
            </h3>
            <p style={{
              color:'#8A94A6', fontSize:14,
              marginBottom:20
            }}>
              Ajoutez votre première dépense
            </p>
            <button onClick={openAdd} style={{
              backgroundColor:'#0A7B5E',
              color:'white', border:'none',
              borderRadius:50, padding:'10px 20px',
              cursor:'pointer', fontSize:14,
              fontWeight:600,
              fontFamily:'DM Sans, sans-serif'
            }}>
              Ajouter
            </button>
          </div>
        ) : expenses.map((exp, i) => {
          const cat = getCat(exp.category);
          const CatIcon = cat.Icon;
          const id = exp.id || exp._id;
          return (
            <div key={id||i} style={{
              display:'flex', alignItems:'center',
              gap:14, padding:'14px 20px',
              borderBottom: i<expenses.length-1
                ?'1px solid #F0F2F8':'none',
              transition:'background 0.15s'
            }}
            onMouseEnter={e=>
              (e.currentTarget.style.backgroundColor
                ='#F5F7F5')}
            onMouseLeave={e=>
              (e.currentTarget.style.backgroundColor
                ='white')}>
              <div style={{
                width:42, height:42,
                borderRadius:12,
                backgroundColor:cat.bg,
                display:'flex', alignItems:'center',
                justifyContent:'center',
                flexShrink:0
              }}>
                <CatIcon size={18}
                  color={cat.color} />
              </div>
              <div style={{flex:1}}>
                <p style={{
                  fontWeight:600, fontSize:14,
                  color:'#1A1D23', margin:0
                }}>
                  {exp.description || cat.label}
                </p>
                <p style={{
                  color:'#8A94A6', fontSize:12,
                  margin:'2px 0 0'
                }}>
                  {new Date(exp.date)
                    .toLocaleDateString('fr-FR',{
                      day:'numeric',
                      month:'short',
                      year:'numeric'
                    })}
                </p>
              </div>
              <p style={{
                fontWeight:700, color:'#F04438',
                fontSize:15, margin:0
              }}>
                -{fmt(exp.amount)}
              </p>
              <div style={{
                display:'flex', gap:6
              }}>
                <button onClick={()=>openEdit(exp)}
                  style={{
                    width:32, height:32,
                    borderRadius:8, border:'none',
                    backgroundColor:'#E8F5F1',
                    cursor:'pointer',
                    display:'flex', alignItems:'center',
                    justifyContent:'center'
                  }}>
                  <Edit2 size={14}
                    color="#0A7B5E" />
                </button>
                <button onClick={()=>setDelId(id)}
                  style={{
                    width:32, height:32,
                    borderRadius:8, border:'none',
                    backgroundColor:'#FEF2F2',
                    cursor:'pointer',
                    display:'flex', alignItems:'center',
                    justifyContent:'center'
                  }}>
                  <Trash2 size={14}
                    color="#F04438" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawer && <>
        <div onClick={()=>setDrawer(false)} style={{
          position:'fixed', inset:0, zIndex:40,
          backgroundColor:'rgba(0,0,0,0.4)'
        }}/>
        <div style={{
          position:'fixed', right:0, top:0,
          height:'100%', width:'100%', maxWidth:420,
          backgroundColor:'white', zIndex:50,
          overflowY:'auto', padding:24,
          borderRadius:'20px 0 0 20px',
          boxShadow:'-4px 0 30px rgba(0,0,0,0.15)'
        }}>
          <div style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center', marginBottom:24
          }}>
            <h2 style={{
              fontSize:20, fontWeight:800,
              color:'#1A1D23', margin:0
            }}>
              {editing
                ?'Modifier la dépense'
                :'Nouvelle dépense'}
            </h2>
            <button onClick={()=>setDrawer(false)} style={{
              width:36, height:36,
              borderRadius:10, border:'none',
              backgroundColor:'#F5F7F5',
              cursor:'pointer',
              display:'flex', alignItems:'center',
              justifyContent:'center'
            }}>
              <X size={18} color="#8A94A6" />
            </button>
          </div>

          {/* Amount */}
          <div style={{marginBottom:20}}>
            <label style={{
              display:'block', fontSize:13,
              color:'#8A94A6', marginBottom:8
            }}>Montant</label>
            <div style={{position:'relative'}}>
              <input type='number' value={form.amount}
                onChange={e=>setForm({
                  ...form, amount:e.target.value})}
                placeholder='0'
                style={{
                  ...inp, textAlign:'center',
                  fontSize:38, fontWeight:800,
                  padding:'18px 60px 18px 20px',
                  border:'2px solid #E2EAE7',
                  borderRadius:16
                }}/>
              <span style={{
                position:'absolute', right:14,
                bottom:14, color:'#8A94A6',
                fontSize:12
              }}>FCFA</span>
            </div>
          </div>

          {/* Category */}
          <div style={{marginBottom:20}}>
            <label style={{
              display:'block', fontSize:13,
              color:'#8A94A6', marginBottom:10
            }}>Catégorie</label>
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
                        ?'#E8F5F1':cat.bg
                    }}>
                    <div style={{
                      display:'flex',
                      justifyContent:'center',
                      marginBottom:4
                    }}>
                      <CatIcon size={20}
                        color={sel
                          ?'#0A7B5E':cat.color}/>
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

          {/* Description */}
          <div style={{marginBottom:14}}>
            <label style={{
              display:'block', fontSize:13,
              color:'#8A94A6', marginBottom:6
            }}>Description (optionnel)</label>
            <input type='text'
              value={form.description}
              onChange={e=>setForm({
                ...form,
                description:e.target.value})}
              placeholder='Ex: Déjeuner au marché'
              style={inp}/>
          </div>

          {/* Date */}
          <div style={{marginBottom:14}}>
            <label style={{
              display:'block', fontSize:13,
              color:'#8A94A6', marginBottom:6
            }}>Date</label>
            <input type='date' value={form.date}
              onChange={e=>setForm({
                ...form, date:e.target.value})}
              style={inp}/>
          </div>

          {/* Operator */}
          <div style={{marginBottom:24}}>
            <label style={{
              display:'block', fontSize:13,
              color:'#8A94A6', marginBottom:10
            }}>Opérateur</label>
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(4,1fr)',
              gap:8
            }}>
              {OPS.map(op=>{
                const sel = form.operator===op.id;
                return (
                  <button key={op.id} type='button'
                    onClick={()=>setForm({
                      ...form, operator:op.id})}
                    style={{
                      padding:'8px 4px',
                      borderRadius:10,
                      cursor:'pointer',
                      textAlign:'center',
                      border: sel
                        ?'2px solid #0A7B5E'
                        :'1.5px solid #E2EAE7',
                      backgroundColor: sel
                        ?'#E8F5F1':'#FAFBFC'
                    }}>
                    <div style={{
                      width:12, height:12,
                      borderRadius:'50%',
                      backgroundColor:op.color,
                      margin:'0 auto 4px'
                    }}/>
                    <div style={{
                      fontSize:10, fontWeight:500,
                      color:sel
                        ?'#0A7B5E':'#8A94A6'
                    }}>
                      {op.label.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={save} disabled={saving}
            style={{
              width:'100%', padding:'14px',
              backgroundColor:saving
                ?'#7BBDAD':'#0A7B5E',
              color:'white', border:'none',
              borderRadius:50, fontSize:15,
              fontWeight:600,
              cursor:saving?'not-allowed':'pointer',
              fontFamily:'DM Sans, sans-serif',
              boxShadow:saving?'none'
                :'0 4px 14px rgba(10,123,94,0.35)',
              display:'flex', alignItems:'center',
              justifyContent:'center', gap:8
            }}>
            {saving ? 'Enregistrement...' : <>
              <Check size={16} />
              {editing
                ?'Modifier'
                :'Enregistrer la dépense'}
            </>}
          </button>
        </div>
      </>}

      {/* Delete modal */}
      {delId && <>
        <div style={{
          position:'fixed', inset:0, zIndex:40,
          backgroundColor:'rgba(0,0,0,0.4)'
        }}/>
        <div style={{
          position:'fixed', inset:0, zIndex:50,
          display:'flex', alignItems:'center',
          justifyContent:'center', padding:16
        }}>
          <div style={{
            backgroundColor:'white',
            borderRadius:24, padding:32,
            maxWidth:340, width:'100%',
            textAlign:'center'
          }}>
            <div style={{
              width:56, height:56,
              borderRadius:'50%',
              backgroundColor:'#FEF2F2',
              display:'flex', alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 16px'
            }}>
              <Trash2 size={24} color="#F04438" />
            </div>
            <h3 style={{
              fontWeight:700, color:'#1A1D23',
              marginBottom:8
            }}>
              Supprimer ?
            </h3>
            <p style={{
              color:'#8A94A6', fontSize:14,
              marginBottom:24
            }}>
              Cette action est irréversible.
            </p>
            <div style={{display:'flex', gap:10}}>
              <button
                onClick={()=>setDelId(null)}
                style={{
                  flex:1, padding:'12px',
                  backgroundColor:'#F5F7F5',
                  color:'#8A94A6', border:'none',
                  borderRadius:50, cursor:'pointer',
                  fontWeight:600,
                  fontFamily:'DM Sans, sans-serif'
                }}>
                Annuler
              </button>
              <button onClick={del} style={{
                flex:1, padding:'12px',
                backgroundColor:'#F04438',
                color:'white', border:'none',
                borderRadius:50, cursor:'pointer',
                fontWeight:600,
                fontFamily:'DM Sans, sans-serif'
              }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </>}
    </div>
  );
}
