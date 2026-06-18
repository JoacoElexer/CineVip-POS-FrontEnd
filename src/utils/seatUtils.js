export function extractOccupiedSeatIds(asientos) {
  return asientos.filter(a => a.ocupado).map(a => `${a.fila}${a.numero}`);
}

export function toggleSeatInList(seats, seatId) {
  if (seats.includes(seatId)) return seats.filter(s => s !== seatId);
  return [...seats, seatId];
}
