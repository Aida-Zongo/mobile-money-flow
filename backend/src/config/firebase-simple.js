const admin = require('firebase-admin');

// Configuration temporaire sans clé privée pour tester
let db = null;
let auth = null;

try {
  // Tenter de charger la configuration Firebase
  const serviceAccount = require('../../serviceAccountKey.json');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  db = admin.firestore();
  auth = admin.auth();
  console.log('✅ Firebase connecté avec succès');
} catch (error) {
  console.log('⚠️ Firebase non configuré - utilisation mode démo');
  console.log('Erreur:', error.message);
}

module.exports = { admin, db, auth };
