import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createEmpleado } from '../services/usuarios.js';
import '../styles/login.css';

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', email: '', usuario: '', password: '', rol: 'Cajero', telefono: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dulceria" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.usuario.trim() || !form.password.trim()) {
      setError('Nombre, usuario y contraseña son obligatorios');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createEmpleado({
        nombre: form.nombre,
        usuario: form.usuario,
        password: form.password,
        email: form.email || undefined,
        telefono: form.telefono || undefined,
        rol: form.rol,
        activo: true,
      });
      setSuccess('Cuenta creada exitosamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al crear la cuenta');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">CV</span>
          <h1>Crear Cuenta</h1>
          <p>Regístrate para usar el sistema</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}

          <div className="login-field">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" autoFocus />
          </div>

          <div className="login-field">
            <label htmlFor="reg-usuario">Usuario</label>
            <input id="reg-usuario" type="text" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} placeholder="usuario" />
          </div>

          <div className="login-field">
            <label htmlFor="reg-password">Contraseña</label>
            <input id="reg-password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="********" />
          </div>

          <div className="login-field">
            <label htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@cinevip.com" />
          </div>

          <div className="login-field">
            <label htmlFor="reg-telefono">Teléfono</label>
            <input id="reg-telefono" type="text" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="555-1234" />
          </div>

          <div className="login-field">
            <label htmlFor="reg-rol">Rol</label>
            <select id="reg-rol" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} className="login-select">
              <option value="Cajero">Cajero</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={submitting || !!success}>
            {submitting ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>
        <p className="login-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
