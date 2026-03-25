'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Users, UserPlus, Shield, Trash2, 
  Search, Filter, MoreHorizontal,
  ArrowRight, BarChart
} from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n || 0);

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, sRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setUsers(uRes.data.users || []);
      setStats(sRes.data.data || null);
    } catch (err) {
      console.error('Admin load error:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      loadData(); // Refresh stats
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
    setDeleting(null);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        Chargement de l'administration...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Gestion globale de la plateforme MoneyFlow
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: 16, marginBottom: 24 
      }}>
        <div style={{ 
          backgroundColor: 'var(--bg-card)', padding: 20, borderRadius: 16,
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Users size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Utilisateurs totaux</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {stats?.totalUsers || users.length}
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--bg-card)', padding: 20, borderRadius: 16,
          boxShadow: '0 1px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, backgroundColor: '#FEF3DC',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={24} color="#F5A623" />
          </div>
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Administrateurs</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Control */}
      <div style={{ 
        backgroundColor: 'var(--bg-card)', borderRadius: 20, padding: 24,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: 20, flexWrap: 'wrap', gap: 16
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Liste des utilisateurs
          </h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
                border: '1.5px solid var(--border)', fontSize: 14, outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Utilisateur</th>
                <th style={{ padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rôle</th>
                <th style={{ padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inscrit le</th>
                <th style={{ padding: '12px 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 36, height: 36, borderRadius: '50%', backgroundColor: u.role === 'admin' ? '#E8F5F1' : 'var(--bg-sub)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)'
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 10px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      backgroundColor: u.role === 'admin' ? '#E8F5F1' : 'var(--bg-sub)',
                      color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)'
                    }}>
                      {u.role === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 10px', fontSize: 14, color: 'var(--text-main)' }}>
                    {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '16px 10px', textAlign: 'right' }}>
                    <button 
                      onClick={() => handleDelete(u._id)}
                      disabled={u.role === 'admin' || deleting === u._id}
                      style={{ 
                        padding: 8, borderRadius: 8, border: 'none', backgroundColor: 'transparent', 
                        cursor: u.role === 'admin' ? 'not-allowed' : 'pointer', color: u.role === 'admin' ? '#E2EAE7' : '#F04438'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
