const mongoose = require('mongoose');
require('dotenv').config();

const Expense = require('../src/models/Expense');
const Income = require('../src/models/Income');
const Budget = require('../src/models/Budget');

const applyIndexes = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI n'est pas défini");
      process.exit(1);
    }

    console.log("⏳ Connexion à MongoDB pour appliquer les index...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connecté !");

    console.log("⏳ Création/Mise à jour des index sur Expense...");
    await Expense.syncIndexes();
    console.log("✅ Index Expense appliqués.");

    console.log("⏳ Création/Mise à jour des index sur Income...");
    await Income.syncIndexes();
    console.log("✅ Index Income appliqués.");

    console.log("⏳ Création/Mise à jour des index sur Budget...");
    await Budget.syncIndexes();
    console.log("✅ Index Budget appliqués.");

    console.log("🚀 Tous les index de performance ont été appliqués avec succès !");
  } catch (error) {
    console.error("❌ Une erreur est survenue lors de la création des index:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

applyIndexes();
