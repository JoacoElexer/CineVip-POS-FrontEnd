import { useState, useMemo, useEffect } from 'react';
import { HiOutlineCurrencyDollar, HiOutlineCash, HiOutlineCreditCard, HiOutlineReceiptTax, HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';
import { useVentas } from '../hooks/useVentas.js';
import * as reportesService from '../services/reportes.js';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import '../styles/reporte.css';

export default function ReporteCierre() {
  const { getVentasPorFecha } = useVentas();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportesGuardados, setReportesGuardados] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const ventasDelDia = useMemo(() => getVentasPorFecha(selectedDate), [selectedDate, getVentasPorFecha]);

  const totalVentas = useMemo(() => ventasDelDia.reduce((sum, v) => sum + (v.total || 0), 0), [ventasDelDia]);
  const totalTransacciones = ventasDelDia.length;
  const totalEfectivo = useMemo(() => ventasDelDia.reduce((sum, v) => sum + (v.metodo_pago === 'Efectivo' ? v.total : 0), 0), [ventasDelDia]);
  const totalTarjeta = useMemo(() => ventasDelDia.reduce((sum, v) => sum + (v.metodo_pago !== 'Efectivo' ? v.total : 0), 0), [ventasDelDia]);

  useEffect(() => {
    let ignore = false;
    reportesService.getReportesGuardados()
      .then(res => { if (ignore) return; const data = Array.isArray(res.data) ? res.data : []; setReportesGuardados(data.map(r => ({ total: 0, efectivo: 0, tarjeta: 0, transacciones: 0, ...r, id: r._id || r.id }))); })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  const guardarReporte = async () => {
    const reporte = {
      fecha: selectedDate,
      total: totalVentas,
      transacciones: totalTransacciones,
      efectivo: totalEfectivo,
      tarjeta: totalTarjeta,
    };
    try {
      const res = await reportesService.saveReporte(reporte);
      const saved = { ...res.data, id: res.data._id || res.data.id };
      setReportesGuardados(prev => [...prev, saved]);
    } catch {
      const local = { ...reporte, id: 'temp_' + Date.now() };
      setReportesGuardados(prev => [...prev, local]);
    }
  };

  const eliminarReporte = async () => {
    try {
      await reportesService.deleteReporte(deleteId);
    } catch { /* silent */ }
    setReportesGuardados(prev => prev.filter(r => r.id !== deleteId));
    setDeleteId(null);
  };

  const hoy = new Date().toISOString().split('T')[0];

  return (
    <div className="reporte">
      <div className="reporte-header">
        <h2 className="reporte-title">Reporte de Cierre</h2>
        <div className="reporte-controls">
          <div className="reporte-date-group">
            <label>Fecha:</label>
            <input type="date" value={selectedDate} max={hoy} onChange={e => setSelectedDate(e.target.value)} />
          </div>
          <button className="reporte-action-btn" onClick={guardarReporte} disabled={totalTransacciones === 0}>
            <HiOutlineRefresh /> Generar Reporte
          </button>
        </div>
      </div>

      {totalTransacciones === 0 ? (
        <EmptyState icon="📊" message="No hay ventas en esta fecha" submessage="Selecciona otra fecha o espera a que se registren ventas" />
      ) : (
        <>
          <div className="reporte-cards">
            <div className="reporte-card">
              <div className="reporte-card-icon" style={{ background: 'rgba(255,107,157,0.15)' }}>
                <HiOutlineCurrencyDollar style={{ color: 'var(--accent)' }} />
              </div>
              <div className="reporte-card-info">
                <span className="reporte-card-label">Total Ventas</span>
                <span className="reporte-card-value">${totalVentas.toFixed(2)}</span>
              </div>
            </div>
            <div className="reporte-card">
              <div className="reporte-card-icon" style={{ background: 'rgba(46,204,113,0.15)' }}>
                <HiOutlineReceiptTax style={{ color: '#2ecc71' }} />
              </div>
              <div className="reporte-card-info">
                <span className="reporte-card-label">Transacciones</span>
                <span className="reporte-card-value">{totalTransacciones}</span>
              </div>
            </div>
            <div className="reporte-card">
              <div className="reporte-card-icon" style={{ background: 'rgba(52,152,219,0.15)' }}>
                <HiOutlineCash style={{ color: '#3498db' }} />
              </div>
              <div className="reporte-card-info">
                <span className="reporte-card-label">Efectivo</span>
                <span className="reporte-card-value">${totalEfectivo.toFixed(2)}</span>
              </div>
            </div>
            <div className="reporte-card">
              <div className="reporte-card-icon" style={{ background: 'rgba(155,89,182,0.15)' }}>
                <HiOutlineCreditCard style={{ color: '#9b59b6' }} />
              </div>
              <div className="reporte-card-info">
                <span className="reporte-card-label">Tarjeta</span>
                <span className="reporte-card-value">${totalTarjeta.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="reporte-table-wrapper">
            <h3>Movimientos del día</h3>
            <table className="reporte-table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Detalle</th>
                  <th>Monto</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {ventasDelDia.map((v, i) => (
                  <tr key={v.id_venta || i}>
                    <td>{v.fecha ? new Date(v.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td>{v.tipo === 'dulceria' ? 'Dulcería' : 'Boleto'}</td>
                    <td>{v.tipo === 'dulceria' ? `${v.items?.length || 0} producto(s)` : `${v.asientos?.length || 0} boleto(s)`}</td>
                    <td className="reporte-monto">${(v.total || 0).toFixed(2)}</td>
                    <td><span className={`reporte-metodo reporte-metodo-${v.metodo_pago?.toLowerCase() || 'efectivo'}`}>{v.metodo_pago || 'Efectivo'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportesGuardados.length > 0 && (
        <div className="reporte-table-wrapper">
          <h3>Reportes guardados</h3>
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ventas</th>
                <th>Transacciones</th>
                <th>Efectivo</th>
                <th>Tarjeta</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {reportesGuardados.map(r => (
                <tr key={r.id}>
                  <td>{r.fecha}</td>
                  <td>${(r.total || 0).toFixed(2)}</td>
                  <td>{r.transacciones ?? 0}</td>
                  <td>${(r.efectivo || 0).toFixed(2)}</td>
                  <td>${(r.tarjeta || 0).toFixed(2)}</td>
                  <td>
                    <button className="inv-action-btn inv-action-delete" onClick={() => setDeleteId(r.id)}>
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        message="¿Eliminar este reporte guardado?"
        onConfirm={eliminarReporte}
        onCancel={() => setDeleteId(null)}
        confirmText="Eliminar"
        danger
      />
    </div>
  );
}
