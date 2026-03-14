'use client';
import { useState, useEffect } from 'react';
import { User, Settings, LogOut, Edit2, Camera, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { getToken, getUser } from '@/lib/storage';

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
  Phone,
  Mail,
  Calendar,
  MapPin,
  Camera,
  Edit2,
  Save,
  X,
  TrendingUp,
  Wallet,
  Shield,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userName')
      return saved || "Amadou Ouedraogo"
    }
    return "Amadou Ouedraogo"
  })
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userEmail')
      return saved || "amadou@email.com"
    }
    return "amadou@email.com"
  })
  const [userPhone, setUserPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPhone')
      return saved || "+226 70 12 34 56"
    }
    return "+226 70 12 34 56"
  })
  const [userLocation, setUserLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userLocation')
      return saved || "Ouagadougou, Burkina Faso"
    }
    return "Ouagadougou, Burkina Faso"
  })
  const [joinDate, setJoinDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('joinDate')
      return saved || "15 janvier 2024"
    }
    return "15 janvier 2024"
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const user = {
    name: userName,
    phone: userPhone,
    email: userEmail,
    avatar: userName.split(" ").map(n => n[0]).join("").toUpperCase(),
    joinDate: joinDate,
    location: userLocation,
  }

  const stats = {
    totalTransactions: 156,
    totalAccounts: 3,
    memberSince: "3 mois",
  }

  const handleSave = () => {
    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userName', userName)
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('userPhone', userPhone)
      localStorage.setItem('userLocation', userLocation)
    }
    
    setShowSuccess(true)
    setIsEditing(false)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground">Mon Profil</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
              Informations personnelles
            </p>
          </div>
          <Button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="rounded-full bg-primary hover:bg-primary/90 btn-primary-shadow gap-2"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                Annuler
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Modifier
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm border border-border/60 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center ring-4 ring-offset-2 ring-primary/20">
                    <span className="text-3xl font-black text-primary">{user.avatar}</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{user.phone}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Membre depuis {user.joinDate}</span>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="rounded-2xl shadow-sm border border-border/60 p-6">
              <h3 className="text-sm font-bold text-foreground mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Transactions</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{stats.totalTransactions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Comptes</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{stats.totalAccounts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Ancienneté</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{stats.memberSince}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-sm border border-border/60 p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Informations personnelles</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      disabled={!isEditing}
                      className={`pl-12 h-12 rounded-xl ${
                        isEditing ? "input-glow" : "bg-muted"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Numéro de téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={user.phone}
                      disabled
                      className="pl-12 h-12 rounded-xl bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    🔒 Le numéro de téléphone ne peut pas être modifié pour des raisons de sécurité
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={!isEditing}
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      disabled={!isEditing}
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    onClick={handleSave}
                    className="flex-1 rounded-full bg-primary hover:bg-primary/90 h-12 btn-primary-shadow gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 rounded-full border-border h-12"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </Card>

            {/* Security Info */}
            <Card className="rounded-2xl shadow-sm border border-border/60 p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Sécurité</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Vérification à deux facteurs</p>
                      <p className="text-xs text-muted-foreground">Protection supplémentaire</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full font-medium">
                    Actif
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold">Authentification par SMS</p>
                      <p className="text-xs text-muted-foreground">Codes par SMS</p>
                    </div>
                  </div>
                  <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full font-medium">
                    Configuré
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-8 bg-success text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
          <span className="font-medium">Profil mis à jour avec succès !</span>
        </div>
      )}
    </div>
  )
}
