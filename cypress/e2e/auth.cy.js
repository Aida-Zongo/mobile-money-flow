describe('AUTHENTIFICATION', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3003/login')
  })

  it('affiche la page login correctement', () => {
    cy.get('input[type="tel"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.contains('Se connecter').should('be.visible')
    cy.contains('Créer un compte').should('be.visible')
  })

  it('affiche erreur si identifiants incorrects', () => {
    cy.get('input[type="tel"]')
      .type('00000000')
    cy.get('input[type="password"]')
      .type('mauvaismdp')
    cy.contains('Se connecter').click()
    cy.contains('Erreur', { timeout: 5000 })
      .should('be.visible')
  })

  it('navigue vers register depuis login', () => {
    cy.contains('Créer un compte').click()
    cy.url().should('include', '/register')
  })

  it('navigue vers login depuis register', () => {
    cy.visit('http://localhost:3003/register')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/login')
  })

  it('redirige vers dashboard si déjà connecté', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('moneyflow_user', JSON.stringify({
        name: 'Test User',
        email: 'test@moneyflow.com'
      }))
    })
    cy.visit('http://localhost:3003/login')
    // Si utilisateur présent, doit aller au dashboard
  })
})
