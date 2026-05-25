import { HiOutlineSearch, HiOutlineArchive } from 'react-icons/hi';
import '../styles/inventario.css';

const productosMock = [
  { id: 1, nombre: 'Palomitas Pequeñas', categoria: 'Dulcería', stock: 150, precio: '$55.00' },
  { id: 2, nombre: 'Palomitas Grandes', categoria: 'Dulcería', stock: 120, precio: '$80.00' },
  { id: 3, nombre: 'Refresco Cola', categoria: 'Comida', stock: 200, precio: '$50.00' },
  { id: 4, nombre: 'Hot Dog', categoria: 'Comida', stock: 80, precio: '$65.00' },
  { id: 5, nombre: 'Helado', categoria: 'Postres', stock: 60, precio: '$58.00' },
  { id: 6, nombre: 'Cerveza', categoria: 'Coctelería', stock: 100, precio: '$75.00' },
  { id: 7, nombre: 'Nachos', categoria: 'Comida', stock: 90, precio: '$70.00' },
  { id: 8, nombre: 'Combo 1 (Palomitas + 2 Refrescos)', categoria: 'Combos', stock: 50, precio: '$120.00' },
  { id: 9, nombre: 'Churros', categoria: 'Postres', stock: 70, precio: '$52.00' },
  { id: 10, nombre: 'Piña Colada', categoria: 'Coctelería', stock: 40, precio: '$95.00' },
];

export default function Inventario() {
  return (
    <div className="inventario">
      <div className="inventario-header">
        <h2>Inventario</h2>
        <div className="inventario-search">
          <HiOutlineSearch />
          <input type="text" placeholder="Buscar producto..." />
        </div>
      </div>

      <div className="inventario-table-wrapper">
        <table className="inventario-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {productosMock.map(p => (
              <tr key={p.id}>
                <td className="inv-prod-name">
                  <HiOutlineArchive className="inv-prod-icon" />
                  {p.nombre}
                </td>
                <td>{p.categoria}</td>
                <td><span className="inv-stock">{p.stock}</span></td>
                <td className="inv-price">{p.precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
