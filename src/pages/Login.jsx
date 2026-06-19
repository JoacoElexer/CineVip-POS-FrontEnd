import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logService from '../utils/logService.js';
import '../styles/login.css';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    const home = user.rol === 'Almacenista' ? '/inventario' : '/dulceria';
    return <Navigate to={home} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!usuario.trim() || !password.trim()) {
      setError('Ingresa usuario y contraseña');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const userData = await login(usuario, password);
      logService.info('Login', 'inicio_sesion', { email: usuario, rol: userData.rol });
      const home = userData.rol === 'Almacenista' ? '/inventario' : '/dulceria';
      navigate(home, { replace: true });
    } catch (err) {
      logService.warn('Login', 'login_fallido', { email: usuario, error: err.response?.data?.error || err.message });
      setError(err.response?.data?.error || err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">CV</span>
          <h1>CineVIP POS</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error" data-testid="error-mensaje">{error}</div>}
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              data-testid="input-usuario"
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
              data-testid="input-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn" data-testid="btn-entrar" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="login-footer">
          ¿No tienes cuenta? <Link to="/register" data-testid="link-registro">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
}
