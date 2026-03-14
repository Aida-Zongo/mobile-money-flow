"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
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
