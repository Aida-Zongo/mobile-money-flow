// Test script pour vérifier la synchronisation
console.log("Test de synchronisation MoneyFlow...");

// Ajouter une transaction de test
const testTransaction = {
  id: Date.now(),
  type: "revenu",
  label: "Test synchronisation",
  amount: 50000,
  date: new Date().toISOString().split('T')[0],
  time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  isToday: true
};

// Récupérer les transactions existantes
let transactions = [];
const saved = localStorage.getItem('userTransactions');
if (saved) {
  transactions = JSON.parse(saved);
}

// Ajouter la transaction de test
transactions.unshift(testTransaction);
localStorage.setItem('userTransactions', JSON.stringify(transactions));

console.log("Transaction de test ajoutée :", testTransaction);
console.log("Total transactions :", transactions.length);
console.log("Vérifiez les pages maintenant !");
