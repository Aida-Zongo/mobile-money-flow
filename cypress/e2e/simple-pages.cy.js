describe('VÉRIFICATION DES PAGES', () => {

  it('vérifie la page dashboard', () => {
    cy.visit('http://localhost:3003/dashboard')
    
    // Vérifie les éléments principaux
    cy.contains('Tableau de bord').should('be.visible')
    cy.contains('Solde Actuel').should('be.visible')
    cy.contains('Revenus du Mois').should('be.visible')
    cy.contains('Dépenses du Mois').should('be.visible')
    
    // Vérifie les cartes
    cy.get('[data-testid="balance-card"]').should('be.visible')
    cy.get('[data-testid="revenue-card"]').should('be.visible')
    cy.get('[data-testid="expense-card"]').should('be.visible')
  })

  it('vérifie la page expenses', () => {
    cy.visit('http://localhost:3003/expenses')
    
    // Vérifie les éléments principaux
    cy.contains('Mes Depenses').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
    
    // Vérifie le formulaire de recherche
    cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    
    // Vérifie l'état vide
    cy.contains('Aucune dépense enregistrée').should('be.visible')
  })

  it('vérifie la page revenues', () => {
    cy.visit('http://localhost:3003/revenues')
    
    // Vérifie les éléments principaux
    cy.contains('Mes Revenus').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
    
    // Vérifie le formulaire de recherche
    cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    
    // Vérifie l'état vide
    cy.contains('Aucun revenu enregistré').should('be.visible')
  })

  it('vérifie la page budgets', () => {
    cy.visit('http://localhost:3003/budgets')
    
    // Vérifie les éléments principaux
    cy.contains('Budgets').should('be.visible')
    cy.contains('Gestion de vos budgets').should('be.visible')
    cy.contains('Nouveau Budget').should('be.visible')
    cy.contains('Catégories').should('be.visible')
    
    // Vérifie les métriques
    cy.contains('Total Budget').should('be.visible')
    cy.contains('Dépensé').should('be.visible')
    cy.contains('Disponible').should('be.visible')
    
    // Vérifie l'état vide
    cy.contains('Aucun budget créé').should('be.visible')
  })

  it('vérifie la page statistics', () => {
    cy.visit('http://localhost:3003/statistics')
    
    // Vérifie les éléments principaux
    cy.contains('Statistiques').should('be.visible')
    cy.contains('Analyse de vos finances').should('be.visible')
    
    // Vérifie les métriques
    cy.contains('Solde Actuel').should('be.visible')
    cy.contains('Total Revenus').should('be.visible')
    cy.contains('Total Depenses').should('be.visible')
    
    // Vérifie les graphiques
    cy.contains('Répartition par Catégorie').should('be.visible')
    cy.contains('Évolution Mensuelle').should('be.visible')
  })
})
