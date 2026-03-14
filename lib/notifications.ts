'use client';

import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50) // Limiter à 50 notifications
    }));

    // Auto-suppression après 10 secondes pour les notifications de succès
    if (notification.type === 'success') {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, 10000);
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true }))
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id)
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  get unreadCount() {
    return get().notifications.filter((notif) => !notif.read).length;
  }
}));

import { playSound } from './sounds';

// Fonctions utilitaires pour les notifications courantes
export const notificationActions = {
  transactionAdded: (amount: number, type: 'expense' | 'revenue') => ({
    title: type === 'expense' ? 'Dépense ajoutée' : 'Revenu ajouté',
    message: `${type === 'expense' ? '-' : '+'}${amount.toLocaleString()} FCFA`,
    type: 'success' as const,
    sound: 'transaction' as const,
  }),

  budgetExceeded: (category: string, budget: number, spent: number) => ({
    title: 'Budget dépassé',
    message: `${category}: ${spent.toLocaleString()} FCFA / ${budget.toLocaleString()} FCFA`,
    type: 'warning' as const,
    sound: 'warning' as const,
    actionUrl: '/budgets',
    actionText: 'Voir les budgets',
  }),

  lowBalance: (balance: number) => ({
    title: 'Solde faible',
    message: `Votre solde est de ${balance.toLocaleString()} FCFA`,
    type: 'warning' as const,
    sound: 'warning' as const,
  }),

  welcomeBack: (userName: string) => ({
    title: 'Bon retour !',
    message: `Ravi de vous revoir, ${userName} !`,
    type: 'info' as const,
    sound: 'success' as const,
  }),

  expenseLimit: (category: string, limit: number) => ({
    title: 'Limite de dépense atteinte',
    message: `Vous avez atteint votre limite pour ${category}`,
    type: 'warning' as const,
    sound: 'warning' as const,
    actionUrl: '/expenses',
    actionText: 'Voir les dépenses',
  }),

  monthlyReport: (month: string, totalExpenses: number) => ({
    title: 'Rapport mensuel disponible',
    message: `Vos dépenses de ${month}: ${totalExpenses.toLocaleString()} FCFA`,
    type: 'info' as const,
    sound: 'notification' as const,
    actionUrl: '/statistics',
    actionText: 'Voir les statistiques',
  }),

  newFeature: (featureName: string) => ({
    title: 'Nouvelle fonctionnalité !',
    message: `Découvrez ${featureName} dès maintenant.`,
    type: 'info' as const,
    sound: 'notification' as const,
  }),
};

// Fonction améliorée pour ajouter une notification avec son
export const addNotificationWithSound = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'> & { sound?: keyof typeof NotificationSounds }) => {
  const { useNotifications } = require('./notifications').default;
  const { addNotification } = useNotifications.getState();
  
  // Ajouter la notification
  addNotification(notification);
  
  // Jouer le son si spécifié
  if (notification.sound) {
    playSound(notification.sound);
  }
};
