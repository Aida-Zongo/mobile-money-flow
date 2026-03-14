'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMoneyFlowUser } from '@/lib/storage';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ 
  children, 
  requireAdmin = false 
}: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const user = getMoneyFlowUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (requireAdmin) {
      if (user.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
    
    setAuthorized(true);
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F5F7F5'}}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{borderColor: '#0A7B5E', borderTopColor: 'transparent'}}>
          </div>
          <p className="text-sm font-medium" style={{color: '#8A94A6'}}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
