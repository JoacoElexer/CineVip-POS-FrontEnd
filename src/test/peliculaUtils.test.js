import { describe, it, expect } from 'vitest'
import { normalizePelicula, toBackendPelicula } from '../utils/peliculaUtils'

describe('peliculaUtils', () => {
  describe('normalizePelicula', () => {
    it('mapea _id a id y titulo a nombre desde MongoDB', () => {
      const data = { _id: 'abc123', titulo: 'Inception', duracion: 148 }
      const result = normalizePelicula(data)
      expect(result.id).toBe('abc123')
    })

    it('convierte generos array a string genero con el primer elemento', () => {
      const data = { _id: 'abc123', titulo: 'Inception', generos: ['Accion', 'Suspenso'] }
      const result = normalizePelicula(data)
      expect(result.genero).toBe('Accion')
    })
  })

  describe('toBackendPelicula', () => {
    it('convierte nombre a titulo y elimina id', () => {
      const data = { id: 'abc123', nombre: 'Inception', genero: 'Accion' }
      const result = toBackendPelicula(data)
      expect(result.titulo).toBe('Inception')
    })

    it('convierte genero string a generos array', () => {
      const data = { nombre: 'Inception', genero: 'Accion' }
      const result = toBackendPelicula(data)
      expect(result.generos).toEqual(['Accion'])
    })
  })
})
