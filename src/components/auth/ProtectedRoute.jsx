import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const roleHome = {
  Administrador: '/admin',
  Cajero: '/dulceria',
  Almacenista: '/inventario',
};

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to={roleHome[user.rol] || '/dulceria'} replace />;
  }

  return <Outlet />;
}
