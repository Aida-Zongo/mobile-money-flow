// Réinitialisation complète et immédiate du compte
console.log("🧹 RÉINITIALISATION COMPLÈTE DU COMPTE...");

// 1. Supprimer toutes les données
localStorage.removeItem('userTransactions');
localStorage.removeItem('soldeInitial');
localStorage.removeItem('hasVisitedBefore');

// 2. Initialiser avec des données vides
localStorage.setItem('userTransactions', JSON.stringify([]));

// 3. Forcer le rechargement de la page
console.log("✅ Données supprimées avec succès !");
console.log("🔄 Rechargement de la page...");

setTimeout(() => {
  window.location.reload();
}, 500);

// Instructions pour l'utilisateur
console.log("📝 Après le rechargement, vous devriez voir :");
console.log("   - 'Bienvenue sur MoneyFlow !'");
console.log("   - Formulaire pour saisir votre solde initial");
console.log("   - Toutes les cartes à 0 FCFA");
console.log("   - Aucune transaction");
