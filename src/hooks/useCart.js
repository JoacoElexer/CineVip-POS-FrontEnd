import { useState, useMemo } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);

  const addItem = (producto) => {
    setItems(prev => {
      const existente = prev.find(i => i.id === producto.id);
      if (existente) {
        return prev.map(i =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, cantidad } : i
    ));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() =>
    items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    [items]
  );

  const propina = useMemo(() => +(subtotal * 0.1).toFixed(2), [subtotal]);

  const total = useMemo(() => +(subtotal + propina).toFixed(2), [subtotal, propina]);

  const totalItems = useMemo(() =>
    items.reduce((sum, i) => sum + i.cantidad, 0),
    [items]
  );

  return { items, addItem, removeItem, updateQuantity, clearCart, subtotal, propina, total, totalItems };
}
