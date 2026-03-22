const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
connectDB();

// Import routes
const authRoutes = require('./routes/auth.routes');
const expenseRoutes = require('./routes/expense.routes');
const budgetRoutes = require('./routes/budget.routes');
const statsRoutes = require('./routes/stats.routes');
const incomeRoutes = require('./routes/income.routes');
const adminRoutes = require('./routes/admin.routes');

// Import Swagger configuration
const setupSwagger = require('./config/swagger');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.startsWith('http://localhost') || origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Trop de requêtes, réessayez plus tard',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Strict rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min (modifié pour dev)
  max: 100, // 100 requêtes
  message: {
    success: false,
    message: 'Trop de tentatives d\'authentification, réessayez dans 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// app.use('/api/auth', authLimiter); // Désactivé en développement

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', require('./routes/review.routes'));

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MoneyFlow API running',
    timestamp: new Date().toISOString(),
  });
});

// Frontend redirect endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MoneyFlow Backend API',
    endpoints: {
      api_docs: `http://localhost:${PORT}/api/docs`,
      health_check: `http://localhost:${PORT}/api/health`,
      frontend: 'http://localhost:8080',
      github: 'https://github.com/your-repo/moneyflow'
    },
    status: 'Backend is running successfully'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(
    `✅ MoneyFlow API running on port ${PORT}`
  );
});

// Fermeture propre quand on fait Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

// Gère l'erreur port déjà utilisé
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${PORT} déjà utilisé.\n` +
      `Solution: Ctrl+C dans l'ancien terminal\n` +
      `OU lance: taskkill /F /IM node.exe`
    );
    process.exit(1);
  }
});

module.exports = app;
// Restart trigger
// App restarting...
// Reload auth
