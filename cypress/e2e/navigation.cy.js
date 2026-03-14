describe('NAVIGATION ENTRE PAGES', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3003/login')
    cy.get('input[type="tel"]')
      .type('00000000')
    cy.get('input[type="password"]')
      .type('Test1234')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/dashboard')
  })

  it('navigue vers Dépenses', () => {
    cy.contains('Depenses').click()
    cy.url().should('include', '/expenses')
    cy.contains('Mes Depenses').should('be.visible')
  })

  it('navigue vers Budgets', () => {
    cy.contains('Budgets').click()
    cy.url().should('include', '/budgets')
    cy.contains('Budgets').should('be.visible')
  })

  it('navigue vers Statistiques', () => {
    cy.contains('Statistiques').click()
    cy.url().should('include', '/statistics')
    cy.contains('Statistiques').should('be.visible')
  })

  it('déconnexion fonctionne', () => {
    cy.contains('Déconnexion').click()
    cy.url().should('include', '/login')
    cy.window().its('localStorage')
      .invoke('getItem', 'moneyflow_user')
      .should('be.null')
  })
})
