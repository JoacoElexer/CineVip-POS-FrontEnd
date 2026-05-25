import { NavLink } from 'react-router-dom';
import { HiOutlineTicket, HiOutlineShoppingBag, HiOutlineArchive, HiOutlineChartBar, HiOutlineUser } from 'react-icons/hi';
import '../../styles/sidebar.css';

const navItems = [
  { to: '/dulceria', icon: HiOutlineShoppingBag, label: 'Dulcería' },
  { to: '/boletera', icon: HiOutlineTicket, label: 'Boletera' },
  { to: '/inventario', icon: HiOutlineArchive, label: 'Inventario' },
  { to: '/reportes', icon: HiOutlineChartBar, label: 'Reportes' },
  { to: '/cuenta', icon: HiOutlineUser, label: 'Cuenta' },
];

export default function Sidebar() {
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
    </nav>
  );
}
