import { useState } from 'react';
import { useUsuario } from '../hooks/useUsuario.js';
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineCalendar, HiOutlineSave } from 'react-icons/hi';
import '../styles/cuenta.css';

export default function Cuenta() {
  const { usuario, actualizar } = useUsuario();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre: usuario.nombre || '', email: usuario.email || '' });

  const handleSave = () => {
    actualizar({ nombre: form.nombre, email: form.email });
    setEditing(false);
  };

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
          <span>{usuario.nombre?.charAt(0) || 'U'}</span>
        </div>

        <div className="cuenta-info-grid">
          <div className="cuenta-field">
            <label><HiOutlineUser /> Nombre</label>
            {editing ? (
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
            ) : (
              <span className="cuenta-value">{usuario.nombre}</span>
            )}
          </div>

          <div className="cuenta-field">
            <label><HiOutlineMail /> Email</label>
            {editing ? (
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            ) : (
              <span className="cuenta-value">{usuario.email}</span>
            )}
          </div>

          <div className="cuenta-field">
            <label><HiOutlineShieldCheck /> Rol</label>
            <span className="cuenta-value">
              <span className="cuenta-rol-badge">{usuario.rol}</span>
            </span>
          </div>

          <div className="cuenta-field">
            <label><HiOutlineCalendar /> Último Acceso</label>
            <span className="cuenta-value">{usuario.ultimo_acceso}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
