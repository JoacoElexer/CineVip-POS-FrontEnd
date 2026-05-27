import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineSave } from 'react-icons/hi';
import '../styles/cuenta.css';

export default function Cuenta() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre: user?.nombre || '', email: user?.email || '' });

  const handleSave = () => {
    const updated = { ...user, nombre: form.nombre, email: form.email };
    sessionStorage.setItem('pos_cine_usuarios', JSON.stringify(updated));
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="cuenta">
      <div className="cuenta-header">
        <h2>Mi Cuenta</h2>
        <button className="cuenta-edit-btn" onClick={() => editing ? handleSave() : setEditing(true)}>
          {editing ? <><HiOutlineSave /> Guardar</> : <><HiOutlineUser /> Editar Perfil</>}
        </button>
      </div>

      <div className="cuenta-card">
        <div className="cuenta-avatar">
          <span>{user.nombre?.charAt(0) || 'U'}</span>
        </div>

        <div className="cuenta-info-grid">
          <div className="cuenta-field">
            <label><HiOutlineUser /> Nombre</label>
            {editing ? (
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            ) : (
              <span className="cuenta-value">{user.nombre}</span>
            )}
          </div>

          <div className="cuenta-field">
            <label><HiOutlineMail /> Email</label>
            {editing ? (
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            ) : (
              <span className="cuenta-value">{user.email}</span>
            )}
          </div>

          <div className="cuenta-field">
            <label><HiOutlineShieldCheck /> Rol</label>
            <span className="cuenta-value">
              <span className="cuenta-rol-badge">{user.rol}</span>
            </span>
          </div>

          <div className="cuenta-field">
            <label><HiOutlineCalendar /> Último Acceso</label>
            <span className="cuenta-value">{user.ultimo_acceso}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
