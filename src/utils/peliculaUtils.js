export function normalizePelicula(p) {
  return { ...p, id: p._id || p.id, nombre: p.titulo || p.nombre, genero: p.genero || (Array.isArray(p.generos) ? p.generos[0] : '') };
}

export function toBackendPelicula(p) {
  const data = { ...p };
  delete data.id;
  data.titulo = data.nombre;
  delete data.nombre;
  data.generos = data.genero ? [data.genero] : [];
  delete data.genero;
  return data;
}
