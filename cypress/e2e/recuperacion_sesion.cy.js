describe('Recuperacion de sesion', () => {
  it('sin autenticacion redirige a /login al visitar ruta protegida', () => {
    cy.visit('/boletera')
    cy.url().should('include', '/login')
  })

  it('token invalido en sessionStorage no redirige automaticamente (comportamiento esperado: el frontend no valida token al cargar)', () => {
    cy.window().then(win => {
      win.sessionStorage.setItem('token', 'token-falso-invalido')
      win.sessionStorage.setItem('pos_cine_usuarios', JSON.stringify({
        id_usuario: 999, nombre: 'Fake', usuario: 'fake', rol: 'Administrador',
      }))
    })
    cy.visit('/admin')
    cy.get('[data-testid="tab-salas"]', { timeout: 8000 }).should('be.visible')
  })
})
