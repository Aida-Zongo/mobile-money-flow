const mongoose = require('mongoose');
require('dotenv').config();

const checkUser = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    const user = await mongoose.connection.collection('users').findOne({ email: "aida04zng@gmail.com" });
    
    if (user) {
      console.log("🔍 Utilisateur trouvé :");
      console.log("- Email :", user.email);
      console.log("- Rôle actuel :", user.role);
      console.log("- Nom :", user.name);
    } else {
      console.log("❌ Aucun utilisateur trouvé avec cet e-mail.");
    }

  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

checkUser();
