describe('Error de servidor', () => {
  it('muestra empty state cuando funciones devuelve 500', () => {
    cy.loginAsAdmin()
    cy.intercept('GET', '/api/funciones*', { statusCode: 500, body: { error: 'Error interno' } })
    cy.visit('/boletera')
    cy.get('[data-testid="input-fecha"]').should('be.visible')
    cy.contains('No hay funciones para esta fecha').should('be.visible')
  })
})
