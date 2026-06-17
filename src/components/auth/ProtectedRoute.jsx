import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logService from '../../utils/logService.js';

const roleHome = {
  Administrador: '/admin',
  Cajero: '/dulceria',
  Almacenista: '/inventario',
};

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    logService.warn('Auth', 'acceso_bloqueado', {
      usuario: user.usuario || user.email,
      rol: user.rol,
      ruta: location.pathname,
      roles_requeridos: allowedRoles,
    });
    return <Navigate to={roleHome[user.rol] || '/dulceria'} replace />;
  }

  return <Outlet />;
}
