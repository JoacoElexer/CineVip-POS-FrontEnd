import { HiOutlinePlus } from 'react-icons/hi';

export default function ProductCard({ producto, onAdd }) {
  const coloresPlaceholder = ['#ff6b6b', '#ffa502', '#2ed573', '#1e90ff', '#a29bfe', '#fd79a8', '#e17055', '#00cec9'];
  const colorIndex = producto.id % coloresPlaceholder.length;
  const bgColor = coloresPlaceholder[colorIndex];

  return (
    <div className="product-card">
      <div className="product-image" style={{ background: bgColor }}>
        <span className="product-emoji">{producto.emoji}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{producto.nombre}</h3>
        <span className="product-price">${producto.precio.toFixed(2)}</span>
      </div>
      <button className="product-add-btn" onClick={() => onAdd(producto)}>
        <HiOutlinePlus />
        Agregar
      </button>
    </div>
  );
}
