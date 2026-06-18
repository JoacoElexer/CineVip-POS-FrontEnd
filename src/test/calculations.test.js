import { describe, it, expect } from 'vitest'
import { calcSubtotal, calcPropina, calcTotal, calcTotalItems, calcTicketTotal } from '../utils/calculations'

describe('calculations', () => {
  describe('calcSubtotal', () => {
    it('retorna 0 cuando el carrito esta vacio', () => {
      const items = []
      const result = calcSubtotal(items)
      expect(result).toBe(0)
    })

    it('suma correctamente los precios de varios productos', () => {
      const items = [
        { precio: 100, cantidad: 2 },
        { precio: 50, cantidad: 1 }
      ]
      const result = calcSubtotal(items)
      expect(result).toBe(250)
    })

    it('usa 0 cuando un producto no tiene precio definido', () => {
      const items = [
        { precio: 100, cantidad: 1 },
        { cantidad: 2 }
      ]
      const result = calcSubtotal(items)
      expect(result).toBe(100)
    })
  })

  describe('calcPropina', () => {
    it('retorna 0 cuando el porcentaje es 0', () => {
      const result = calcPropina(200, 0)
      expect(result).toBe(0)
    })

    it('calcula correctamente el 10 por ciento de 200', () => {
      const result = calcPropina(200, 10)
      expect(result).toBe(20)
    })
  })

  describe('calcTotal', () => {
    it('retorna el subtotal sin cambios cuando la propina es 0', () => {
      const result = calcTotal(200, 0)
      expect(result).toBe(200)
    })

    it('suma subtotal y propina correctamente', () => {
      const result = calcTotal(200, 30)
      expect(result).toBe(230)
    })
  })

  describe('calcTotalItems', () => {
    it('retorna 0 cuando el carrito esta vacio', () => {
      const result = calcTotalItems([])
      expect(result).toBe(0)
    })

    it('suma las cantidades de todos los items', () => {
      const items = [
        { cantidad: 3 },
        { cantidad: 2 },
        { cantidad: 1 }
      ]
      const result = calcTotalItems(items)
      expect(result).toBe(6)
    })
  })

  describe('calcTicketTotal', () => {
    it('multiplica la cantidad de asientos por el precio', () => {
      const result = calcTicketTotal(3, 120)
      expect(result).toBe(360)
    })

    it('retorna 0 cuando no hay asientos seleccionados', () => {
      const result = calcTicketTotal(0, 120)
      expect(result).toBe(0)
    })

    it('usa precio por defecto 5.50 cuando no se especifica precio', () => {
      const result = calcTicketTotal(2, null)
      expect(result).toBe(11)
    })
  })
})
