// Script pour réinitialiser complètement le compte pour un nouvel utilisateur
console.log("🧹 Réinitialisation complète du compte MoneyFlow...");

// Supprimer toutes les données
localStorage.removeItem('userTransactions');
localStorage.removeItem('soldeInitial');
localStorage.removeItem('hasVisitedBefore');

// Vérifier que tout est bien supprimé
console.log("✅ userTransactions supprimé:", !localStorage.getItem('userTransactions'));
console.log("✅ soldeInitial supprimé:", !localStorage.getItem('soldeInitial'));
console.log("✅ hasVisitedBefore supprimé:", !localStorage.getItem('hasVisitedBefore'));

// Initialiser avec des données vides
localStorage.setItem('userTransactions', JSON.stringify([]));

console.log("🎉 Compte réinitialisé ! Rechargez la page pour voir le formulaire d'accueil.");
console.log("📱 Le dashboard devrait maintenant montrer 'Bienvenue ! Compte vierge'");

// Recharger automatiquement la page
setTimeout(() => {
  window.location.reload();
}, 1000);
