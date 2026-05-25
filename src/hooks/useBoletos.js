import { useState, useMemo } from 'react';
import { pelicula } from '../data/funciones.js';

export function useBoletos() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId, isOcupado) => {
    if (isOcupado) return;
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const clearSeats = () => setSelectedSeats([]);

  const total = useMemo(() =>
    selectedSeats.length * pelicula.precioBoleto,
    [selectedSeats.length]
  );

  return { selectedSeats, toggleSeat, clearSeats, total, movieInfo: pelicula };
}
