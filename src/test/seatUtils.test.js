import { describe, it, expect } from 'vitest'
import { extractOccupiedSeatIds, toggleSeatInList } from '../utils/seatUtils'

describe('seatUtils', () => {
  describe('extractOccupiedSeatIds', () => {
    it('retorna un arreglo vacio cuando no hay asientos ocupados', () => {
      const asientos = [
        { fila: 'A', numero: 1, ocupado: false },
        { fila: 'A', numero: 2, ocupado: false }
      ]
      const result = extractOccupiedSeatIds(asientos)
      expect(result).toEqual([])
    })

    it('retorna los identificadores fila+numero de los asientos ocupados', () => {
      const asientos = [
        { fila: 'A', numero: 1, ocupado: true },
        { fila: 'A', numero: 2, ocupado: false },
        { fila: 'B', numero: 1, ocupado: true }
      ]
      const result = extractOccupiedSeatIds(asientos)
      expect(result).toEqual(['A1', 'B1'])
    })
  })

  describe('toggleSeatInList', () => {
    it('agrega el asiento cuando no estaba seleccionado', () => {
      const seats = ['A1', 'A2']
      const result = toggleSeatInList(seats, 'A3')
      expect(result).toEqual(['A1', 'A2', 'A3'])
    })

    it('quita el asiento cuando ya estaba seleccionado', () => {
      const seats = ['A1', 'A2', 'A3']
      const result = toggleSeatInList(seats, 'A2')
      expect(result).toEqual(['A1', 'A3'])
    })
  })
})
