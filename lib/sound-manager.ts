'use client';

import { useState, useEffect } from 'react';
import { NotificationSounds, playSound } from './sounds';

export interface SoundSettings {
  enabled: boolean;
  volume: number;
  soundType: keyof typeof NotificationSounds;
}

export const useSoundManager = () => {
  const [settings, setSettings] = useState<SoundSettings>({
    enabled: true,
    volume: 0.5,
    soundType: 'success',
  });

  // Charger les préférences depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundSettings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
        } catch (error) {
          console.warn('Erreur lors du chargement des préférences sonores:', error);
        }
      }
    }
  }, []);

  // Sauvegarder les préférences
  const saveSettings = (newSettings: Partial<SoundSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundSettings', JSON.stringify(updatedSettings));
    }
  };

  // Fonction pour jouer une notification avec les préférences utilisateur
  const playNotificationSound = (soundType: keyof typeof NotificationSounds) => {
    if (settings.enabled && settings.volume > 0) {
      // Ajuster le volume selon les préférences
      const originalVolume = settings.volume;
      
      // Jouer le son avec le volume personnalisé
      if (typeof window !== 'undefined' && 'Audio' in window) {
        try {
          const audio = new Audio(NotificationSounds[soundType].file);
          audio.volume = originalVolume;
          audio.play().catch(() => {
            // Fallback si erreur
            playSound(soundType);
          });
        } catch (error) {
          // Utiliser le fallback
          playSound(soundType);
        }
      }
    }
  };

  return {
    settings,
    setSettings,
    saveSettings,
    playNotificationSound,
    toggleEnabled: () => saveSettings({ enabled: !settings.enabled }),
    setVolume: (volume: number) => saveSettings({ 
      volume: Math.max(0, Math.min(1, volume)) 
    }),
    setSoundType: (soundType: keyof typeof NotificationSounds) => saveSettings({ soundType }),
  };
};
