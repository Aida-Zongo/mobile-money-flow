// Réinitialisation complète des budgets et transactions
console.log("🧹 Réinitialisation complète des budgets...");

// Supprimer toutes les données
localStorage.removeItem('userTransactions');
localStorage.removeItem('soldeInitial');
localStorage.removeItem('hasVisitedBefore');
localStorage.removeItem('userBudgets');

// Initialiser avec des données vides
localStorage.setItem('userTransactions', JSON.stringify([]));
localStorage.setItem('userBudgets', JSON.stringify([]));

console.log("✅ Budgets et transactions réinitialisés !");
console.log("🔄 Rechargement de la page...");

setTimeout(() => {
  window.location.reload();
}, 500);
