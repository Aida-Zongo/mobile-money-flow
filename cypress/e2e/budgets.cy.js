describe('GESTION DES BUDGETS', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3003/login')
    cy.get('input[type="tel"]')
      .type('00000000')
    cy.get('input[type="password"]')
      .type('Test1234')
    cy.contains('Se connecter').click()
    cy.visit('http://localhost:3003/budgets')
  })

  it('affiche la page budgets', () => {
    cy.contains('Budgets').should('be.visible')
    cy.contains('Nouveau Budget').should('be.visible')
  })

  it('ouvre le modal créer budget', () => {
    cy.contains('Nouveau Budget').click()
    cy.contains('Montant du budget').should('be.visible')
  })

  it('crée un budget', () => {
    cy.contains('Nouveau Budget').click()
    cy.contains('Alimentation').click()
    cy.get('input[placeholder*="Montant"]').type('50000')
    cy.contains('Créer le budget').click()
    cy.contains('50 000', { timeout: 5000 })
      .should('be.visible')
  })
})
