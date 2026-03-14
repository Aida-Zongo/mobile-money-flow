# 🔔 Système de Notifications Sonores - MoneyFlow

## 📋 Vue d'ensemble

MoneyFlow inclut un système complet de notifications sonores personnalisables pour améliorer l'expérience utilisateur.

## 🎵 Types de Sons Disponibles

| Type | Usage | Description |
|-------|---------|-------------|
| **success** | Connexion, inscription réussie | Son positif et encourageant |
| **warning** | Budget dépassé, solde faible | Son d'alerte attentionné |
| **error** | Erreur de connexion, échec | Son d'erreur clair |
| **transaction** | Nouvelle transaction | Son de notification subtil |
| **notification** | Notification générale | Son d'information standard |

## 🎛️ Configuration des Préférences Sonores

### **Accès au panneau de configuration**
1. Connectez-vous à MoneyFlow
2. Allez dans **"Mon Profil"**
3. Cliquez sur **"Afficher"** dans la section "Notifications Sonores"

### **Options disponibles**

#### 🔊 **Activer/Désactiver les sons**
- **Activé** : Les notifications sonores jouent pour chaque événement
- **Désactivé** : Aucun son ne sera joué (mode silencieux)

#### 🔊 **Contrôle du volume**
- **Plage** : 0% (muet) à 100% (volume maximum)
- **Réglage** : Curseur interactif pour ajuster précisément
- **Valeur par défaut** : 50%

#### 🧪 **Tester les sons**
- **Test individuel** : Bouton "Tester" pour chaque type de son
- **Feedback visuel** : Indicateur "Test..." pendant la lecture
- **Volume appliqué** : Tests utilisent le volume configuré

## 📁 Fichiers Audio

### **Structure des fichiers**
```
public/sounds/
├── success.mp3      # ✅ Connexion réussie
├── warning.mp3      # ⚠️ Budget dépassé
├── error.mp3        # ❌ Erreur système
├── notification.mp3  # 📢 Notification générale
└── transaction.mp3  # 💳 Nouvelle transaction
```

### **Personnalisation des sons**
1. **Remplacer les fichiers** dans `public/sounds/`
2. **Formats supportés** : MP3, WAV, OGG
3. **Taille recommandée** : < 100KB par fichier
4. **Durée optimale** : 0.5 - 2 secondes

### **Création de sons personnalisés**

#### 🎵 **Outils recommandés**
- **Audacity** (gratuit) : Édition audio professionnelle
- **Online Audio Converter** : Conversion de formats
- **SoundBible** : Bibliothèque de sons libres

#### 🎯 **Caractéristiques idéales**
- **Non intrusifs** : Pas trop forts ou longs
- **Distinctifs** : Chaque type reconnaissable
- **Professionnels** : Qualité audio claire
- **Cohérents** : Style uniforme avec votre marque

## 🔧 Configuration Technique

### **Intégration dans le code**
```typescript
import { playSound } from '@/lib/sounds';
import { useSoundSettings } from '@/lib/sound-settings';

// Utilisation basique
playSound('success');

// Avec préférences utilisateur
const { settings } = useSoundSettings();
if (settings.enabled) {
  playSound('notification');
}
```

### **Fallback automatique**
- Si le fichier audio personnalisé échoue, le système utilise un son intégré
- Garantit que les notifications fonctionnent toujours
- Évite les erreurs silencieuses

## 🌐 Compatibilité Navigateur

| Navigateur | Support Audio | Fallback |
|------------|----------------|-----------|
| **Chrome** | ✅ Complet | ✅ Intégré |
| **Firefox** | ✅ Complet | ✅ Intégré |
| **Safari** | ✅ Complet | ✅ Intégré |
| **Edge** | ✅ Complet | ✅ Intégré |
| **Mobile** | ✅ Complet | ✅ Intégré |

## 📱 Comportement sur Mobile

### **iOS**
- Respecte le mode silencieux de l'appareil
- Volume limité par les préférences système
- Compatible avec tous les modèles

### **Android**
- Intégration parfaite avec le système audio
- Respecte les modes "Ne pas déranger"
- Compatible Chrome Mobile

## 🎯 Meilleures Pratiques

### **Pour les développeurs**
1. **Testez sur tous navigateurs** avant déploiement
2. **Vérifiez le volume par défaut** (50% recommandé)
3. **Documentez les nouveaux sons** ajoutés
4. **Maintenez la cohérence** avec l'expérience utilisateur

### **Pour les utilisateurs**
1. **Ajustez le volume** selon votre environnement
2. **Testez les sons** pour choisir vos préférences
3. **Utilisez le mode silencieux** dans les environnements professionnels
4. **Personnalisez** avec vos propres fichiers si souhaité

## 🔍 Dépannage

### **Problèmes courants**

#### 🙉 **Les sons ne jouent pas**
- **Vérifiez** que les sons sont activés dans les préférences
- **Vérifiez** le volume n'est pas à 0%
- **Vérifiez** que le navigateur autorise l'audio
- **Testez** avec un autre navigateur

#### 🔊 **Les sons sont trop forts/faibles**
- **Ajustez** le curseur de volume dans les préférences
- **Vérifiez** le volume système de votre appareil
- **Modifiez** les fichiers audio si nécessaire

#### 📱 **Problèmes sur mobile**
- **Vérifiez** que le navigateur autorise l'audio
- **Désactivez** le mode silencieux si nécessaire
- **Redémarrez** l'application après changement de préférences

## 🚀 Évolutions Futures

### **Fonctionnalités prévues**
- [ ] **Sons contextuels** : Différents sons par type de transaction
- [ ] **Thèmes sonores** : Plusieurs packs de sons disponibles
- [ ] **Notifications vocales** : Messages audio personnalisés
- [ ] **Intégration smartwatch** : Notifications sur appareils connectés

---

## 📞 Support

Pour toute question sur le système de notifications sonores :

- **Documentation** : `SOUNDS.md` (ce fichier)
- **Code source** : `lib/sounds.ts`, `lib/sound-settings.ts`
- **Tests** : `app/profile/page.tsx` (panneau de test)

**MoneyFlow - Votre expérience financière, maintenant avec le son !** 🎵🇧🇫
