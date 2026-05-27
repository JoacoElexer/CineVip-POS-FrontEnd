import { useState } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import { useProductos } from '../hooks/useProductos.js';
import { useCategorias } from '../hooks/useCategorias.js';
import Modal from '../components/common/Modal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import '../styles/inventario.css';

export default function Inventario() {
  const { productos, agregar, actualizar, eliminar } = useProductos();
  const { categorias } = useCategorias();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ nombre: '', id_categoria: '', precio: '', stock_actual: '', emoji: '📦' });

  const filtered = productos.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', id_categoria: categorias[0]?.id_categoria || '', precio: '', stock_actual: '', emoji: '📦' });
    setShowModal(true);
  };

  const openEdit = (producto) => {
    setEditing(producto);
    setForm({
      nombre: producto.nombre || '',
      id_categoria: producto.id_categoria || '',
      precio: producto.precio || '',
      stock_actual: producto.stock_actual ?? '',
      emoji: producto.emoji || '📦',
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.precio) return;
    const data = {
      nombre: form.nombre,
      id_categoria: Number(form.id_categoria),
      precio: Number(form.precio),
      stock_actual: form.stock_actual !== '' ? Number(form.stock_actual) : 0,
      emoji: form.emoji,
    };

    if (editing) {
      actualizar(editing.id_producto, data);
    } else {
      agregar(data);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) eliminar(deleteId);
    setDeleteId(null);
  };

  const getCategoriaNombre = (id) => categorias.find(c => c.id_categoria === id)?.nombre || 'N/A';
  const getStock = (p) => p.stock_actual ?? '—';

  return (
    <div className="inventario">
      <div className="inventario-header">
        <h2>Inventario</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="inventario-search">
            <HiOutlineSearch />
            <input type="text" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="inv-add-btn" onClick={openCreate}>
            <HiOutlinePlus /> Agregar
          </button>
        </div>
      </div>

      {productos.length === 0 ? (
        <EmptyState icon="📦" message="No hay productos registrados" submessage="Agrega tu primer producto usando el botón 'Agregar'" />
      ) : (
        <div className="inventario-table-wrapper">
          <table className="inventario-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
                <th style={{ width: '80px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id_producto}>
                  <td className="inv-prod-name">
                    <span style={{ fontSize: '20px', marginRight: '8px' }}>{p.emoji || '📦'}</span>
                    {p.nombre}
                  </td>
                  <td>{getCategoriaNombre(p.id_categoria)}</td>
                  <td><span className="inv-stock">{getStock(p)}</span></td>
                  <td className="inv-price">${(p.precio || 0).toFixed(2)}</td>
                  <td>
                    <div className="inv-actions">
                      <button className="inv-action-btn" onClick={() => openEdit(p)}><HiOutlinePencil /></button>
                      <button className="inv-action-btn inv-action-delete" onClick={() => setDeleteId(p.id_producto)}><HiOutlineTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Producto' : 'Nuevo Producto'}>
        <div className="inv-form">
          <div className="inv-form-group">
            <label>Nombre del producto</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Palomitas Grandes" />
          </div>
          <div className="inv-form-group">
            <label>Categoría</label>
            <select value={form.id_categoria} onChange={e => setForm({ ...form, id_categoria: e.target.value })}>
              <option value="">Seleccionar categoría</option>
              {categorias.map(c => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="inv-form-group" style={{ flex: 1 }}>
              <label>Precio ($)</label>
              <input type="number" step="0.01" min="0" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} placeholder="0.00" />
            </div>
            <div className="inv-form-group" style={{ flex: 1 }}>
              <label>Stock</label>
              <input type="number" min="0" value={form.stock_actual} onChange={e => setForm({ ...form, stock_actual: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div className="inv-form-group">
            <label>Emoji</label>
            <input type="text" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="📦" maxLength="5" />
          </div>
          <div className="inv-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="inv-form-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear Producto'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        message="¿Estás seguro de eliminar este producto?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        confirmText="Eliminar"
        danger
      />
    </div>
  );
}
