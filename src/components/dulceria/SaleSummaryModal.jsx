import { HiOutlineX, HiOutlineMinus, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import TipSelector from './TipSelector.jsx';

export default function SaleSummaryModal({
  isOpen, onClose, items, subtotal, propina, propinaPorcentaje,
  setPropinaPorcentaje, total, onUpdateQuantity, onRemoveItem, onFinishSale
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="sale-summary-modal">
        <div className="summary-header">
          <h2>Resumen de Venta</h2>
          <button className="summary-close-btn" onClick={onClose}><HiOutlineX /></button>
        </div>

        <div className="summary-items">
          {items.length === 0 ? (
            <p className="summary-empty">No hay productos agregados</p>
          ) : (
            items.map(item => (
              <div key={item.id_producto} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-emoji">{item.emoji || '📦'}</span>
                  <div>
                    <p className="summary-item-name">{item.nombre}</p>
                    <p className="summary-item-price">${(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                </div>
                <div className="summary-item-controls">
                  <button onClick={() => onUpdateQuantity(item.id_producto, item.cantidad - 1)}>
                    <HiOutlineMinus />
                  </button>
                  <span className="summary-item-qty">{item.cantidad}</span>
                  <button onClick={() => onUpdateQuantity(item.id_producto, item.cantidad + 1)}>
                    <HiOutlinePlus />
                  </button>
                  <button className="summary-item-remove" onClick={() => onRemoveItem(item.id_producto)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="summary-totals">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            <TipSelector propinaPorcentaje={propinaPorcentaje} setPropinaPorcentaje={setPropinaPorcentaje} />
          </div>
          <div className="summary-row">
            <span>Propina ({propinaPorcentaje}%)</span>
            <span>${propina.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-row-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button className="summary-btn summary-btn-primary" onClick={onFinishSale}>
            Terminar venta
          </button>
        </div>
      </div>
    </>
  );
}
