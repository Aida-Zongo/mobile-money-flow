// Mock Firebase pour les tests
jest.mock('firebase-admin', () => ({
  apps: [],
  initializeApp: jest.fn(() => ({
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-uid' }))
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ exists: false })),
          set: jest.fn(() => Promise.resolve()),
          update: jest.fn(() => Promise.resolve()),
          delete: jest.fn(() => Promise.resolve())
        })),
        add: jest.fn(() => Promise.resolve({ id: 'test-id' })),
        where: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ docs: [] }))
        }))
      }))
    }))
  })),
  credential: {
    cert: jest.fn(() => ({}))
  }
}));

// Mock express-rate-limit
jest.mock('express-rate-limit', () => ({
  rateLimit: jest.fn(() => (req, res, next) => next())
}));

// Variables d'environnement de test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
