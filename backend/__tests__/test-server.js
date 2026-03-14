const express = require('express');
const cors = require('cors');

// Créer une application Express de test
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes de test (sans Firebase)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API Health OK',
    timestamp: new Date().toISOString()
  });
});

// Middleware d'authentification mock
const mockAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token manquant ou invalide' 
    });
  }
  // Mock user
  req.user = { uid: 'test-uid-123', email: 'test@example.com' };
  next();
};

// Routes protégées
app.get('/api/auth/me', mockAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    user: req.user 
  });
});

app.post('/api/auth/register', mockAuth, (req, res) => {
  const { uid, name, email, phone, operator } = req.body;
  res.status(200).json({ 
    success: true, 
    user: { uid, name, email, phone, operator }
  });
});

app.get('/api/expenses', mockAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    expenses: [] 
  });
});

app.post('/api/expenses', mockAuth, (req, res) => {
  const { amount, category } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Montant invalide' 
    });
  }
  
  if (!category) {
    return res.status(400).json({ 
      success: false, 
      message: 'Catégorie requise' 
    });
  }
  
  res.status(201).json({ 
    success: true, 
    expense: { id: Date.now(), amount, category }
  });
});

app.delete('/api/expenses/:id', mockAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Dépense supprimée' 
  });
});

app.get('/api/budgets', mockAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    budgets: [] 
  });
});

app.get('/api/stats/summary', mockAuth, (req, res) => {
  res.status(200).json({ 
    success: true, 
    stats: { totalExpenses: 0, totalRevenues: 0 }
  });
});

// Route d'erreur 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});

module.exports = app;
