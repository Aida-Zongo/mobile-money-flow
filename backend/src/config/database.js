const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connexion à MongoDB...');
    console.log('URI:', process.env.MONGODB_URI
      ?.substring(0, 50) + '...');

    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }
    );

    console.log(
      '✅ MongoDB Atlas connecté:',
      conn.connection.host
    );
  } catch (error) {
    console.error(
      '❌ MongoDB erreur:', error.message
    );
    console.error(
      'Vérifiez votre MONGODB_URI dans .env'
    );
    process.exit(1);
  }
};

module.exports = connectDB;
