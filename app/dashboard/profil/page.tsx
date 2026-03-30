'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import {
  User, Mail, Phone, Save,
  Edit2, Lock, Eye, EyeOff, Check,
  RefreshCw
} from 'lucide-react';

const OPERATORS = [
  { id:'orange_money', label:'Orange Money',
    color:'#FF6600' },
  { id:'wave', label:'Wave',
    color:'#0088FF' },
  { id:'moov_money', label:'Moov Money',
    color:'#00AA44' },
  { id:'other', label: 'Autre', // This will be translated in UI
    color:'var(--text-muted)' },
];

const inp = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #E2EAE7',
  borderRadius: 10, fontSize: 14,
  outline: 'none', color: 'var(--text-main)',
  backgroundColor: 'var(--bg-input)',
  fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box' as const,
};

export default function ProfilPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [operator, setOperator] =
    useState('other');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<any>(null);

  // Changement mot de passe
  const [showPwd, setShowPwd] = useState(false);
  const [currentPwd, setCurrentPwd] =
    useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] =
    useState('');
  const [showCurrentPwd, setShowCurrentPwd] =
    useState(false);
  const [showNewPwd, setShowNewPwd] =
    useState(false);
  const [savingPwd, setSavingPwd] =
    useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setUser(u);
        setName(u.name || '');
        setPhone(u.phone || '');
        setOperator(u.operator || 'other');
      } catch(e) {}
    }
  }, []);

  const showToast = (
    msg: string, err = false
  ) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3500);
  };

  const saveProfile = async () => {
    if (!name.trim()) {
      showToast(t('register.error_fields'), true);
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        name: name.trim(),
        phone: phone.trim(),
        operator,
      });
      const updated = {
        ...user,
        name: name.trim(),
        phone: phone.trim(),
        operator,
      };
      localStorage.setItem('user',
        JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      showToast(t('profile.save_success'));
    } catch(e: any) {
      showToast(
        e.response?.data?.message ||
        t('profile.save_error'),
        true
      );
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToast(t('register.error_fields'), true);
      return;
    }
    if (newPwd.length < 6) {
      showToast(t('register.error_password_length'),
        true);
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast(
        t('register.error_password_match'),
        true
      );
      return;
    }

    setSavingPwd(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5001/api';

      console.log('Changing password...');
      console.log('API URL:', apiUrl);

      const res = await fetch(
        `${apiUrl}/auth/change-password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: currentPwd,
            newPassword: newPwd,
          }),
        }
      );

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || t('profile.password_error')
        );
      }

      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
      setShowPwd(false);
      showToast(t('profile.password_success'));

    } catch(e: any) {
      console.error('changePassword error:', e);
      showToast(
        e.message || t('profile.password_error'),
        true
      );
    }
    setSavingPwd(false);
  };
  
  const refreshUserFromServer = async () => {
    try {
      showToast(t('profile.sync_start'));
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          showToast(t('profile.sync_success'));
          // Si le rôle a changé, on recharge pour mettre à jour le layout
          window.location.reload();
        }
      }
    } catch(e) {
      showToast(t('profile.sync_error'), true);
    }
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    return n.split(' ')
      .map(x => x[0]).join('')
      .toUpperCase().slice(0, 2);
  };

  return (
    <div style={{
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 16, right: 16, zIndex: 9999,
          padding: '12px 20px',
          borderRadius: 16, fontSize: 14,
          fontWeight: 500, color: 'var(--bg-card)',
          backgroundColor: toast.err
            ? '#F04438' : '#00C48C',
          boxShadow:
            '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 800,
          color: 'var(--text-main)', margin: 0,
        }}>
          {t('profile.title')}
        </h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: 14,
          marginTop: 4,
        }}>
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="profile-grid" style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: 20, alignItems: 'start',
      }}>

        {/* Avatar Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 20, padding: 28,
          textAlign: 'center',
          boxShadow:
            '0 1px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            backgroundColor: '#0A7B5E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--bg-card)', fontSize: 28,
            fontWeight: 800,
            margin: '0 auto 16px',
          }}>
            {getInitials(user?.name || '')}
          </div>
          <p style={{
            fontWeight: 700, fontSize: 17,
            color: 'var(--text-main)', margin: 0,
          }}>
            {user?.name || t('nav.greeting_default')}
          </p>
          <p style={{
            color: 'var(--text-muted)', fontSize: 13,
            margin: '4px 0 16px',
          }}>
            {user?.email || ''}
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center', gap: 6,
            backgroundColor: '#E8F5F1',
            color: '#0A7B5E',
            padding: '5px 14px',
            borderRadius: 50, fontSize: 12,
            fontWeight: 600,
          }}>
            <User size={13} />
            {user?.role === 'admin'
              ? t('profile.role_admin')
              : t('profile.role_user')}
          </div>
          
          <button
            onClick={refreshUserFromServer}
            style={{
              display: 'block',
              margin: '12px auto 0',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #E2EAE7',
              borderRadius: 8,
              fontSize: 11,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 600,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <RefreshCw size={11} /> {t('profile.sync_btn')}
            </div>
          </button>

          {user?.operator && (
            <div style={{
              marginTop: 16, padding: '10px',
              backgroundColor: 'var(--bg)',
              borderRadius: 12,
            }}>
              <p style={{
                fontSize: 11, color: 'var(--text-muted)',
                margin: '0 0 6px',
                fontWeight: 500,
              }}>
                {t('profile.operator_label')}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <div style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  backgroundColor:
                    OPERATORS.find(
                      o => o.id === user.operator
                    )?.color || 'var(--text-muted)',
                }} />
                <span style={{
                  fontSize: 13, fontWeight: 600,
                  color: 'var(--text-main)',
                }}>
                  {OPERATORS.find(
                    o => o.id === user.operator
                  )?.label === 'Autre' ? t('shared.autre') : (OPERATORS.find(
                    o => o.id === user.operator
                  )?.label || t('shared.autre'))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <div>
          {/* Infos personnelles */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 20, padding: 24,
            marginBottom: 16,
            boxShadow:
              '0 1px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <h2 style={{
                fontSize: 16, fontWeight: 700,
                color: 'var(--text-main)', margin: 0,
              }}>
                {t('profile.info_title')}
              </h2>
              {!editing ? (
                <button
                  onClick={() =>
                    setEditing(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center', gap: 6,
                    padding: '7px 14px',
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: '#E8F5F1',
                    color: '#0A7B5E',
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: 500,
                    fontFamily:
                      'DM Sans, sans-serif',
                  }}>
                  <Edit2 size={13} />
                  {t('shared.edit')}
                </button>
              ) : (
                <div style={{
                  display: 'flex', gap: 8,
                }}>
                  <button onClick={saveProfile}
                    disabled={saving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: saving
                        ? '#7BBDAD' : '#0A7B5E',
                      color: 'var(--bg-card)',
                      cursor: saving
                        ? 'not-allowed'
                        : 'pointer',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily:
                        'DM Sans, sans-serif',
                    }}>
                    <Save size={13} />
                    {saving
                      ? t('shared.saving')
                      : t('shared.save')}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user?.name || '');
                      setPhone(
                        user?.phone || '');
                      setOperator(
                        user?.operator || 'other');
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily:
                        'DM Sans, sans-serif',
                    }}>
                    {t('shared.cancel')}
                  </button>
                </div>
              )}
            </div>

            {/* Nom */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-main)', marginBottom: 6,
              }}>
                {t('profile.name_label')}
              </label>
              <div style={{
                position: 'relative',
              }}>
                <User size={16} color="#8A94A6"
                  style={{
                    position: 'absolute',
                    left: 12, top: '50%',
                    transform:
                      'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                <input type="text" value={name}
                  onChange={e =>
                    setName(e.target.value)}
                  disabled={!editing}
                  style={{
                    ...inp,
                    paddingLeft: 38,
                    backgroundColor: editing
                      ? 'var(--bg-input)' : 'var(--bg)',
                  }} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-main)', marginBottom: 6,
              }}>
                {t('login.email_label')}
              </label>
              <div style={{
                position: 'relative',
              }}>
                <Mail size={16} color="#8A94A6"
                  style={{
                    position: 'absolute',
                    left: 12, top: '50%',
                    transform:
                      'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                <input type="email"
                  value={user?.email || ''}
                  disabled
                  style={{
                    ...inp,
                    paddingLeft: 38,
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text-muted)',
                  }} />
              </div>
              <p style={{
                fontSize: 11, color: 'var(--text-muted)',
                margin: '4px 0 0',
              }}>
                {t('profile.email_no_edit')}
              </p>
            </div>

            {/* Téléphone */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-main)', marginBottom: 6,
              }}>
                {t('profile.phone_label')}
              </label>
              <div style={{
                position: 'relative',
              }}>
                <Phone size={16} color="#8A94A6"
                  style={{
                    position: 'absolute',
                    left: 12, top: '50%',
                    transform:
                      'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                <input type="tel" value={phone}
                  onChange={e =>
                    setPhone(e.target.value)}
                  disabled={!editing}
                  placeholder="+226 XX XX XX XX"
                  style={{
                    ...inp,
                    paddingLeft: 38,
                    backgroundColor: editing
                      ? 'var(--bg-input)' : 'var(--bg)',
                  }} />
              </div>
            </div>

            {/* Opérateur */}
            {editing && (
              <div>
                <label style={{
                  display: 'block', fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-main)',
                  marginBottom: 10,
                }}>
                  {t('register.operator_label')}
                </label>
                <div style={{
                  display: 'flex',
                  gap: 8, flexWrap: 'wrap',
                }}>
                  {OPERATORS.map(op => {
                    const sel =
                      operator === op.id;
                    return (
                      <button key={op.id}
                        type="button"
                        onClick={() =>
                          setOperator(op.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 16px',
                          borderRadius: 50,
                          border: sel
                            ? `2px solid ${op.color}`
                            : '1.5px solid #E2EAE7',
                          backgroundColor: sel
                            ? op.color + '15'
                            : 'var(--bg-input)',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: sel ? 600 : 400,
                          color: sel
                            ? op.color : 'var(--text-muted)',
                          fontFamily:
                            'DM Sans, sans-serif',
                        }}>
                        <div style={{
                          width: 10, height: 10,
                          borderRadius: '50%',
                          backgroundColor:
                            op.color,
                          flexShrink: 0,
                        }} />
                        {op.label === 'Autre' ? t('shared.autre') : op.label}
                        {sel && (
                          <Check size={13}
                            color={op.color} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Changement mot de passe */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 20, padding: 24,
            boxShadow:
              '0 1px 8px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showPwd ? 20 : 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: 10,
                  backgroundColor: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Lock size={18}
                    color="#16A34A" />
                </div>
                <div>
                  <p style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--text-main)', margin: 0,
                  }}>
                    {t('profile.password_section')}
                  </p>
                  <p style={{
                    fontSize: 12,
                    color: 'var(--text-muted)', margin: 0,
                  }}>
                    {t('profile.password_desc')}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setShowPwd(!showPwd)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 10, border: 'none',
                  backgroundColor: showPwd
                    ? 'var(--bg)' : '#E8F5F1',
                  color: showPwd
                    ? 'var(--text-muted)' : '#0A7B5E',
                  cursor: 'pointer',
                  fontSize: 13, fontWeight: 500,
                  fontFamily:
                    'DM Sans, sans-serif',
                }}>
                {showPwd ? t('shared.cancel') : t('shared.edit')}
              </button>
            </div>

            {showPwd && (
              <div>
                {/* Mot de passe actuel */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13, fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: 6,
                  }}>
                    {t('profile.current_password')}
                  </label>
                  <div style={{
                    position: 'relative',
                  }}>
                    <input
                      type={showCurrentPwd
                        ? 'text' : 'password'}
                      value={currentPwd}
                      onChange={e =>
                        setCurrentPwd(
                          e.target.value)}
                      placeholder="••••••••"
                      style={{
                        ...inp,
                        paddingRight: 44,
                      }} />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPwd(
                          !showCurrentPwd)}
                      style={{
                        position: 'absolute',
                        right: 12, top: '50%',
                        transform:
                          'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                      }}>
                      {showCurrentPwd
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13, fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: 6,
                  }}>
                    {t('profile.new_password')}
                  </label>
                  <div style={{
                    position: 'relative',
                  }}>
                    <input
                      type={showNewPwd
                        ? 'text' : 'password'}
                      value={newPwd}
                      onChange={e =>
                        setNewPwd(e.target.value)}
                      placeholder={t('profile.password_min_length')}
                      style={{
                        ...inp,
                        paddingRight: 44,
                      }} />
                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPwd(!showNewPwd)}
                      style={{
                        position: 'absolute',
                        right: 12, top: '50%',
                        transform:
                          'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                      }}>
                      {showNewPwd
                        ? <EyeOff size={16} />
                        : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirmer */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13, fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: 6,
                  }}>
                    {t('profile.confirm_new_password')}
                  </label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={e =>
                      setConfirmPwd(e.target.value)}
                    placeholder="••••••••"
                    style={inp} />
                  {confirmPwd && newPwd &&
                    confirmPwd !== newPwd && (
                    <p style={{
                      fontSize: 12,
                      color: '#F04438',
                      margin: '4px 0 0',
                    }}>
                      {t('profile.password_match_error')}
                    </p>
                  )}
                </div>

                <button
                  onClick={changePassword}
                  disabled={savingPwd}
                  style={{
                    display: 'flex',
                    alignItems: 'center', gap: 6,
                    padding: '10px 24px',
                    borderRadius: 50, border: 'none',
                    backgroundColor: savingPwd
                      ? '#7BBDAD' : '#0A7B5E',
                    color: 'var(--bg-card)',
                    cursor: savingPwd
                      ? 'not-allowed' : 'pointer',
                    fontSize: 14, fontWeight: 600,
                    fontFamily:
                      'DM Sans, sans-serif',
                  }}>
                  <Lock size={14} />
                  {savingPwd
                    ? t('shared.saving')
                    : t('profile.password_change_btn')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
