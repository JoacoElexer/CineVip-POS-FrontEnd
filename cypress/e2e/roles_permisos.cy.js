describe('Roles y permisos', () => {
  it('cajero no puede acceder a /admin - redirige a /dulceria', () => {
    cy.loginAsCajero()
    cy.visit('/admin')
    cy.url().should('include', '/dulceria')
  })

  it('admin puede acceder a /admin', () => {
    cy.loginAsAdmin()
    cy.visit('/admin')
    cy.get('[data-testid="tab-salas"]').should('be.visible')
  })

  it('cajero no puede acceder a /inventario - redirige a /dulceria', () => {
    cy.loginAsCajero()
    cy.visit('/inventario')
    cy.url().should('include', '/dulceria')
  })

  it('admin puede acceder a /inventario', () => {
    cy.loginAsAdmin()
    cy.visit('/inventario')
    cy.url().should('include', '/inventario')
  })
})
