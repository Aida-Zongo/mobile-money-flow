describe('DASHBOARD', () => {

  it('redirige vers login si non connecté', () => {
    cy.clearLocalStorage()
    cy.visit('http://localhost:3003/dashboard')
    cy.url().should('include', '/login')
  })

  it('affiche la navbar correctement', () => {
    cy.visit('http://localhost:3003/expenses')
    // Login avec téléphone (adapté pour MoneyFlow)
    cy.get('input[type="tel"]')
      .type('00000000')
    cy.get('input[type="password"]')
      .type('Test1234')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/dashboard')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Accueil').should('be.visible')
    cy.contains('Depenses').should('be.visible')
    cy.contains('Revenus').should('be.visible')
    cy.contains('Budgets').should('be.visible')
    cy.contains('Statistiques').should('be.visible')
  })
})
