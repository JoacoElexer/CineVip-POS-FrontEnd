import { useState, useEffect } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';
import '../../styles/header.css';

export default function Header() {
  const { user } = useAuth();
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fechaFormateada = hora.toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const horaFormateada = hora.toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-empresa">CineVIP</h1>
        <span className="header-subtitle">Sistema POS</span>
      </div>
      <div className="header-right">
        <div className="header-info">
          <HiOutlineUser className="header-user-icon" />
          <span className="header-user">Operador: {user?.nombre || '—'}</span>
        </div>
        <div className="header-datetime">
          <span className="header-date">{fechaFormateada}</span>
          <span className="header-time">{horaFormateada}</span>
        </div>
      </div>
    </header>
  );
}
