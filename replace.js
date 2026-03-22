const fs = require('fs');
const path = require('path');

const files = [
  'app/dashboard/transactions/page.tsx',
  'app/dashboard/budgets/page.tsx',
  'app/dashboard/revenus/page.tsx',
  'app/dashboard/stats/page.tsx',
  'app/dashboard/profil/page.tsx',
  'app/dashboard/parametres/page.tsx'
];

files.forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) return;
  
  let content = fs.readFileSync(p, 'utf-8');
  
  // Replace colors
  content = content.replace(/'white'/g, "'var(--bg-card)'");
  content = content.replace(/backgroundColor:\s*'#FFFFFF'/g, "backgroundColor: 'var(--bg-card)'");
  content = content.replace(/'#F5F7F5'/g, "'var(--bg)'");
  content = content.replace(/'#FAFBFC'/g, "'var(--bg-input)'");
  content = content.replace(/'#F0F2F8'/g, "'var(--bg-sub)'");
  content = content.replace(/'#1A1D23'/g, "'var(--text-main)'");
  content = content.replace(/'#8A94A6'/g, "'var(--text-muted)'");
  content = content.replace(/'#E2EAE7'/g, "'var(--border)'");
  content = content.replace(/1px solid #E2EAE7/g, "1px solid var(--border)");
  content = content.replace(/1px solid #F0F2F8/g, "1px solid var(--border)");

  // Inject useTranslation import if not there
  if (!content.includes('useTranslation') && !f.includes('parametres/page.tsx') && !f.includes('profil/page.tsx')) {
    content = content.replace(/import api from '@\/lib\/api';/, "import api from '@/lib/api';\nimport { useTranslation } from '@/lib/i18n';");
    content = content.replace(/export default function \w+\(\) {/, "$&\n  const { t } = useTranslation();");
  } else if (!content.includes('useTranslation') && (f.includes('parametres/page.tsx') || f.includes('profil/page.tsx'))) {
    content = content.replace(/(import .* from 'lucide-react';)/, "$1\nimport { useTranslation } from '@/lib/i18n';");
    content = content.replace(/export default function \w+\(\) {/, "$&\n  const { t } = useTranslation();");
  }

  // Replace texts, being careful to only replace text nodes where possible
  // Using simple string replacement since it's targeted for jsx text
  content = content.replace(/>Mes Dépenses</g, ">{t('page.transactions')}<");
  content = content.replace(/>Mes Budgets</g, ">{t('page.budgets')}<");
  content = content.replace(/>Mes Revenus</g, ">{t('page.incomes')}<");
  content = content.replace(/>Statistiques</g, ">{t('page.stats')}<");
  content = content.replace(/>Mon Profil</g, ">{t('page.profile')}<");
  content = content.replace(/>Paramètres</g, ">{t('page.settings')}<");
  content = content.replace(/>Créer un budget</g, ">{t('budget.create')}<");
  content = content.replace(/Nouvelle dépense/g, "{t('tx.new')}");
  content = content.replace(/Aucun budget/g, "{t('budget.none')}");
  content = content.replace(/>Dépensé</g, ">{t('budget.spent')}<");
  content = content.replace(/>Utilisé</g, ">{t('budget.used')}<");
  content = content.replace(/>Limite</g, ">{t('budget.limit')}<");
  content = content.replace(/>Dépassé</g, ">{t('budget.exceeded')}<");
  content = content.replace(/>Attention</g, ">{t('budget.warning')}<");
  content = content.replace(/Aucune dépense(?!\sc)/g, "{t('tx.none')}");
  content = content.replace(/>Montant</g, ">{t('tx.amount')}<");
  content = content.replace(/>Catégorie</g, ">{t('tx.category')}<");
  content = content.replace(/>Description</g, ">{t('tx.description')}<");
  content = content.replace(/>Date</g, ">{t('tx.date')}<");
  content = content.replace(/>Opérateur</g, ">{t('tx.operator')}<");
  content = content.replace(/Ajouter un revenu/g, "{t('income.new')}");
  content = content.replace(/Total revenus/g, "{t('income.total')}");
  content = content.replace(/Aucun revenu ce mois/g, "{t('income.none')}");
  content = content.replace(/>Source</g, ">{t('income.source')}<");
  content = content.replace(/Total dépensé/g, "{t('stats.total')}");
  content = content.replace(/>Top catégorie</g, ">{t('stats.top')}<");
  content = content.replace(/Dépenses journalières/g, "{t('stats.daily')}");
  content = content.replace(/Répartition par catégorie/g, "{t('stats.by_cat')}");

  fs.writeFileSync(p, content);
});
console.log('Update finished.');
