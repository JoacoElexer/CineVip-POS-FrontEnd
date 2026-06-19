describe('Logout', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    cy.visit('/dulceria')
  })

  it('cerrar sesion limpia sessionStorage y redirige a /login', () => {
    cy.get('[data-testid="btn-cerrar-sesion"]').click()
    cy.url().should('include', '/login')
    cy.window().then(win => {
      expect(win.sessionStorage.getItem('token')).to.be.null
      expect(win.sessionStorage.getItem('pos_cine_usuarios')).to.be.null
    })
  })
})
