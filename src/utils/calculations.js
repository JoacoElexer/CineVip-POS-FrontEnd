export function calcSubtotal(items) {
  return items.reduce((sum, i) => sum + (i.precio || 0) * i.cantidad, 0);
}

export function calcPropina(subtotal, porcentaje) {
  return +(subtotal * (porcentaje / 100)).toFixed(2);
}

export function calcTotal(subtotal, propina) {
  return +(subtotal + propina).toFixed(2);
}

export function calcTotalItems(items) {
  return items.reduce((sum, i) => sum + i.cantidad, 0);
}

export function calcTicketTotal(seatCount, precio) {
  return seatCount * (precio || 5.50);
}
