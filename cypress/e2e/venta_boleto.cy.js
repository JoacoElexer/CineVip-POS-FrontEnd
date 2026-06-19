describe('Venta de boleto', () => {
  before(() => {
    cy.loginAsAdmin()
    cy.seedSala('Sala Test Boleto', 20)
    cy.seedPelicula('Peli Test Boleto', 'Acción', 120)
    cy.seedAsientos('A', 1, 10)
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const fechaStr = manana.toISOString().split('T')[0]
    cy.seedFuncion(fechaStr, '14:00', 5.50)
    cy.wrap(fechaStr).as('fechaTest')
  })

  beforeEach(() => {
    cy.loginAsAdmin()
  })

  after(() => {
    cy.loginAsAdmin()
    cy.cleanupByNombre('sala', 'Sala Test Boleto')
    cy.cleanupByNombre('pelicula', 'Peli Test Boleto')
  })

  it('flujo completo: seleccionar fecha, funcion, asiento y comprar', () => {
    cy.visit('/boletera')
    cy.injectAxe()
    cy.checkA11y()
    cy.get('@fechaTest').then(fecha => {
      cy.get('[data-testid="input-fecha"]').clear().type(fecha)
    })
    cy.get('[data-testid^="btn-funcion-"]', { timeout: 5000 }).should('be.visible').first().click()
    cy.get('.seat-available', { timeout: 5000 }).should('be.visible').first().click()
    cy.get('[data-testid="btn-comprar"]').click()
    cy.get('[data-testid="btn-confirmar-compra"]').click()
    cy.get('[data-testid="toast-venta"]', { timeout: 5000 }).should('be.visible')
  })
})
