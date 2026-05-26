import { useState, useMemo } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);
  const [propinaPorcentaje, setPropinaPorcentaje] = useState(10);

  const addItem = (producto) => {
    setItems(prev => {
      const existente = prev.find(i => i.id_producto === producto.id_producto);
      if (existente) {
        return prev.map(i =>
          i.id_producto === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
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

  const subtotal = useMemo(() =>
    items.reduce((sum, i) => sum + (i.precio || 0) * i.cantidad, 0),
    [items]
  );

  const propina = useMemo(() =>
    +(subtotal * (propinaPorcentaje / 100)).toFixed(2),
    [subtotal, propinaPorcentaje]
  );

  const total = useMemo(() =>
    +(subtotal + propina).toFixed(2),
    [subtotal, propina]
  );

  const totalItems = useMemo(() =>
    items.reduce((sum, i) => sum + i.cantidad, 0),
    [items]
  );

  return {
    items, addItem, removeItem, updateQuantity, clearCart,
    subtotal, propina, total, totalItems,
    propinaPorcentaje, setPropinaPorcentaje
  };
}
