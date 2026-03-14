// Commande login réutilisable
Cypress.Commands.add('login', (phone, password) => {
  cy.visit('http://localhost:3003/login')
  cy.get('input[type="tel"]').type(phone)
  cy.get('input[type="password"]').type(password)
  cy.contains('Se connecter').click()
  cy.url().should('include', '/dashboard')
})
