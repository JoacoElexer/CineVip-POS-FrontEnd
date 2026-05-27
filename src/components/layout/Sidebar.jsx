import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineTicket, HiOutlineShoppingBag, HiOutlineArchive, HiOutlineChartBar, HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/sidebar.css';

const allNavItems = [
  { to: '/dulceria', icon: HiOutlineShoppingBag, label: 'Dulcería', roles: ['Administrador', 'Cajero'] },
  { to: '/boletera', icon: HiOutlineTicket, label: 'Boletera', roles: ['Administrador', 'Cajero'] },
  { to: '/inventario', icon: HiOutlineArchive, label: 'Inventario', roles: ['Administrador', 'Almacenista'] },
  { to: '/reportes', icon: HiOutlineChartBar, label: 'Reportes', roles: ['Administrador', 'Cajero'] },
  { to: '/admin', icon: HiOutlineCog, label: 'Admin', roles: ['Administrador'] },
  { to: '/cuenta', icon: HiOutlineUser, label: 'Cuenta' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(user?.rol));

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-text">CV</span>
      </div>
      <div className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <HiOutlineLogout className="sidebar-icon" />
          <span className="sidebar-label">Salir</span>
        </button>
      </div>
    </nav>
  );
}
