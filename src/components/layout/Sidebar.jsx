import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineTicket, HiOutlineShoppingBag, HiOutlineArchive, HiOutlineChartBar, HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/sidebar.css';

const allNavItems = [
  { to: '/dulceria', icon: HiOutlineShoppingBag, label: 'Dulcería' },
  { to: '/boletera', icon: HiOutlineTicket, label: 'Boletera' },
  { to: '/inventario', icon: HiOutlineArchive, label: 'Inventario', adminOnly: true },
  { to: '/reportes', icon: HiOutlineChartBar, label: 'Reportes' },
  { to: '/admin', icon: HiOutlineCog, label: 'Admin', adminOnly: true },
  { to: '/cuenta', icon: HiOutlineUser, label: 'Cuenta' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.rol === 'Administrador';
  const navItems = allNavItems.filter(item => !item.adminOnly || isAdmin);

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
