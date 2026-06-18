import { useState, useMemo, useCallback } from 'react';
import { calcTicketTotal } from '../utils/calculations.js';

export function useBoletos() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [funcionActual, setFuncionActual] = useState(null);
  const [peliculaActual, setPeliculaActual] = useState(null);
  const [salaActual, setSalaActual] = useState(null);
  const [asientosOcupados, setAsientosOcupados] = useState([]);

  const toggleSeat = useCallback((seatId, isOcupado) => {
    if (isOcupado) return;
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  }, []);

  const clearSeats = useCallback(() => setSelectedSeats([]), []);

  const seleccionarFuncion = useCallback((funcion, pelicula, sala, asientos) => {
    setFuncionActual(funcion);
    setPeliculaActual(pelicula);
    setSalaActual(sala);
    setAsientosOcupados(asientos || []);
    setSelectedSeats([]);
  }, []);

  const total = useMemo(() => calcTicketTotal(selectedSeats.length, funcionActual?.precio), [selectedSeats.length, funcionActual?.precio]);

  return {
    selectedSeats, toggleSeat, clearSeats, total,
    funcionActual, peliculaActual, salaActual, asientosOcupados,
    seleccionarFuncion, setAsientosOcupados
  };
}
