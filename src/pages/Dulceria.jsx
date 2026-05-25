import { useState } from 'react';
import { categorias, productos } from '../data/productos.js';
import CategoryTabs from '../components/dulceria/CategoryTabs.jsx';
import ProductCard from '../components/dulceria/ProductCard.jsx';
import SaleSummaryModal from '../components/dulceria/SaleSummaryModal.jsx';
import { useCart } from '../hooks/useCart.js';
import '../styles/dulceria.css';

export default function Dulceria() {
  const [activeCategoria, setActiveCategoria] = useState('dulceria');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { items, addItem, removeItem, updateQuantity, subtotal, propina, total, totalItems } = useCart();

  const filteredProductos = productos.filter(p => p.categoria === activeCategoria);

  const handleAdd = (producto) => {
    addItem(producto);
    if (!isSummaryOpen) setIsSummaryOpen(true);
  };

  return (
    <div className="dulceria">
      <CategoryTabs
        categorias={categorias}
        activeCategoria={activeCategoria}
        onSelect={setActiveCategoria}
      />

      <div className="dulceria-content">
        <div className="products-grid">
          {filteredProductos.map(p => (
            <ProductCard key={p.id} producto={p} onAdd={handleAdd} />
          ))}
        </div>
      </div>

      {totalItems > 0 && (
        <button className="dulceria-fab" onClick={() => setIsSummaryOpen(true)}>
          <span className="fab-icon">🛒</span>
          <span className="fab-badge">{totalItems}</span>
          <span className="fab-total">${total.toFixed(2)}</span>
        </button>
      )}

      <SaleSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        items={items}
        subtotal={subtotal}
        propina={propina}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}
