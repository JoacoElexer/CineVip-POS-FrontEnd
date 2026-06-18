import { useState, useMemo } from 'react';
import { calcSubtotal, calcPropina, calcTotal, calcTotalItems } from '../utils/calculations.js';

export function useCart() {
  const [items, setItems] = useState([]);
  const [propinaPorcentaje, setPropinaPorcentaje] = useState(10);

  const addItem = (producto) => {
    const stock = producto.stock_actual ?? Infinity;
    let added = false;
    setItems(prev => {
      const existente = prev.find(i => i.id_producto === producto.id_producto);
      if (existente) {
        if (existente.cantidad >= stock) return prev;
        added = true;
        return prev.map(i =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      if (stock <= 0) return prev;
      added = true;
      return [...prev, { ...producto, cantidad: 1 }];
    });
    return { success: added, reason: added ? null : (stock <= 0 ? 'Sin stock' : 'Stock máximo alcanzado') };
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id_producto !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i =>
      i.id_producto === id ? { ...i, cantidad } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    setPropinaPorcentaje(10);
  };

  const subtotal = useMemo(() => calcSubtotal(items), [items]);

  const propina = useMemo(() => calcPropina(subtotal, propinaPorcentaje), [subtotal, propinaPorcentaje]);

  const total = useMemo(() => calcTotal(subtotal, propina), [subtotal, propina]);

  const totalItems = useMemo(() => calcTotalItems(items), [items]);

  return {
    items, addItem, removeItem, updateQuantity, clearCart,
    subtotal, propina, total, totalItems,
    propinaPorcentaje, setPropinaPorcentaje
  };
}
