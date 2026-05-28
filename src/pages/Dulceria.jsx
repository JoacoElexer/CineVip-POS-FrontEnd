import { useState, useRef } from 'react';
import { useProductos } from '../hooks/useProductos.js';
import { useCategorias } from '../hooks/useCategorias.js';
import { useVentas } from '../hooks/useVentas.js';
import CategoryTabs from '../components/dulceria/CategoryTabs.jsx';
import ProductCard from '../components/dulceria/ProductCard.jsx';
import SaleSummaryModal from '../components/dulceria/SaleSummaryModal.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useCart } from '../hooks/useCart.js';
import '../styles/dulceria.css';

export default function Dulceria() {
  const [activeCategoria, setActiveCategoria] = useState(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saleDone, setSaleDone] = useState(false);
  const [stockAlert, setStockAlert] = useState('');
  const stockTimer = useRef(null);

  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const { registrarVenta } = useVentas();
  const cart = useCart();

  const catActual = activeCategoria || (categorias.length > 0 ? categorias[0].id_categoria : null);
  const filteredProductos = catActual
    ? productos.filter(p => p.id_categoria === catActual)
    : [];

  const handleAdd = (producto) => {
    const result = cart.addItem(producto);
    if (!result.success) {
      if (stockTimer.current) clearTimeout(stockTimer.current);
      setStockAlert(result.reason || 'No disponible');
      stockTimer.current = setTimeout(() => setStockAlert(''), 3000);
    } else {
      if (!isSummaryOpen) setIsSummaryOpen(true);
    }
  };

  const handleFinishSale = () => {
    setShowConfirm(true);
  };

  const confirmSale = () => {
    registrarVenta({
      items: cart.items,
      subtotal: cart.subtotal,
      propina: cart.propina,
      propina_porcentaje: cart.propinaPorcentaje,
      total: cart.total,
      tipo: 'dulceria'
    });
    cart.clearCart();
    setShowConfirm(false);
    setIsSummaryOpen(false);
    setSaleDone(true);
    setTimeout(() => setSaleDone(false), 3000);
  };

  if (productos.length === 0 && categorias.length === 0) {
    return <EmptyState icon="🍿" message="No hay productos disponibles" submessage="Agrega productos desde Inventario y categorías desde Administración" />;
  }

  if (categorias.length === 0) {
    return <EmptyState icon="📂" message="No hay categorías" submessage="Agrega categorías desde la sección Admin" />;
  }

  return (
    <div className="dulceria">
      <CategoryTabs
        categorias={categorias}
        activeCategoria={catActual}
        onSelect={(id) => setActiveCategoria(id)}
      />

      <div className="dulceria-content">
        {filteredProductos.length === 0 ? (
          <EmptyState icon="📦" message="No hay productos en esta categoría" submessage="Agrega productos desde Inventario" />
        ) : (
          <div className="products-grid">
            {filteredProductos.map(p => (
              <ProductCard key={p.id_producto} producto={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>

      {stockAlert && (
        <div className="stock-alert">{stockAlert}</div>
      )}

      {saleDone && (
        <div className="sale-toast">
          ✅ Venta registrada exitosamente
        </div>
      )}

      {cart.totalItems > 0 && (
        <button className="dulceria-fab" onClick={() => setIsSummaryOpen(true)}>
          <span className="fab-icon">🛒</span>
          <span className="fab-badge">{cart.totalItems}</span>
          <span className="fab-total">${cart.total.toFixed(2)}</span>
        </button>
      )}

      <SaleSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        items={cart.items}
        subtotal={cart.subtotal}
        propina={cart.propina}
        propinaPorcentaje={cart.propinaPorcentaje}
        setPropinaPorcentaje={cart.setPropinaPorcentaje}
        total={cart.total}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onFinishSale={handleFinishSale}
      />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Venta" width="400px">
        <div style={{ padding: '8px 0' }}>
          <p style={{ marginBottom: '16px', color: 'var(--text-dark)' }}>
            ¿Confirmas la venta por <strong>${cart.total.toFixed(2)}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="summary-btn summary-btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button className="summary-btn summary-btn-primary" onClick={confirmSale}>Confirmar Venta</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
