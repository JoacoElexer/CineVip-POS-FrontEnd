import { describe, it, expect } from 'vitest'
import { formatHorarioDisplay, getTodayDate } from '../utils/dateUtils'

describe('dateUtils', () => {
  describe('formatHorarioDisplay', () => {
    it('retorna la hora sin segundos cuando el campo hora esta presente', () => {
      const result = formatHorarioDisplay('20:30:00', null)
      expect(result).toBe('20:30')
    })

    it('retorna cadena vacia cuando no hay hora ni horario', () => {
      const result = formatHorarioDisplay(null, null)
      expect(result).toBe('')
    })

    it('extrae HH:MM de un horario sin zona horaria', () => {
      const result = formatHorarioDisplay(null, '2026-06-18T20:30:00')
      expect(result).toBe('20:30')
    })
  })

  describe('getTodayDate', () => {
    it('retorna una cadena con formato YYYY-MM-DD', () => {
      const result = getTodayDate()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})
