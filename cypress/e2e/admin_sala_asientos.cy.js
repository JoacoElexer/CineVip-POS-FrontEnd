describe('Admin salas y asientos', () => {
  before(() => {
    cy.loginAsAdmin()
    cy.cleanupByNombre('sala', 'Sala Test Admin')
  })

  beforeEach(() => {
    cy.loginAsAdmin()
  })

  after(() => {
    cy.loginAsAdmin()
    cy.cleanupByNombre('sala', 'Sala Test Admin')
  })

  it('crear sala desde el panel Admin', () => {
    cy.visit('/admin')
    cy.get('[data-testid="tab-salas"]').should('have.class', 'active')
    cy.get('[data-testid="btn-agregar-salas"]').click()
    cy.get('[data-testid="input-nombre-sala"]').type('Sala Test Admin')
    cy.get('[data-testid="input-capacidad-sala"]').clear().type('20')
    cy.get('[data-testid="btn-guardar"]').click()
    cy.contains('Sala Test Admin').should('exist')
  })

  it('generar asientos para la sala creada', () => {
    cy.visit('/admin')
    cy.get('[data-testid="tab-asientos"]', { timeout: 10000 }).should('be.visible').click()
    cy.get('[data-testid="select-sala-asientos"]').select('Sala Test Admin')
    cy.get('[data-testid="btn-agregar-asientos"]').click()
    cy.get('[data-testid="input-fila-asientos"]').clear().type('A')
    cy.get('[data-testid="input-numero-inicio"]').clear().type('1')
    cy.get('[data-testid="input-cantidad-asientos"]').clear().type('10')
    cy.get('[data-testid="btn-generar-asientos"]').click()
    cy.contains('A1').should('exist')
  })
})
