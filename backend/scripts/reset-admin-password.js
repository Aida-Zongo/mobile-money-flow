const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../src/models/User');

const resetPassword = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    
    const email = "aida04zng@gmail.com";
    const user = await User.findOne({ email });
    
    if (user) {
      const hashed = await bcrypt.hash("Admin@1234", 12);
      user.password = hashed;
      await user.save();
      console.log(`✅ Mot de passe réinitialisé pour ${email}`);
    } else {
      console.log("❌ Utilisateur introuvable.");
    }

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

resetPassword();
