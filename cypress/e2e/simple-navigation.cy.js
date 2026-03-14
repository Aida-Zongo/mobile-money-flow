describe('NAVIGATION SIMPLE', () => {

  it('accède au dashboard sans connexion', () => {
    cy.visit('http://localhost:3003/dashboard')
    cy.url().should('include', '/dashboard')
    cy.contains('Accueil').should('be.visible')
    cy.contains('Solde Actuel').should('be.visible')
    cy.contains('Revenus du Mois').should('be.visible')
    cy.contains('Dépenses du Mois').should('be.visible')
  })

  it('accède aux expenses sans connexion', () => {
    cy.visit('http://localhost:3003/expenses')
    cy.url().should('include', '/expenses')
    cy.contains('Mes Depenses').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
  })

  it('accède aux revenues sans connexion', () => {
    cy.visit('http://localhost:3003/revenues')
    cy.url().should('include', '/revenues')
    cy.contains('Mes Revenus').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
  })

  it('accède aux budgets sans connexion', () => {
    cy.visit('http://localhost:3003/budgets')
    cy.url().should('include', '/budgets')
    cy.contains('Budgets').should('be.visible')
    cy.contains('Nouveau Budget').should('be.visible')
  })

  it('accède aux statistics sans connexion', () => {
    cy.visit('http://localhost:3003/statistics')
    cy.url().should('include', '/statistics')
    cy.contains('Statistiques').should('be.visible')
    cy.contains('Répartition par Catégorie').should('be.visible')
  })

  it('vérifie la navbar sur toutes les pages', () => {
    const pages = ['/dashboard', '/expenses', '/revenues', '/budgets', '/statistics']
    
    pages.forEach(page => {
      cy.visit(`http://localhost:3003${page}`)
      cy.contains('MoneyFlow').should('be.visible')
      cy.contains('Accueil').should('be.visible')
      cy.contains('Depenses').should('be.visible')
      cy.contains('Revenus').should('be.visible')
      cy.contains('Budgets').should('be.visible')
      cy.contains('Statistiques').should('be.visible')
    })
  })

  it('vérifie les liens de navigation', () => {
    cy.visit('http://localhost:3003/dashboard')
    
    // Test navigation vers expenses
    cy.contains('Depenses').click()
    cy.url().should('include', '/expenses')
    
    // Test navigation vers budgets
    cy.contains('Budgets').click()
    cy.url().should('include', '/budgets')
    
    // Test navigation vers statistics
    cy.contains('Statistiques').click()
    cy.url().should('include', '/statistics')
    
    // Test retour vers dashboard
    cy.contains('Accueil').click()
    cy.url().should('include', '/dashboard')
  })
})
