import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/login.css';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dulceria" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      setError('Ingresa usuario y contraseña');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login(usuario, password);
      navigate('/dulceria', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">CV</span>
          <h1>CineVIP POS</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
