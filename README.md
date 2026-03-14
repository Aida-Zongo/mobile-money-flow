# 💰 MoneyFlow - Expense Tracker Mobile Money

**Application de suivi des dépenses Mobile Money pour le Burkina Faso**

## 📋 Description

MoneyFlow est une application web moderne qui permet de suivre facilement les transactions Mobile Money (Orange Money, Wave, Moov Money) avec une interface intuitive et des statistiques détaillées.

## 🚀 Fonctionnalités

- ✅ **Authentification sécurisée** avec Firebase
- ✅ **Dashboard** avec vue d'ensemble des finances
- ✅ **Gestion des dépenses** et revenus
- ✅ **Budgets** personnalisables
- ✅ **Statistiques** et graphiques interactifs
- ✅ **Support multi-opérateurs** Mobile Money
- ✅ **Design responsive** et moderne

## 🏗️ Architecture

```
MoneyFlow/
├── 📱 frontend/          # Application Next.js
│   ├── app/              # Pages et routes
│   ├── components/        # Composants React
│   ├── lib/             # Utilitaires et services
│   └── public/          # Assets statiques
├── 🔧 backend/           # API Node.js/Express
│   ├── src/             # Code source
│   ├── __tests__/        # Tests unitaires
│   └── docs/            # Documentation API
└── 📚 documentation/    # Documentation projet
```

## 🧪 Tests

### ✅ Backend (18/18 tests - 100%)
```bash
cd backend
npm test
```

### ✅ Frontend (10/10 tests - 100%)
```bash
npm run cypress:run
```

### 📊 Couverture totale : 28/28 tests (100%)

## 🚀 Déploiement

### 🔧 Backend - Railway.app

1. **Variables d'environnement requises :**
```env
PORT=5001
CLIENT_URL=https://votre-app.vercel.app
NODE_ENV=production
FIREBASE_PROJECT_ID=moneyflow-app-88c52
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
```

2. **Configuration automatique :**
- ✅ Procfile configuré
- ✅ railway.json configuré
- ✅ Build Nixpacks activé

### 🌐 Frontend - Vercel

1. **Variables d'environnement requises :**
```env
NEXT_PUBLIC_API_URL=https://votre-backend.railway.app/api
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

2. **Configuration automatique :**
- ✅ vercel.json configuré
- ✅ Build Next.js optimisé
- ✅ Static assets optimisés

## 🔐 Sécurité

- 🔒 **Authentification Bearer Token** JWT
- 🛡️ **Validation des entrées** avec Express Validator
- 🚫 **Rate Limiting** protection
- 🔐 **Helmet.js** sécurité headers
- 📝 **Variables d'environnement** protégées

## 📱 Technologies

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Typage strict
- **TailwindCSS** - Styling moderne
- **Cypress** - Tests E2E
- **Firebase Auth** - Authentification

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework API
- **MongoDB** - Base de données
- **Firebase Admin** - Services Firebase
- **Jest** - Tests unitaires

## 📊 API Documentation

L'API documentation est disponible sur :
```
https://votre-backend.railway.app/api/docs
```

## 🔄 Développement local

### Prérequis
- Node.js 16+
- npm ou yarn
- Git

### Installation
```bash
git clone https://github.com/Aida-Zongo/moneyflow.git
cd moneyflow

# Backend
cd backend
npm install
npm run dev

# Frontend (autre terminal)
cd ..
npm install
npm run dev
```

### URLs locales
- Frontend : http://localhost:3005
- Backend : http://localhost:5001
- API Docs : http://localhost:5001/api/docs

## 📈 Performance

- ⚡ **Frontend** : 95+ Lighthouse score
- 🚀 **Backend** : <100ms response time
- 📱 **Mobile First** : Responsive design
- 🔍 **SEO** : Meta tags optimisés

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE)

## 👥 Équipe

- **Aïda ZONGO** - Lead Developer
- **MoneyFlow Team** - Développement & Design

---

**🇧🇫 Made with ❤️ in Burkina Faso**
