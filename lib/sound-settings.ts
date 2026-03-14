'use client';

import { useState, useEffect } from 'react';

export interface SoundSettings {
  enabled: boolean;
  volume: number;
}

export const useSoundSettings = () => {
  const [settings, setSettings] = useState<SoundSettings>({
    enabled: true,
    volume: 0.5,
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

  return {
    settings,
    setSettings,
    saveSettings,
    toggleEnabled: () => saveSettings({ enabled: !settings.enabled }),
    setVolume: (volume: number) => saveSettings({ 
      volume: Math.max(0, Math.min(1, volume)) 
    }),
  };
};
