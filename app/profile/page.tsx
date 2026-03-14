'use client';
import { useState, useEffect } from 'react';
import { User, Settings, LogOut, Edit2, Camera, Mail, Phone, Calendar, Shield, Volume2, VolumeX, Bell, Play, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { getToken, getUser } from '@/lib/storage';
import { useSoundSettings } from '@/lib/sound-settings';
import { NotificationSounds, playSound } from '@/lib/sounds';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  totalTransactions: number;
  totalBudgets: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [isTestingSound, setIsTestingSound] = useState<string | null>(null);
  
  const { settings, saveSettings, toggleEnabled, setVolume } = useSoundSettings();

  useEffect(() => {
    // Charger les données utilisateur
    const userData = getUser();
    if (userData) {
      const userProfile: UserProfile = {
        name: userData.name || 'Utilisateur MoneyFlow',
        email: userData.email || 'user@moneyflow.com',
        phone: '+226 00000000',
        avatar: userData.avatar || '',
        joinDate: '15 Janvier 2024',
        lastLogin: new Date().toLocaleDateString('fr-FR'),
        totalTransactions: 156,
        totalBudgets: 8,
      };
      setUser(userProfile);
      setEditForm(userProfile);
    }
  }, []);

  const handleSave = () => {
    if (user && editForm.name && editForm.email) {
      const updatedUser = { ...user, ...editForm };
      setUser(updatedUser);
      
      // Simuler la sauvegarde
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      setIsEditing(false);
      
      // Notification de succès
      alert('Profil mis à jour avec succès !');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditForm({ ...editForm, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const testSound = (soundType: keyof typeof NotificationSounds) => {
    setIsTestingSound(soundType);
    playSound(soundType);
    
    // Arrêter l'indicateur de test après 2 secondes
    setTimeout(() => {
      setIsTestingSound(null);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                  ← Retour au dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Photo de profil et informations principales */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Photo de profil</h2>
                
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="mt-4 text-center text-lg font-semibold border rounded-lg px-3 py-2 w-full"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <h3 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h3>
                  )}
                </div>
              </div>

              {/* Panneau de préférences sonores */}
              <div className="mt-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications Sonores
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSoundSettings(!showSoundSettings)}
                    >
                      {showSoundSettings ? 'Masquer' : 'Afficher'}
                    </Button>
                  </div>

                  {showSoundSettings && (
                    <div className="space-y-4">
                      {/* Activer/Désactiver */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {settings.enabled ? (
                            <Volume2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <VolumeX className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">Sons activés</div>
                            <div className="text-sm text-gray-500">
                              {settings.enabled ? 'Les notifications sonores sont activées' : 'Les notifications sonores sont désactivées'}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={settings.enabled ? "default" : "outline"}
                          size="sm"
                          onClick={toggleEnabled}
                        >
                          {settings.enabled ? 'Désactiver' : 'Activer'}
                        </Button>
                      </div>

                      {/* Volume */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <label className="font-medium text-gray-900">Volume</label>
                          <span className="text-sm text-gray-500">{Math.round(settings.volume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.volume * 100}
                          onChange={(e) => setVolume(Number(e.target.value) / 100)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${settings.volume * 100}%, #E5E7EB ${settings.volume * 100}%, #E5E7EB 100%)`
                          }}
                        />
                      </div>

                      {/* Test des sons */}
                      <div className="space-y-2">
                        <div className="font-medium text-gray-900 mb-3">Tester les sons</div>
                        {Object.keys(NotificationSounds).map((soundType) => (
                          <div key={soundType} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium capitalize">{soundType}</span>
                              <span className="text-xs text-gray-500">
                                {soundType === 'success' && 'Connexion, inscription réussie'}
                                {soundType === 'warning' && 'Budget dépassé, solde faible'}
                                {soundType === 'error' && 'Erreur de connexion'}
                                {soundType === 'transaction' && 'Nouvelle transaction'}
                                {soundType === 'notification' && 'Notification générale'}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testSound(soundType as keyof typeof NotificationSounds)}
                              disabled={!settings.enabled || isTestingSound === soundType}
                              className="flex items-center gap-2"
                            >
                              {isTestingSound === soundType ? (
                                <>
                                  <Pause className="w-4 h-4" />
                                  Test...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Tester
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full mt-1 border rounded-lg px-3 py-2"
                          placeholder="votre@email.com"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{user.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full mt-1 border rounded-lg px-3 py-2"
                          placeholder="+226 XX XX XX XX"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Date d'inscription */}
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Date d'inscription</label>
                      <p className="mt-1 text-gray-900">{user.joinDate}</p>
                    </div>
                  </div>

                  {/* Dernière connexion */}
                  <div className="flex items-center gap-4">
                    <Settings className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Dernière connexion</label>
                      <p className="mt-1 text-gray-900">{user.lastLogin}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      {isEditing ? (
                        <div className="flex gap-3">
                          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                            Sauvegarder
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm(user);
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Modifier le profil
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Statistiques du compte</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{user.totalTransactions}</div>
                    <div className="text-sm text-gray-600 mt-1">Transactions totales</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{user.totalBudgets}</div>
                    <div className="text-sm text-gray-600 mt-1">Budgets actifs</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">Premium</div>
                    <div className="text-sm text-gray-600 mt-1">Type de compte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
