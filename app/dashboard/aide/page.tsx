'use client';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronDown, ChevronUp,
  HelpCircle, MessageCircle, BookOpen,
  Smartphone, Target, TrendingDown,
  DollarSign, BarChart3
} from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Comment ajouter une dépense ?',
    a: 'Allez dans "Transactions" puis cliquez sur "+ Nouvelle dépense". Renseignez le montant, la catégorie, la date et l\'opérateur (Orange Money, Wave, Moov ou Espèces).',
  },
  {
    q: 'Comment créer un budget ?',
    a: 'Allez dans "Budgets" puis cliquez sur "+ Créer un budget". Choisissez une catégorie, définissez un montant limite et le mois concerné.',
  },
  {
    q: 'Quand est-ce que je reçois une alerte budget ?',
    a: 'Vous recevez une notification quand vous atteignez 80% de votre budget (alerte orange) et quand vous le dépassez à 100% (alerte rouge). La cloche en haut affiche le nombre d\'alertes non lues.',
  },
  {
    q: 'Comment enregistrer mon salaire ?',
    a: 'Allez dans "Revenus" puis cliquez sur "+ Ajouter un revenu". Sélectionnez la source (Salaire, Freelance, Commerce...) et entrez le montant.',
  },
  {
    q: 'Comment voir mes statistiques ?',
    a: 'Allez dans "Statistiques". Vous verrez un graphique en donut avec la répartition par catégorie et un graphique en barres des dépenses journalières. Utilisez les flèches pour naviguer entre les mois.',
  },
  {
    q: 'Comment modifier mon profil ?',
    a: 'Allez dans "Profil" (menu Compte dans la sidebar). Cliquez sur "Modifier" pour changer votre nom et téléphone. Vous pouvez aussi changer votre mot de passe dans la même page.',
  },
  {
    q: 'Comment changer la langue ?',
    a: 'Allez dans "Paramètres" puis "Langue de l\'application". Vous pouvez choisir entre Français, English, Mooré et Dioula.',
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: 'Oui. Vos données sont stockées de façon sécurisée dans une base de données MongoDB Atlas avec chiffrement. Votre mot de passe est hashé (crypté) et jamais stocké en clair.',
  },
  {
    q: 'Comment supprimer mon compte ?',
    a: 'Allez dans "Paramètres" puis faites défiler jusqu\'à "Zone dangereuse". Cliquez sur "Supprimer mon compte" et confirmez. Cette action supprime définitivement toutes vos données.',
  },
  {
    q: 'L\'application fonctionne-t-elle hors connexion ?',
    a: 'Non, MoneyFlow nécessite une connexion internet pour synchroniser vos données avec le serveur et les retrouver sur tous vos appareils.',
  },
];

const guides = [
  {
    icon: TrendingDown,
    color: '#F04438',
    bg: '#FEF2F2',
    title: 'Gérer ses dépenses',
    desc: 'Ajoutez, modifiez et supprimez vos transactions facilement',
  },
  {
    icon: Target,
    color: '#0A7B5E',
    bg: '#E8F5F1',
    title: 'Créer des budgets',
    desc: 'Définissez des limites par catégorie et suivez votre consommation',
  },
  {
    icon: DollarSign,
    color: '#16A34A',
    bg: '#F0FDF4',
    title: 'Suivre ses revenus',
    desc: 'Enregistrez votre salaire et autres sources de revenus',
  },
  {
    icon: BarChart3,
    color: '#2563EB',
    bg: '#EFF6FF',
    title: 'Analyser ses finances',
    desc: 'Comprenez vos habitudes avec les statistiques et graphiques',
  },
];

import { useLanguage } from '@/lib/LanguageContext';

export default function AidePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] =
    useState<number | null>(null);

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
            Guides rapides
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
            Questions fréquentes
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
          Vous n'avez pas trouvé votre réponse ?
        </h3>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: 14, marginBottom: 16,
          lineHeight: 1.5,
        }}>
          Notre équipe est disponible pour
          vous aider.
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
          Contacter sur WhatsApp
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
