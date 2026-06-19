describe('Asiento ocupado', () => {
  before(() => {
    cy.loginAsAdmin()
    cy.seedSala('Sala Test Ocupado', 20)
    cy.seedPelicula('Peli Test Ocupado', 'Drama', 90)
    cy.seedAsientos('A', 1, 10)
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    const fechaStr = manana.toISOString().split('T')[0]
    cy.seedFuncion(fechaStr, '16:00', 4.50)
    cy.wrap(fechaStr).as('fechaTest')
  })

  beforeEach(() => {
    cy.loginAsAdmin()
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    cy.wrap(manana.toISOString().split('T')[0]).as('fechaTest')
  })

  after(() => {
    cy.loginAsAdmin()
    cy.cleanupByNombre('sala', 'Sala Test Ocupado')
    cy.cleanupByNombre('pelicula', 'Peli Test Ocupado')
  })

  it('flujo de compra: seleccionar asiento, comprar y ver toast de exito', () => {
    cy.visit('/boletera')
    cy.get('@fechaTest').then(fecha => {
      cy.get('[data-testid="input-fecha"]').clear().type(fecha)
    })
    cy.get('[data-testid^="btn-funcion-"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-testid^="btn-funcion-"]').first().click()
    cy.get('.seat-available', { timeout: 5000 }).should('be.visible')
    cy.get('.seat-available').first().click()
    cy.get('[data-testid="btn-comprar"]').should('not.be.disabled').click()
    cy.get('[data-testid="btn-confirmar-compra"]').click()
    cy.get('[data-testid="toast-venta"]', { timeout: 5000 }).should('be.visible')
    cy.get('[data-testid="btn-comprar"]').should('be.disabled')
  })

  it('(opcional) asiento mockeado con intercept aparece ocupado', () => {
    cy.visit('/boletera')
    cy.get('@fechaTest').then(fecha => {
      cy.get('[data-testid="input-fecha"]').clear().type(fecha)
    })

    cy.intercept('GET', '/api/asientos/sala/*', {
      fixture: 'asientos-ocupados.json',
    }).as('mockAsientos')

    cy.get('[data-testid^="btn-funcion-"]', { timeout: 5000 }).should('be.visible').first().click()
    cy.wait('@mockAsientos')
    cy.get('[data-testid="asiento-A1"]').should('have.class', 'seat-occupied')
    cy.get('[data-testid="asiento-A2"]').should('have.class', 'seat-occupied')
    cy.get('[data-testid="asiento-A3"]').should('have.class', 'seat-available')
  })
})
