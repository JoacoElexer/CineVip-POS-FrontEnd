Cypress.Commands.add('login', (usuario, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/empleados/login`,
    body: { usuario, password },
  }).then(res => {
    const data = res.body
    const token = data.token || data.accessToken
    const empleado = data.empleado || data.user || data
    const userData = {
      id_usuario: empleado.id ?? empleado.id_usuario ?? empleado._id,
      nombre: empleado.nombre,
      usuario: empleado.usuario,
      rol: empleado.rol,
    }
    window.sessionStorage.setItem('token', token)
    window.sessionStorage.setItem('pos_cine_usuarios', JSON.stringify(userData))
    cy.wrap(token).as('authToken')
    cy.wrap(userData).as('userData')
  })
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin', 'Admin1234')
})

Cypress.Commands.add('loginAsCajero', () => {
  cy.login('cajero', 'Cajero1234')
})

Cypress.Commands.add('seedSala', (nombre, capacidad) => {
  cy.get('@authToken').then(token => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/salas`,
      headers: { Authorization: `Bearer ${token}` },
      body: { nombre, capacidad },
    }).then(res => {
      cy.wrap(res.body.id_sala || res.body.id).as('salaId')
    })
  })
})

Cypress.Commands.add('seedPelicula', (titulo, genero, duracionMinutos) => {
  cy.get('@authToken').then(token => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/peliculas`,
      headers: { Authorization: `Bearer ${token}` },
      body: { titulo, generos: [genero], duracion: duracionMinutos, clasificacion: 'B' },
    }).then(res => {
      cy.wrap(res.body.id || res.body._id).as('peliculaId')
    })
  })
})

Cypress.Commands.add('seedAsientos', (fila, inicio, cantidad) => {
  cy.get('@salaId').then(salaId => {
    for (let i = 0; i < cantidad; i++) {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/api/asientos`,
        body: { sala_id: Number(salaId), fila: fila.toUpperCase(), numero: inicio + i },
      })
    }
  })
})

Cypress.Commands.add('seedFuncion', (fecha, hora, precio) => {
  cy.get('@peliculaId').then(peliculaId => {
    cy.get('@salaId').then(salaId => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/api/funciones`,
        body: { pelicula_id: peliculaId, sala_id: Number(salaId), fecha, hora, precio_boleto: precio },
      }).then(res => {
        cy.wrap(res.body.id_funcion || res.body.id).as('funcionId')
      })
    })
  })
})

Cypress.Commands.add('cleanupByNombre', (tipo, nombre) => {
  cy.get('@authToken').then(token => {
    if (tipo === 'sala') {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/api/salas`,
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const sala = (res.body || []).find(s => s.nombre === nombre)
        if (sala) {
          cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiUrl')}/api/salas/${sala.id}`,
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      })
    }
    if (tipo === 'pelicula') {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/api/peliculas`,
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const pelicula = (res.body || []).find(p => p.titulo === nombre)
        if (pelicula) {
          cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiUrl')}/api/peliculas/${pelicula._id || pelicula.id}`,
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      })
    }
  })
})

Cypress.Commands.add('seedAlmacenista', () => {
  cy.get('@authToken').then(token => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/api/empleados`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        usuario: 'almacenista_test',
        password: 'Almacenista1234',
        nombre: 'Almacenista Test',
        rol: 'Almacenista',
      },
    }).then(res => {
      cy.wrap(res.body.id || res.body.id_usuario).as('almacenistaId')
    })
  })
})

Cypress.Commands.add('cleanupAlmacenista', () => {
  cy.get('@authToken').then(token => {
    cy.get('@almacenistaId').then(id => {
      if (!id) return
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiUrl')}/api/empleados/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    })
  })
})
