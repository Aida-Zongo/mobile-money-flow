describe('AUTHENTIFICATION SIMPLE', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3003/login')
  })

  it('affiche la page login correctement', () => {
    cy.get('input[type="tel"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('Se connecter').should('be.visible')
    cy.contains('Créer un compte').should('be.visible')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Votre tracker Mobile Money').should('be.visible')
  })

  it('navigue vers register depuis login', () => {
    cy.contains('Créer un compte').click()
    cy.url().should('include', '/register')
    cy.contains('Créer un compte').should('be.visible')
    cy.get('input[type="tel"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('navigue vers login depuis register', () => {
    cy.visit('http://localhost:3003/register')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/login')
  })

  it('affiche le formulaire d inscription', () => {
    cy.visit('http://localhost:3003/register')
    cy.get('input[placeholder*="Numéro"]').should('be.visible')
    cy.get('input[placeholder*="Mot de passe"]').should('be.visible')
    cy.get('input[placeholder*="Confirmer"]').should('be.visible')
    cy.get('input[placeholder*="Nom complet"]').should('be.visible')
  })

  it('vérifie les champs obligatoires register', () => {
    cy.visit('http://localhost:3003/register')
    cy.contains('Créer un compte').click()
    // Le formulaire ne devrait pas soumettre si les champs sont vides
    cy.url().should('include', '/register')
  })
})
