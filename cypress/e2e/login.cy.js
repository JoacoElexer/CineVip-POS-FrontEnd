describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.injectAxe()
    cy.checkA11y()
  })

  it('login admin valido redirige a /dulceria', () => {
    cy.get('[data-testid="input-usuario"]').type('admin')
    cy.get('[data-testid="input-password"]').type('Admin1234')
    cy.get('[data-testid="btn-entrar"]').click()
    cy.url().should('include', '/dulceria')
  })

  it('login cajero valido redirige a /dulceria', () => {
    cy.get('[data-testid="input-usuario"]').type('cajero')
    cy.get('[data-testid="input-password"]').type('Cajero1234')
    cy.get('[data-testid="btn-entrar"]').click()
    cy.url().should('include', '/dulceria')
  })

  it('login invalido muestra mensaje de error', () => {
    cy.get('[data-testid="input-usuario"]').type('invalido')
    cy.get('[data-testid="input-password"]').type('malpassword')
    cy.get('[data-testid="btn-entrar"]').click()
    cy.get('[data-testid="error-mensaje"]').should('be.visible')
  })

  it('link registro navega a /register', () => {
    cy.get('[data-testid="link-registro"]').click()
    cy.url().should('include', '/register')
  })
})
