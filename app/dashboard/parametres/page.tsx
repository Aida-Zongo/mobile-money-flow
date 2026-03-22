'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Shield, Globe, Moon, Sun,
  ChevronRight, Trash2, AlertTriangle,
  Check, Lock, Star, HelpCircle,
  MessageCircle, Info, FileText
} from 'lucide-react';
import { setTheme as applyGlobalTheme, Theme } from '@/lib/theme';
import { useLanguage } from '@/lib/LanguageContext';

const WeeklyReport = () => {
  const [report, setReport] =
    useState<any>(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const token =
          localStorage.getItem('token');
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [statsRes, expensesRes] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/stats/summary?month=${month}&year=${year}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/expenses?month=${month}&year=${year}`,
              { headers: { Authorization: `Bearer ${token}` } }
            ),
          ]);

        const stats = await statsRes.json();
        const expenses = await expensesRes.json();

        // Calcule les dépenses de cette semaine
        const startOfWeek = new Date();
        startOfWeek.setDate(
          startOfWeek.getDate() -
          startOfWeek.getDay()
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const weekExpenses = (
          expenses.expenses || []
        ).filter((e: any) =>
          new Date(e.date) >= startOfWeek
        );

        const weekTotal = weekExpenses.reduce(
          (sum: number, e: any) =>
            sum + e.amount, 0
        );

        setReport({
          monthTotal: stats.totalMonth || 0,
          monthCount: stats.totalCount || 0,
          weekTotal,
          weekCount: weekExpenses.length,
          topCategory: stats.topCategory,
          budgetUsed: stats.budgetUsedPercent,
        });
      } catch(e) {
        console.error(e);
      }
      setLoading(false);
    };

    loadReport();
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR').format(n)
    + ' FCFA';

  if (loading) {
    return (
      <div style={{
        margin: '0 20px 16px',
        padding: 14,
        backgroundColor: 'var(--bg)',
        borderRadius: 12,
        fontSize: 13,
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        Chargement du rapport...
      </div>
    );
  }

  if (!report) return null;

  return (
    <div style={{
      margin: '0 20px 16px',
      padding: 16,
      backgroundColor: 'var(--bg)',
      borderRadius: 14,
      border: '1px solid var(--border)',
    }}>
      <p style={{
        fontSize: 12, fontWeight: 700,
        color: '#0A7B5E', margin: '0 0 12px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        📊 Rapport de la semaine
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8, marginBottom: 12,
      }}>
        {[
          {
            label: 'Cette semaine',
            val: fmt(report.weekTotal),
            sub: `${report.weekCount} transactions`,
            color: '#F04438',
          },
          {
            label: 'Ce mois',
            val: fmt(report.monthTotal),
            sub: `${report.monthCount} transactions`,
            color: '#0A7B5E',
          },
        ].map((item, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 10, padding: 12,
          }}>
            <p style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              margin: '0 0 4px',
            }}>
              {item.label}
            </p>
            <p style={{
              fontSize: 15, fontWeight: 700,
              color: item.color, margin: 0,
            }}>
              {item.val}
            </p>
            <p style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              margin: '2px 0 0',
            }}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {report.topCategory && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 10, marginBottom: 8,
        }}>
          <span style={{
            fontSize: 13,
            color: 'var(--text-muted)',
          }}>
            Top catégorie
          </span>
          <span style={{
            fontSize: 13, fontWeight: 600,
            color: '#F5A623',
          }}>
            {report.topCategory}
          </span>
        </div>
      )}

      {report.budgetUsed > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor:
            report.budgetUsed >= 90
              ? '#FEF2F2' : '#E8F5F1',
          borderRadius: 10,
        }}>
          <span style={{
            fontSize: 13,
            color: report.budgetUsed >= 90
              ? '#F04438' : '#0A7B5E',
          }}>
            Budget utilisé
          </span>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: report.budgetUsed >= 90
              ? '#F04438' : '#0A7B5E',
          }}>
            {report.budgetUsed}%
          </span>
        </div>
      )}
    </div>
  );
};

export default function ParametresPage() {
  const { t, setLang: setGlobalLang } = useLanguage();
  const router = useRouter();

  const [budgetAlert, setBudgetAlert] =
    useState(true);
  const [weeklyReport, setWeeklyReport] =
    useState(false);
  const [theme, setTheme] =
    useState<'light'|'dark'|'system'>('light');
  const [lang, setLang] = useState('fr');
  const [currency, setCurrency] =
    useState('FCFA');
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);
  const [showLangModal, setShowLangModal] =
    useState(false);
  const [showCurrencyModal, setShowCurrencyModal] =
    useState(false);
  const [showThemeModal, setShowThemeModal] =
    useState(false);
  const [deleting, setDeleting] =
    useState(false);
  const [toast, setToast] = useState<any>(null);

  const [showRatingModal, setShowRatingModal] =
    useState(false);
  const [appRating, setAppRating] = useState(0);
  const [hoverRating, setHoverRating] =
    useState(0);
  const [ratingComment, setRatingComment] =
    useState('');
  const [ratingSubmitted, setRatingSubmitted] =
    useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(
        localStorage.getItem('mf_prefs') || '{}'
      );
      if (p.budgetAlert !== undefined)
        setBudgetAlert(p.budgetAlert);
      if (p.weeklyReport !== undefined)
        setWeeklyReport(p.weeklyReport);
      if (p.theme) setTheme(p.theme);
      if (p.lang) setLang(p.lang);
      if (p.currency) setCurrency(p.currency);
    } catch(e) {}
  }, []);

  const save = (updates: any) => {
    const p = JSON.parse(
      localStorage.getItem('mf_prefs') || '{}'
    );
    localStorage.setItem(
      'mf_prefs',
      JSON.stringify({ ...p, ...updates })
    );
  };

  const showToast = (
    msg: string, err = false
  ) => {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 3000);
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const token =
        localStorage.getItem('token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL
          || 'http://localhost:5001/api'
        }/auth/account`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.ok) {
        localStorage.clear();
        document.cookie =
          'token=; path=/; max-age=0';
        window.location.href = '/login';
      } else {
        throw new Error('Erreur serveur');
      }
    } catch(e) {
      showToast(
        'Erreur lors de la suppression', true
      );
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const languages = [
    { code: 'fr', label: 'Français',
      flag: '🇫🇷' },
    { code: 'en', label: 'English',
      flag: '🇬🇧' },
    { code: 'moore', label: 'Mooré',
      flag: '🇧🇫' },
    { code: 'dioula', label: 'Dioula',
      flag: '🇧🇫' },
  ];

  const currencies = [
    { code: 'FCFA',
      label: 'Franc CFA (FCFA)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'USD', label: 'Dollar ($)' },
  ];

  const themes = [
    { code: 'light', label: 'Clair',
      icon: Sun, desc: 'Fond blanc' },
    { code: 'dark', label: 'Sombre',
      icon: Moon, desc: 'Fond sombre' },
    { code: 'system', label: 'Automatique',
      icon: Globe,
      desc: 'Suit votre appareil' },
  ];

  const Toggle = ({
    value,
    onChange
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 50, height: 28,
        borderRadius: 50,
        backgroundColor: value
          ? '#0A7B5E' : 'var(--border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}>
      <div style={{
        width: 24, height: 24,
        borderRadius: '50%',
        backgroundColor: 'var(--bg-card)',
        position: 'absolute',
        top: 2,
        left: value ? 24 : 2,
        transition: 'left 0.2s',
        boxShadow:
          '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </div>
  );

  const Section = ({
    title,
    children,
    danger = false
  }: any) => (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: 20, marginBottom: 16,
      overflow: 'hidden',
      border: danger
        ? '1.5px solid #FEE2E2' : 'none',
      boxShadow:
        '0 1px 8px rgba(0,0,0,0.05)',
    }}>
      <p style={{
        fontSize: 11, fontWeight: 700,
        color: danger ? '#F04438' : 'var(--text-muted)',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: '14px 20px 10px',
        borderBottom: danger
          ? '1px solid #FEE2E2'
          : '1px solid var(--border)',
        backgroundColor: danger
          ? '#FEF2F2' : 'var(--bg-card)',
      }}>
        {title}
      </p>
      {children}
    </div>
  );

  const Row = ({
    icon: Icon,
    iconBg,
    iconColor,
    label,
    desc,
    right,
    onClick,
    last = false,
    danger = false,
  }: any) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center', gap: 14,
        padding: '15px 20px',
        cursor: onClick ? 'pointer' : 'default',
        borderBottom: last
          ? 'none' : '1px solid #F5F7F5',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => {
        if (onClick)
          (e.currentTarget as HTMLElement)
            .style.backgroundColor = 'var(--bg-input)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement)
          .style.backgroundColor = 'var(--bg-card)';
      }}>
      <div style={{
        width: 40, height: 40,
        borderRadius: 12,
        backgroundColor: iconBg,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 14, fontWeight: 500,
          color: danger ? '#F04438' : 'var(--text-main)',
          margin: 0,
        }}>
          {label}
        </p>
        {desc && (
          <p style={{
            fontSize: 12, color: 'var(--text-muted)',
            margin: '2px 0 0',
          }}>
            {desc}
          </p>
        )}
      </div>
      {right}
    </div>
  );

  const Modal = ({
    show,
    onClose,
    title,
    children
  }: any) => {
    if (!show) return null;
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }} />
        <div style={{
          position: 'fixed', inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 24, padding: 24,
            maxWidth: 400, width: '100%',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            {title && (
              <h3 style={{
                fontSize: 17, fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: 16,
              }}>
                {title}
              </h3>
            )}
            {children}
          </div>
        </div>
      </>
    );
  };

  const ChoiceItem = ({
    selected,
    onClick,
    left,
    label,
    desc,
  }: any) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center', gap: 14,
        padding: '14px',
        borderRadius: 14, cursor: 'pointer',
        marginBottom: 8,
        backgroundColor: selected
          ? '#E8F5F1' : 'var(--bg)',
        border: selected
          ? '1.5px solid #0A7B5E'
          : '1.5px solid transparent',
        transition: 'all 0.15s',
      }}>
      {left}
      <div style={{ flex: 1 }}>
        <p style={{
          fontWeight: selected ? 600 : 400,
          fontSize: 14,
          color: selected
            ? '#0A7B5E' : 'var(--text-main)',
          margin: 0,
        }}>
          {label}
        </p>
        {desc && (
          <p style={{
            fontSize: 12, color: 'var(--text-muted)',
            margin: '2px 0 0',
          }}>
            {desc}
          </p>
        )}
      </div>
      {selected && (
        <Check size={18} color="#0A7B5E" />
      )}
    </div>
  );

  return (
    <div style={{
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* Toast */}
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

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 24, fontWeight: 800,
          color: 'var(--text-main)', margin: 0,
        }}>
          Paramètres
        </h1>
        <p style={{
          color: 'var(--text-muted)', fontSize: 14,
          marginTop: 4,
        }}>
          {t("settings.subtitle")}
        </p>
      </div>

      {/* NOTIFICATIONS */}
      <Section title={t("settings.notifications")}>
        <Row
          icon={Bell}
          iconBg="#FFFBEB"
          iconColor="#F5A623"
          label={t("settings.budget_alerts")}
          desc={t("settings.budget_alerts_desc")}
          right={
            <Toggle
              value={budgetAlert}
              onChange={v => {
                setBudgetAlert(v);
                save({ budgetAlert: v });
                showToast(v
                  ? 'Alertes activées'
                  : 'Alertes désactivées');
              }}
            />
          }
        />
        <Row
          icon={FileText}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          label={t("settings.weekly")}
          desc={t("settings.weekly_desc")}
          last
          right={
            <Toggle
              value={weeklyReport}
              onChange={v => {
                setWeeklyReport(v);
                save({ weeklyReport: v });
                showToast(v
                  ? 'Rapport activé'
                  : 'Rapport désactivé');
              }}
            />
          }
        />
        {weeklyReport && (
          <WeeklyReport />
        )}
      </Section>

      {/* APPARENCE */}
      <Section title={t("settings.appearance")}>
        <Row
          icon={theme === 'dark'
            ? Moon : Sun}
          iconBg="#F3F0FF"
          iconColor="#8B5CF6"
          label={t("settings.theme")}
          desc={
            themes.find(t =>
              t.code === theme
            )?.label || 'Clair'
          }
          onClick={() =>
            setShowThemeModal(true)}
          last
          right={
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 13,
                color: 'var(--text-muted)',
              }}>
                {themes.find(t =>
                  t.code === theme
                )?.label}
              </span>
              <ChevronRight size={16}
                color="#8A94A6" />
            </div>
          }
        />
      </Section>

      {/* LANGUE ET RÉGION */}
      <Section title={t("settings.lang_region")}>
        <Row
          icon={Globe}
          iconBg="#E8F5F1"
          iconColor="#0A7B5E"
          label={t("settings.language")}
          desc={
            languages.find(l =>
              l.code === lang
            )?.label || 'Français'
          }
          onClick={() =>
            setShowLangModal(true)}
          right={
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 20
              }}>
                {languages.find(l =>
                  l.code === lang
                )?.flag}
              </span>
              <ChevronRight size={16}
                color="#8A94A6" />
            </div>
          }
        />
        <Row
          icon={FileText}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          label={t("settings.currency")}
          desc={
            currencies.find(c =>
              c.code === currency
            )?.label || 'FCFA'
          }
          onClick={() =>
            setShowCurrencyModal(true)}
          last
          right={
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 13, fontWeight: 600,
                color: '#0A7B5E',
              }}>
                {currency}
              </span>
              <ChevronRight size={16}
                color="#8A94A6" />
            </div>
          }
        />
      </Section>

      {/* SÉCURITÉ */}
      <Section title={t("settings.security")}>
        <Row
          icon={Lock}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          label={t("settings.change_pwd")}
          desc={t("settings.change_pwd_desc")}
          onClick={() =>
            router.push('/dashboard/profil')}
          last
          right={
            <ChevronRight size={16}
              color="#8A94A6" />
          }
        />
      </Section>

      {/* SUPPORT */}
      <Section title={t("settings.support")}>
        <Row
          icon={HelpCircle}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          label={t("settings.help")}
          desc={t("settings.help_desc")}
          onClick={() =>
            router.push('/dashboard/aide')}
          right={
            <ChevronRight size={16}
              color="#8A94A6" />
          }
        />
        <Row
          icon={MessageCircle}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          label={t("settings.contact")}
          desc="aida04zng@gmail.com"
          onClick={() =>
            window.open(
              'mailto:aida04zng@gmail.com?subject=Contact MoneyFlow&body=Bonjour,',
              '_blank'
            )}
          right={
            <ChevronRight size={16}
              color="#8A94A6" />
          }
        />
        <Row
          icon={Star}
          iconBg="#FFFBEB"
          iconColor="#F5A623"
          label={t("settings.rate")}
          desc={t("settings.rate_desc")}
          onClick={() => setShowRatingModal(true)}
          last
          right={
            <ChevronRight size={16}
              color="#8A94A6" />
          }
        />
      </Section>

      {/* À PROPOS */}
      <Section title={t("settings.about")}>
        <Row
          icon={Info}
          iconBg="#E8F5F1"
          iconColor="#0A7B5E"
          label="MoneyFlow v1.0.0"
          desc="Fait avec ❤️ au Burkina Faso"
          last
          right={
            <span style={{
              fontSize: 12,
              color: 'var(--text-muted)',
            }}>
              2026
            </span>
          }
        />
      </Section>

      {/* ZONE DANGEREUSE */}
      <Section title={t("settings.danger")}
        danger>
        <Row
          icon={Trash2}
          iconBg="#FEF2F2"
          iconColor="#F04438"
          label={t("settings.delete")}
          desc={t("settings.delete_desc")}
          danger
          onClick={() =>
            setShowDeleteModal(true)}
          last
          right={
            <ChevronRight size={16}
              color="#F04438" />
          }
        />
      </Section>

      {/* MODAL THÈME */}
      <Modal
        show={showThemeModal}
        onClose={() =>
          setShowThemeModal(false)}
        title="Choisir le thème">
        {themes.map(t => {
          const Icon = t.icon;
          return (
            <ChoiceItem
              key={t.code}
              selected={theme === t.code}
              onClick={() => {
                setTheme(
                  t.code as typeof theme
                );
                applyGlobalTheme(t.code as Theme);
                save({ theme: t.code });
                setShowThemeModal(false);
                showToast(
                  `Thème "${t.label}" sélectionné`
                );
              }}
              left={
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  backgroundColor:
                    theme === t.code
                      ? '#0A7B5E' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                }}>
                  <Icon size={20}
                    color={theme === t.code
                      ? 'var(--bg-card)' : 'var(--text-muted)'} />
                </div>
              }
              label={t.label}
              desc={t.desc}
            />
          );
        })}
      </Modal>

      {/* MODAL LANGUE */}
      <Modal
        show={showLangModal}
        onClose={() =>
          setShowLangModal(false)}
        title="Choisir la langue">
        {languages.map(l => (
          <ChoiceItem
            key={l.code}
            selected={lang === l.code}
            onClick={() => {
              setLang(l.code);
              setGlobalLang(l.code);
              save({ lang: l.code });
              setShowLangModal(false);
              showToast(
                `Langue : ${l.label}`
              );
            }}
            left={
              <span style={{ fontSize: 28 }}>
                {l.flag}
              </span>
            }
            label={l.label}
          />
        ))}
      </Modal>

      {/* MODAL DEVISE */}
      <Modal
        show={showCurrencyModal}
        onClose={() =>
          setShowCurrencyModal(false)}
        title="Choisir la devise">
        {currencies.map(c => (
          <ChoiceItem
            key={c.code}
            selected={currency === c.code}
            onClick={() => {
              setCurrency(c.code);
              save({ currency: c.code });
              setShowCurrencyModal(false);
              showToast(
                `Devise : ${c.label}`
              );
            }}
            left={
              <div style={{
                width: 40, height: 40,
                borderRadius: 12,
                backgroundColor:
                  currency === c.code
                    ? '#E8F5F1' : 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: currency === c.code
                  ? '#0A7B5E' : 'var(--text-muted)',
                fontSize: 13,
              }}>
                {c.code}
              </div>
            }
            label={c.label}
          />
        ))}
      </Modal>

      {/* MODAL SUPPRESSION */}
      <Modal
        show={showDeleteModal}
        onClose={() =>
          setShowDeleteModal(false)}
        title="">
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            backgroundColor: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <AlertTriangle size={30}
              color="#F04438" />
          </div>
          <h3 style={{
            fontSize: 18, fontWeight: 800,
            color: 'var(--text-main)', marginBottom: 8,
          }}>
            Supprimer le compte ?
          </h3>
          <p style={{
            color: 'var(--text-muted)', fontSize: 14,
            lineHeight: 1.6, marginBottom: 24,
          }}>
            Toutes vos dépenses, budgets et
            revenus seront définitivement
            supprimés. Cette action ne peut
            pas être annulée.
          </p>
          <div style={{
            display: 'flex', gap: 10,
          }}>
            <button
              onClick={() =>
                setShowDeleteModal(false)}
              style={{
                flex: 1, padding: '13px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-muted)', border: 'none',
                borderRadius: 50,
                cursor: 'pointer',
                fontWeight: 600, fontSize: 14,
                fontFamily:
                  'DM Sans, sans-serif',
              }}>
              Annuler
            </button>
            <button
              onClick={deleteAccount}
              disabled={deleting}
              style={{
                flex: 1, padding: '13px',
                backgroundColor: deleting
                  ? '#FCA5A5' : '#F04438',
                color: 'var(--bg-card)', border: 'none',
                borderRadius: 50,
                cursor: deleting
                  ? 'not-allowed' : 'pointer',
                fontWeight: 600, fontSize: 14,
                fontFamily:
                  'DM Sans, sans-serif',
              }}>
              {deleting
                ? 'Suppression...'
                : 'Confirmer'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL NOTATION */}
      <Modal
        show={showRatingModal}
        onClose={() => {
          if (!ratingSubmitted) {
            setShowRatingModal(false);
          }
        }}
        title="">

        {ratingSubmitted ? (
          // Écran succès
          <div style={{
            textAlign: 'center', padding: '8px 0',
          }}>
            <div style={{
              fontSize: 56, marginBottom: 12,
              lineHeight: 1,
            }}>
              🎉
            </div>
            <h3 style={{
              fontSize: 20, fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: 8,
            }}>
              Merci beaucoup !
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 14, lineHeight: 1.6,
              marginBottom: 20,
            }}>
              Votre avis nous aide à améliorer
              MoneyFlow pour toute la communauté.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center', gap: 4,
              marginBottom: 20,
            }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  fontSize: 28,
                  opacity: i <= appRating ? 1 : 0.3,
                }}>
                  ⭐
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowRatingModal(false);
                setRatingSubmitted(false);
                setAppRating(0);
                setRatingComment('');
              }}
              style={{
                padding: '11px 28px',
                backgroundColor: '#0A7B5E',
                color: 'white', border: 'none',
                borderRadius: 50, fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow:
                  '0 4px 14px rgba(10,123,94,0.3)',
              }}>
              Fermer
            </button>
          </div>
        ) : (
          // Formulaire notation
          <div>
            <div style={{
              textAlign: 'center', marginBottom: 20,
            }}>
              {/* Logo app */}
              <div style={{
                width: 64, height: 64,
                borderRadius: 18,
                backgroundColor: '#0A7B5E',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                fontWeight: 800, color: 'white',
                fontSize: 22,
              }}>
                MF
              </div>
              <h3 style={{
                fontSize: 18, fontWeight: 800,
                color: 'var(--text-main)',
                marginBottom: 4,
              }}>
                Noter MoneyFlow
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: 13,
              }}>
                Votre avis compte vraiment pour nous
              </p>
            </div>

            {/* Étoiles */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8, marginBottom: 12,
            }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setAppRating(star)}
                  onMouseEnter={() =>
                    setHoverRating(star)}
                  onMouseLeave={() =>
                    setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 40,
                    transform:
                      (hoverRating || appRating)
                      >= star
                        ? 'scale(1.2)'
                        : 'scale(1)',
                    transition: 'transform 0.15s',
                    opacity:
                      (hoverRating || appRating)
                      >= star ? 1 : 0.25,
                    filter:
                      (hoverRating || appRating)
                      >= star
                        ? 'none'
                        : 'grayscale(100%)',
                    padding: 0,
                  }}>
                  ⭐
                </button>
              ))}
            </div>

            {/* Label de la note */}
            <p style={{
              textAlign: 'center', fontSize: 14,
              fontWeight: 600, marginBottom: 16,
              color: '#0A7B5E', minHeight: 20,
            }}>
              {(hoverRating || appRating) === 1 &&
                'Mauvais'}
              {(hoverRating || appRating) === 2 &&
                'Passable'}
              {(hoverRating || appRating) === 3 &&
                'Bien'}
              {(hoverRating || appRating) === 4 &&
                'Très bien !'}
              {(hoverRating || appRating) === 5 &&
                'Excellent ! 🚀'}
            </p>

            {/* Commentaire */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-main)',
                marginBottom: 6,
              }}>
                Commentaire (optionnel)
              </label>
              <textarea
                value={ratingComment}
                onChange={e => setRatingComment(
                  e.target.value.slice(0, 200)
                )}
                placeholder="Qu'est-ce que vous aimez ? Qu'est-ce qu'on peut améliorer ?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 12, fontSize: 14,
                  outline: 'none', resize: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{
                textAlign: 'right', fontSize: 11,
                color: 'var(--text-muted)',
                margin: '3px 0 0',
              }}>
                {ratingComment.length}/200
              </p>
            </div>

            {/* Boutons */}
            <div style={{
              display: 'flex', gap: 10,
            }}>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setAppRating(0);
                }}
                style={{
                  flex: 1, padding: '12px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text-muted)',
                  border: 'none', borderRadius: 50,
                  cursor: 'pointer', fontSize: 14,
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (appRating === 0) {
                    showToast('Choisissez une note', true);
                    return;
                  }

                  try {
                    const token =
                      localStorage.getItem('token');
                    const userData = JSON.parse(
                      localStorage.getItem('user') || '{}'
                    );

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL
                        || 'http://localhost:5001/api'
                      }/reviews`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(token && {
                            Authorization: `Bearer ${token}`
                          }),
                        },
                        body: JSON.stringify({
                          rating: appRating,
                          comment: ratingComment,
                          userName: userData.name || 'Utilisateur',
                        }),
                      }
                    );

                    if (res.ok) {
                      // Sauvegarde aussi localement
                      save({
                        appRating,
                        ratingDate: new Date().toISOString(),
                      });
                      setRatingSubmitted(true);
                    } else {
                      throw new Error('Erreur serveur');
                    }
                  } catch(e) {
                    // Même si le backend échoue,
                    // affiche le succès (offline mode)
                    save({
                      appRating,
                      ratingDate: new Date().toISOString(),
                    });
                    setRatingSubmitted(true);
                  }
                }}
                style={{
                  flex: 2, padding: '12px',
                  backgroundColor: appRating > 0
                    ? '#0A7B5E' : '#E2EAE7',
                  color: appRating > 0
                    ? 'white' : '#8A94A6',
                  border: 'none', borderRadius: 50,
                  cursor: appRating > 0
                    ? 'pointer' : 'not-allowed',
                  fontSize: 14, fontWeight: 600,
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s',
                }}>
                Publier mon avis
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
