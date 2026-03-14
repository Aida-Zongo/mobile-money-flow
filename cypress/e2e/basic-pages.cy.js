describe('PAGES DE BASE', () => {

  it('vérifie la page login', () => {
    cy.visit('http://localhost:3003/login')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Se connecter').should('be.visible')
    cy.contains('Créer un compte').should('be.visible')
    cy.get('input[type="tel"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
  })

  it('vérifie la page register', () => {
    cy.visit('http://localhost:3003/register')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Créer un compte').should('be.visible')
    cy.contains('Se connecter').should('be.visible')
    cy.get('input[type="tel"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('input[placeholder*="Confirmer"]').should('be.visible')
  })

  it('vérifie la page dashboard', () => {
    cy.visit('http://localhost:3003/dashboard')
    cy.contains('Tableau de bord').should('be.visible')
    cy.contains('Solde Actuel').should('be.visible')
    cy.contains('Revenus du Mois').should('be.visible')
    cy.contains('Dépenses du Mois').should('be.visible')
  })

  it('vérifie la page expenses', () => {
    cy.visit('http://localhost:3003/expenses')
    cy.contains('Mes Depenses').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
    cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    cy.contains('Aucune dépense enregistrée').should('be.visible')
  })

  it('vérifie la page revenues', () => {
    cy.visit('http://localhost:3003/revenues')
    cy.contains('Mes Revenus').should('be.visible')
    cy.contains('Ajouter').should('be.visible')
    cy.get('input[placeholder*="Rechercher"]').should('be.visible')
    cy.contains('Aucun revenu enregistré').should('be.visible')
  })

  it('vérifie la navbar sur login', () => {
    cy.visit('http://localhost:3003/login')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Accueil').should('be.visible')
    cy.contains('Depenses').should('be.visible')
    cy.contains('Revenus').should('be.visible')
    cy.contains('Budgets').should('be.visible')
    cy.contains('Statistiques').should('be.visible')
  })

  it('vérifie la navbar sur dashboard', () => {
    cy.visit('http://localhost:3003/dashboard')
    cy.contains('MoneyFlow').should('be.visible')
    cy.contains('Accueil').should('be.visible')
    cy.contains('Depenses').should('be.visible')
    cy.contains('Revenus').should('be.visible')
    cy.contains('Budgets').should('be.visible')
    cy.contains('Statistiques').should('be.visible')
  })

  it('test navigation login -> register', () => {
    cy.visit('http://localhost:3003/login')
    cy.contains('Créer un compte').click()
    cy.url().should('include', '/register')
  })

  it('test navigation register -> login', () => {
    cy.visit('http://localhost:3003/register')
    cy.contains('Se connecter').click()
    cy.url().should('include', '/login')
  })

  it('test navigation dashboard -> expenses', () => {
    cy.visit('http://localhost:3003/dashboard')
    cy.contains('Depenses').click()
    cy.url().should('include', '/expenses')
  })

  it('test navigation expenses -> revenues', () => {
    cy.visit('http://localhost:3003/expenses')
    cy.contains('Revenus').click()
    cy.url().should('include', '/revenues')
  })

  it('test navigation revenues -> dashboard', () => {
    cy.visit('http://localhost:3003/revenues')
    cy.contains('Accueil').click()
    cy.url().should('include', '/dashboard')
  })
})
