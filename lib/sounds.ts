// Sons pour les notifications MoneyFlow
export const NotificationSounds = {
  // Son de bienvenue/connexion réussie
  success: {
    name: 'success',
    file: '/sounds/success.mp3',
    volume: 0.3,
    // Alternative si le fichier n'existe pas
    fallback: () => {
      // Son système par défaut
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  },

  // Son d'alerte/budget dépassé
  warning: {
    name: 'warning',
    file: '/sounds/warning.mp3',
    volume: 0.4,
    fallback: () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }
  },

  // Son d'erreur
  error: {
    name: 'error',
    file: '/sounds/error.mp3',
    volume: 0.3,
    fallback: () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  },

  // Son de nouvelle transaction
  transaction: {
    name: 'transaction',
    file: '/sounds/transaction.mp3',
    volume: 0.2,
    fallback: () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  },

  // Son de notification générale
  notification: {
    name: 'notification',
    file: '/sounds/notification.mp3',
    volume: 0.25,
    fallback: () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA');
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }
  }
};

// Fonction pour jouer un son
export const playSound = (soundType: keyof typeof NotificationSounds) => {
  try {
    const sound = NotificationSounds[soundType];
    
    // Vérifier si l'audio est autorisé
    if (typeof window !== 'undefined' && 'Audio' in window) {
      // Essayer de charger le fichier audio personnalisé
      const audio = new Audio(sound.file);
      audio.volume = sound.volume;
      audio.play().catch(() => {
        // Si le fichier ne peut pas être lu, utiliser le fallback
        sound.fallback();
      });
    } else {
      // Utiliser le fallback si l'API Audio n'est pas disponible
      sound.fallback();
    }
  } catch (error) {
    console.warn('Impossible de jouer le son de notification:', error);
  }
};

// Sons intégrés en base64 (petits fichiers WAV)
export const EmbeddedSounds = {
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA',
  warning: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA',
  transaction: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA',
  notification: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YXhZ2FtZm10MAAAAAA'
};
