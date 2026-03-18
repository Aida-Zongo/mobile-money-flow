'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Nettoyer tous les systèmes de stockage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('moneyflow_user');
      localStorage.removeItem('moneyflow_transactions');
      localStorage.removeItem('moneyflow_budgets');
      localStorage.removeItem('moneyflow_balance');
      
      // Notification de déconnexion
      alert('👋 Vous avez été déconnecté avec succès de MoneyFlow.');
    }
    
    // Rediriger vers la page d'accueil
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F5F7F5'}}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{borderColor: '#0A7B5E', borderTopColor: 'transparent'}}>
        </div>
        <p className="text-sm font-medium" style={{color: '#8A94A6'}}>
          Déconnexion en cours...
        </p>
      </div>
    </div>
  );
}
