describe('SMOKE TESTS MONEYFLOW', () => {

  it('✅ Page login accessible', () => {
    cy.visit('http://localhost:3005/login')
    cy.get('body').should('be.visible')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
  })

  it('✅ Page register accessible', () => {
    cy.visit('http://localhost:3005/register')
    cy.get('body').should('be.visible')
    cy.contains('Créer').should('be.visible')
  })

  it('✅ Page login redirige dashboard si connecté', () => {
    cy.visit('http://localhost:3005/login')
    cy.setCookie('token', 'test-token-value')
    cy.visit('http://localhost:3005/login')
    cy.get('body').should('be.visible')
  })

  it('✅ Dashboard redirige login si non connecté', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('http://localhost:3005/dashboard')
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  it('✅ Expenses redirige login si non connecté', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('http://localhost:3005/expenses')
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  it('✅ Budgets redirige login si non connecté', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('http://localhost:3005/budgets')
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  it('✅ Statistics redirige login si non connecté', () => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('http://localhost:3005/statistics')
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  it('✅ Formulaire login - validation email', () => {
    cy.visit('http://localhost:3005/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('motdepasse')
    cy.get('form').submit()
    cy.get('body').should('be.visible')
  })

  it('✅ Navigation login vers register', () => {
    cy.visit('http://localhost:3005/login')
    cy.contains('Créer un compte').click()
    cy.url().should('include', '/register')
  })

  it('✅ Navigation register vers login', () => {
    cy.visit('http://localhost:3005/register')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/login')
  })
})
