'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell, Shield, Globe, Moon, Sun,
  ChevronRight, Trash2, AlertTriangle,
  Check, Lock, Star, HelpCircle,
  MessageCircle, Info, FileText,
  Heart, Sparkles, Rocket, MapPin, Scale,
  Smartphone, Download, Calendar
} from 'lucide-react';
import { setTheme as applyGlobalTheme, Theme } from '@/lib/theme';
import { useLanguage } from '@/lib/LanguageContext';
import { generateMonthlyPDF } from '@/lib/pdf-generator';

const MONTH_NAMES_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

const MonthlyReportDownloader = () => {
  const { t } = useLanguage();
  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth() + 1);
  const [selYear, setSelYear] = useState(now.getFullYear());
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const currentYear = now.getFullYear();
  const years = [currentYear - 1, currentYear];

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const userName = localStorage.getItem('userName') ||
        localStorage.getItem('userEmail') || 'Utilisateur';
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

      const [statsRes, expensesRes, incomesRes] = await Promise.all([
        fetch(`${API}/stats/summary?month=${selMonth}&year=${selYear}`,
          { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/expenses?month=${selMonth}&year=${selYear}`,
          { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/incomes?month=${selMonth}&year=${selYear}`,
          { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!statsRes.ok || !expensesRes.ok || !incomesRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const stats = await statsRes.json();
      const expData = await expensesRes.json();
      const incData = await incomesRes.json();

      const expenses = (expData.expenses || (Array.isArray(expData) ? expData : [])).map((e: any) => ({
        ...e,
        date: e.date || e.createdAt || new Date().toISOString()
      }));

      const incomes = (incData.incomes || (Array.isArray(incData) ? incData : [])).map((i: any) => ({
        ...i,
        date: i.createdAt || `${i.year}-${String(i.month).padStart(2, '0')}-01`
      }));

      await generateMonthlyPDF({
        userName,
        month: selMonth,
        year: selYear,
        totalRevenues: Number(stats.totalRevenues || stats.totalIncome || 0),
        totalExpenses: Number(stats.totalExpenses || stats.totalMonth || 0),
        incomes,
        expenses,
      });
    } catch (e: any) {
      console.error('PDF Generation Error:', e);
      setError(e.message || 'Erreur lors de la génération du PDF');
    }
    setDownloading(false);
  };

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
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Calendar size={14} color="#0A7B5E" />
        {t('settings.report_select_month')}
      </p>

      {/* Month + Year selectors */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select
          value={selMonth}
          onChange={e => setSelMonth(Number(e.target.value))}
          style={{
            flex: 2, padding: '8px 10px', borderRadius: 10,
            border: '1px solid var(--border)', fontSize: 13,
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)', cursor: 'pointer',
          }}
        >
          {MONTH_NAMES_FR.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={selYear}
          onChange={e => setSelYear(Number(e.target.value))}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 10,
            border: '1px solid var(--border)', fontSize: 13,
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)', cursor: 'pointer',
          }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: '#F04438', marginBottom: 8 }}>{error}</p>
      )}

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
          padding: '11px 16px',
          borderRadius: 12, border: 'none',
          backgroundColor: downloading ? '#6B7280' : '#0A7B5E',
          color: '#fff', fontWeight: 700,
          fontSize: 14, cursor: downloading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        <Download size={16} />
        {downloading ? t('settings.report_downloading') : t('settings.report_download')}
      </button>
    </div>
  );
};

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

