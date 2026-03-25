const mongoose = require('mongoose');
require('dotenv').config();

const promoteUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI n'est pas défini dans le fichier .env");
      process.exit(1);
    }

    console.log("⏳ Connexion à MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connecté !");

    const email = "aida04zng@gmail.com";
    const result = await mongoose.connection.collection('users').updateOne(
      { email: email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log(`🚀 Félicitations ! L'utilisateur ${email} a été promu au rang d'ADMIN.`);
      if (result.modifiedCount === 0) {
        console.log("ℹ️ Note : L'utilisateur était déjà administrateur.");
      }
    } else {
      console.error(`❌ Erreur : Aucun utilisateur trouvé avec l'email ${email}.`);
    }

  } catch (error) {
    console.error("❌ Une erreur est survenue :", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

promoteUser();
