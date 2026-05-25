export const pelicula = {
  id: 1,
  nombre: 'Deadpool & Wolverine',
  imagen: '🎬',
  clasificacion: 'B-15',
  duracion: '128 min',
  cine: 'CineVIP Centro',
  sala: 4,
  fecha: '25 Mayo, 2026',
  hora: '7:30 PM',
  precioBoleto: 5.50,
};

export const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
export const asientosPorFila = 12;

export function generarAsientosOcupados() {
  const ocupados = new Set();
  const cantidadOcupados = Math.floor(Math.random() * 4) + 2;
  while (ocupados.size < cantidadOcupados) {
    const fila = filas[Math.floor(Math.random() * filas.length)];
    const numero = Math.floor(Math.random() * asientosPorFila) + 1;
    ocupados.add(`${fila}${numero}`);
  }
  return ocupados;
}

export const asientosSillaRuedas = new Set(['A1', 'A2', 'L11', 'L12']);