export default function ParametresPage() {
  const { t, setLang: setGlobalLang } = useLanguage();
  const router = useRouter();

  const [budgetAlert, setBudgetAlert] =
    useState(true);
  const [monthlyReport, setMonthlyReport] =
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
  const [showAboutModal, setShowAboutModal] =
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
      if (p.monthlyReport !== undefined)
        setMonthlyReport(p.monthlyReport);
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
        throw new Error(t('settings.server_error'));
      }
    } catch(e: any) {
      showToast(
        e.message || t('settings.delete_error'), true
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
    { code: 'light', label: t('theme.light'),
      icon: Sun, desc: t('theme.light_desc') },
    { code: 'dark', label: t('theme.dark'),
      icon: Moon, desc: t('theme.dark_desc') },
    { code: 'system', label: t('theme.system'),
      icon: Globe,
      desc: t('theme.system_desc') },
  ];


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
          {t('nav.settings')}
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
                  ? t('settings.alerts_enabled')
                  : t('settings.alerts_disabled'));
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
              value={monthlyReport}
              onChange={v => {
                setMonthlyReport(v);
                save({ monthlyReport: v });
                showToast(v
                  ? t('settings.report_enabled')
                  : t('settings.report_disabled'));
              }}
            />
          }
        />
        {monthlyReport && (
          <MonthlyReportDownloader />
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
            )?.label || t('settings.theme_light')
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
          label="MoneyFlow"
          desc={
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {t('settings.made_with')} <Heart size={12} color="#F04438" fill="#F04438" /> {t('settings.at')} Koudougou, BF
            </div>
          }
          onClick={() => setShowAboutModal(true)}
          last
          right={
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 6,
            }}>
              <span style={{
                fontSize: 12,
                color: 'var(--text-muted)',
              }}>
                2026
              </span>
              <ChevronRight size={16}
                color="#8A94A6" />
            </div>
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
        title={t('settings.choose_theme')}>
        {themes.map(tm => {
          const Icon = tm.icon;
          return (
            <ChoiceItem
              key={tm.code}
              selected={theme === tm.code}
              onClick={() => {
                setTheme(
                  tm.code as typeof theme
                );
                applyGlobalTheme(tm.code as Theme);
                save({ theme: tm.code });
                setShowThemeModal(false);
                showToast(
                  t('settings.theme_selected').replace('{theme}', tm.label)
                );
              }}
              left={
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  backgroundColor:
                    theme === tm.code
                      ? '#0A7B5E' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                }}>
                  <Icon size={20}
                    color={theme === tm.code
                      ? 'var(--bg-card)' : 'var(--text-muted)'} />
                </div>
              }
              label={tm.label}
              desc={tm.desc}
            />
          );
        })}
      </Modal>

      {/* MODAL LANGUE */}
      <Modal
        show={showLangModal}
        onClose={() =>
          setShowLangModal(false)}
        title={t('settings.choose_lang')}>
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
                t('settings.lang_selected').replace('{lang}', l.label)
              );
            }}
            left={
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: 'var(--bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Globe size={24} color={lang === l.code ? "#0A7B5E" : "var(--text-muted)"} />
              </div>
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
        title={t('settings.choose_currency')}>
        {currencies.map(c => (
          <ChoiceItem
            key={c.code}
            selected={currency === c.code}
            onClick={() => {
              setCurrency(c.code);
              save({ currency: c.code });
              setShowCurrencyModal(false);
              showToast(
                t('settings.currency_selected').replace('{currency}', c.label)
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
            {t('settings.confirm_delete_title')}
          </h3>
          <p style={{
            color: 'var(--text-muted)', fontSize: 14,
            lineHeight: 1.6, marginBottom: 24,
          }}>
            {t('settings.confirm_delete_desc')}
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
              {t('rate.cancel')}
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
                ? t('settings.deleting')
                : t('settings.confirm')}
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
              display: 'flex', justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Sparkles size={48} color="#0A7B5E" />
            </div>
            <h3 style={{
              fontSize: 20, fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: 8,
            }}>
              {t('rate.success_title')}
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 14, lineHeight: 1.6,
              marginBottom: 20,
            }}>
              {t('rate.success_desc')}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center', gap: 4,
              marginBottom: 20,
            }}>
              {[1,2,3,4,5].map(i => (
                <div key={i}>
                  <Star 
                    size={28} 
                    fill={i <= appRating ? "#F5A623" : "transparent"} 
                    color={i <= appRating ? "#F5A623" : "#E2E8F0"}
                  />
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
              {t('rate.close')}
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
                {t('rate.title')}
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: 13,
              }}>
                {t('rate.subtitle')}
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
                  <Star 
                    size={40} 
                    fill={(hoverRating || appRating) >= star ? "#F5A623" : "transparent"}
                    color={(hoverRating || appRating) >= star ? "#F5A623" : "#E2E8F0"}
                  />
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
                t('rate.star_poor')}
              {(hoverRating || appRating) === 2 &&
                t('rate.star_fair')}
              {(hoverRating || appRating) === 3 &&
                t('rate.star_good')}
              {(hoverRating || appRating) === 4 &&
                t('rate.star_very_good')}
              {(hoverRating || appRating) === 5 &&
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {t('rate.star_excellent')} <Rocket size={16} />
                </span>}
            </p>

            {/* Commentaire */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13,
                fontWeight: 500,
                color: 'var(--text-main)',
                marginBottom: 6,
              }}>
                {t('rate.comment_label')}
              </label>
              <textarea
                value={ratingComment}
                onChange={e => setRatingComment(
                  e.target.value.slice(0, 200)
                )}
                placeholder={t('rate.comment_placeholder')}
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
                {t('rate.cancel')}
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
                          userName: userData.name || t('nav.greeting_default'),
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
                      throw new Error(t('settings.server_error'));
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
                {t('rate.publish')}
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* MODAL À PROPOS */}
      <Modal
        show={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        title={t('settings.about_title')}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 20,
            backgroundColor: '#0A7B5E',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(10,123,94,0.2)',
          }}>
            <span style={{
              color: 'white', fontSize: 28,
              fontWeight: 800,
            }}>MF</span>
          </div>
          <h3 style={{
            fontSize: 20, fontWeight: 800,
            color: 'var(--text-main)', marginBottom: 8,
          }}>MoneyFlow</h3>
          <p style={{
            color: 'var(--text-muted)', fontSize: 14,
            lineHeight: 1.6, marginBottom: 20,
          }}>
            {t('settings.about_desc')}
          </p>
          <div style={{
            backgroundColor: 'var(--bg)',
            borderRadius: 16, padding: 16,
            marginBottom: 20, textAlign: 'left',
          }}>
            <p style={{
              fontSize: 13, color: 'var(--text-muted)',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6
            }}>
              <MapPin size={14} /> **{t('settings.location')} :** Koudougou, Burkina Faso
            </p>
            <p style={{
              fontSize: 13, color: 'var(--text-muted)',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Smartphone size={14} /> **{t('settings.contact_label')} :** [WhatsApp : 66869010](https://wa.me/22666869010)
            </p>
            <p style={{
              fontSize: 13, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Scale size={14} /> **{t('settings.licence')} :** {t('settings.rights')} &copy; 2026
            </p>
          </div>
          <button
            onClick={() => setShowAboutModal(false)}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: '#0A7B5E',
              color: 'white', border: 'none',
              borderRadius: 50, fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}>
            {t('rate.close')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
