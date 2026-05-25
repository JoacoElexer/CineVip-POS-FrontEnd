import { HiOutlineCurrencyDollar, HiOutlineCash, HiOutlineCreditCard, HiOutlineReceiptTax } from 'react-icons/hi';
import '../styles/reporte.css';

export default function ReporteCierre() {
  return (
    <div className="reporte">
      <h2 className="reporte-title">Reporte de Cierre</h2>

      <div className="reporte-cards">
        <div className="reporte-card">
          <div className="reporte-card-icon" style={{ background: 'rgba(255,107,157,0.15)' }}>
            <HiOutlineCurrencyDollar style={{ color: 'var(--accent)' }} />
          </div>
          <div className="reporte-card-info">
            <span className="reporte-card-label">Total Ventas</span>
            <span className="reporte-card-value">$0.00</span>
          </div>
        </div>
        <div className="reporte-card">
          <div className="reporte-card-icon" style={{ background: 'rgba(46,204,113,0.15)' }}>
            <HiOutlineReceiptTax style={{ color: '#2ecc71' }} />
          </div>
          <div className="reporte-card-info">
            <span className="reporte-card-label">Transacciones</span>
            <span className="reporte-card-value">0</span>
          </div>
        </div>
        <div className="reporte-card">
          <div className="reporte-card-icon" style={{ background: 'rgba(52,152,219,0.15)' }}>
            <HiOutlineCash style={{ color: '#3498db' }} />
          </div>
          <div className="reporte-card-info">
            <span className="reporte-card-label">Efectivo</span>
            <span className="reporte-card-value">$0.00</span>
          </div>
        </div>
        <div className="reporte-card">
          <div className="reporte-card-icon" style={{ background: 'rgba(155,89,182,0.15)' }}>
            <HiOutlineCreditCard style={{ color: '#9b59b6' }} />
          </div>
          <div className="reporte-card-info">
            <span className="reporte-card-label">Tarjeta</span>
            <span className="reporte-card-value">$0.00</span>
          </div>
        </div>
      </div>

      <div className="reporte-table-wrapper">
        <h3>Movimientos del día</h3>
        <p style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          Sin movimientos registrados hoy
        </p>
      </div>
    </div>
  );
}
