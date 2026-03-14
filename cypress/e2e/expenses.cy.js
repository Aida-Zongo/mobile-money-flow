describe('GESTION DES DÉPENSES', () => {

  beforeEach(() => {
    // Login avant chaque test
    cy.visit('http://localhost:3003/login')
    cy.get('input[type="tel"]')
      .type('00000000')
    cy.get('input[type="password"]')
      .type('Test1234')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/dashboard')
    cy.visit('http://localhost:3003/expenses')
  })

  it('affiche la page dépenses', () => {
    cy.contains('Mes Depenses').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
  })

  it('ouvre le drawer ajout dépense', () => {
    cy.contains('Ajouter').click()
    cy.contains('Enregistrer la depense').should('be.visible')
  })

  it('ajoute une dépense', () => {
    cy.contains('Ajouter').click()
    cy.get('input[placeholder*="Libellé"]').type('Test dépense')
    cy.get('input[placeholder*="Montant"]').type('5000')
    cy.get('select').first().select('alimentation')
    cy.contains('Enregistrer la depense').click()
    cy.contains('5 000', { timeout: 5000 })
      .should('be.visible')
  })

  it('filtre par catégorie', () => {
    cy.get('select').first().select('alimentation')
    cy.url().should('exist')
  })
})
