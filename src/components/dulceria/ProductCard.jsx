import { HiOutlinePlus } from 'react-icons/hi';

const coloresPlaceholder = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe', '#fd79a8', '#e17055', '#00cec9'];

export default function ProductCard({ producto, onAdd }) {
  const colorIndex = (producto.id_producto || 0) % coloresPlaceholder.length;
  const stock = producto.stock_actual;
  const agotado = stock !== undefined && stock <= 0;
  const stockBajo = stock !== undefined && stock > 0 && stock <= 5;

  return (
    <div className="product-card" data-testid={`producto-${producto.id_producto}`}>
      <div className="product-image" style={{ background: coloresPlaceholder[colorIndex] }}>
        <span className="product-emoji">{producto.emoji || '📦'}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <span className="product-price">${(producto.precio || 0).toFixed(2)}</span>
        {agotado && <span className="product-stock product-stock-agotado">Agotado</span>}
        {stockBajo && <span className="product-stock product-stock-bajo">Stock: {stock}</span>}
      </div>
      <button className="product-add-btn" data-testid={`btn-agregar-${producto.id_producto}`} disabled={agotado} onClick={() => onAdd(producto)}>
        <HiOutlinePlus />
        {agotado ? 'Agotado' : 'Agregar'}
      </button>
    </div>
  );
}
