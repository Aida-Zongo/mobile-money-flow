'use client';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  HelpCircle, MessageCircle, BookOpen,
  Smartphone, Target, TrendingDown,
  DollarSign, BarChart3
} from 'lucide-react';
import { useState } from 'react';

import { useLanguage } from '@/lib/LanguageContext';

export default function AidePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

  const guides = [
    {
      icon: TrendingDown,
      color: '#F04438',
      bg: '#FEF2F2',
      title: t('help.guide1_title'),
      desc: t('help.guide1_desc'),
    },
    {
      icon: Target,
      color: '#0A7B5E',
      bg: '#E8F5F1',
      title: t('help.guide2_title'),
      desc: t('help.guide2_desc'),
    },
    {
      icon: DollarSign,
      color: '#16A34A',
      bg: '#F0FDF4',
      title: t('help.guide3_title'),
      desc: t('help.guide3_desc'),
    },
    {
      icon: BarChart3,
      color: '#2563EB',
      bg: '#EFF6FF',
      title: t('help.guide4_title'),
      desc: t('help.guide4_desc'),
    },
  ];

  const faqs = [
    { q: t('help.faq1_q'), a: t('help.faq1_a') },
    { q: t('help.faq2_q'), a: t('help.faq2_a') },
    { q: t('help.faq3_q'), a: t('help.faq3_a') },
    { q: t('help.faq4_q'), a: t('help.faq4_a') },
    { q: t('help.faq5_q'), a: t('help.faq5_a') },
    { q: t('help.faq6_q'), a: t('help.faq6_a') },
    { q: t('help.faq7_q'), a: t('help.faq7_a') },
    { q: t('help.faq8_q'), a: t('help.faq8_a') },
    { q: t('help.faq9_q'), a: t('help.faq9_a') },
    { q: t('help.faq10_q'), a: t('help.faq10_a') },
  ];

  return (
    <div style={{
      fontFamily: 'DM Sans, sans-serif',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: 12, marginBottom: 28,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36,
            borderRadius: 10, border: 'none',
            backgroundColor: 'var(--bg-card)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 1px 4px rgba(0,0,0,0.08)',
          }}>
          <ChevronLeft size={20}
            color="var(--text-main)" />
        </button>
        <div>
          <h1 style={{
            fontSize: 24, fontWeight: 800,
            color: 'var(--text-main)', margin: 0,
          }}>
            {t('help.title')}
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 14, marginTop: 4,
          }}>
            {t('help.subtitle')}
          </p>
        </div>
      </div>

      {/* Guides rapides */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 20, padding: 20,
        marginBottom: 20,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 10, marginBottom: 16,
        }}>
          <BookOpen size={18} color="#0A7B5E" />
          <h2 style={{
            fontSize: 16, fontWeight: 700,
            color: 'var(--text-main)', margin: 0,
          }}>
            {t('help.guides_title')}
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(2, 1fr)',
          gap: 12,
        }}>
          {guides.map((g, i) => {
            const Icon = g.icon;
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center', gap: 12,
                padding: 14,
                backgroundColor: 'var(--bg)',
                borderRadius: 14,
              }}>
                <div style={{
                  width: 40, height: 40,
                  borderRadius: 12,
                  backgroundColor: g.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20}
                    color={g.color} />
                </div>
                <div>
                  <p style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'var(--text-main)',
                    margin: 0,
                  }}>
                    {g.title}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    margin: '2px 0 0',
                    lineHeight: 1.4,
                  }}>
                    {g.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 20, overflow: 'hidden',
        marginBottom: 20,
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom:
            '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          gap: 10,
        }}>
          <HelpCircle size={18}
            color="#0A7B5E" />
          <h2 style={{
            fontSize: 16, fontWeight: 700,
            color: 'var(--text-main)', margin: 0,
          }}>
            {t('help.faq_title')}
          </h2>
        </div>

        {faqs.map((faq, i) => (
          <div key={i} style={{
            borderBottom: i < faqs.length - 1
              ? '1px solid var(--border)'
              : 'none',
          }}>
            <div
              onClick={() => setOpenFaq(
                openFaq === i ? null : i
              )}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e =>
                (e.currentTarget.style
                  .backgroundColor =
                  'var(--bg)')}
              onMouseLeave={e =>
                (e.currentTarget.style
                  .backgroundColor =
                  'transparent')}>
              <p style={{
                fontWeight: openFaq === i
                  ? 600 : 500,
                fontSize: 14,
                color: openFaq === i
                  ? '#0A7B5E'
                  : 'var(--text-main)',
                margin: 0, flex: 1,
                paddingRight: 12,
              }}>
                {faq.q}
              </p>
              {openFaq === i
                ? <ChevronUp size={18}
                    color="#0A7B5E" />
                : <ChevronDown size={18}
                    color="var(--text-muted)" />
              }
            </div>
            {openFaq === i && (
              <div style={{
                padding: '0 20px 16px',
                backgroundColor: 'var(--bg)',
              }}>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.7, margin: 0,
                }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 20, padding: 24,
        textAlign: 'center',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          backgroundColor: '#E8F5F1',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <MessageCircle size={24}
            color="#0A7B5E" />
        </div>
        <h3 style={{
          fontSize: 16, fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: 6,
        }}>
          {t('help.contact_title')}
        </h3>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 14, marginBottom: 16,
          lineHeight: 1.5,
        }}>
          {t('help.contact_desc')}
        </p>
        <button
          onClick={() => window.open(
            'https://wa.me/22666869010',
            '_blank'
          )}
          style={{
            display: 'inline-flex',
            alignItems: 'center', gap: 8,
            padding: '11px 24px',
            backgroundColor: '#0A7B5E',
            color: 'white', border: 'none',
            borderRadius: 50, fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            boxShadow:
              '0 4px 14px rgba(10,123,94,0.35)',
          }}>
          <MessageCircle size={16} />
          {t('help.contact_btn')}
        </button>
        <p style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 10,
        }}>
          WhatsApp : 66869010
        </p>
      </div>
    </div>
  );
}
