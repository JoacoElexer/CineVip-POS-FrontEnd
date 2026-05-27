import { useState, useMemo } from 'react';
import { useSalas, useFunciones, useAsientos } from '../hooks/useFunciones.js';
import { usePeliculas } from '../hooks/usePeliculas.js';
import { useVentas } from '../hooks/useVentas.js';
import { useBoletos } from '../hooks/useBoletos.js';
import SeatLegend from '../components/boletera/SeatLegend.jsx';
import SeatMap from '../components/boletera/SeatMap.jsx';
import CartPanel from '../components/boletera/CartPanel.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import '../styles/boletera.css';

export default function Boletera() {
  const { salas } = useSalas();
  const { peliculas } = usePeliculas();
  const { funciones } = useFunciones();
  const { asientos, fetchPorSala } = useAsientos();
  const { registrarVenta } = useVentas();
  const boleto = useBoletos();

  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const [selectedSala, setSelectedSala] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState('');
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saleDone, setSaleDone] = useState(false);

  const funcionesFiltradas = useMemo(() => {
    let filtradas = funciones;
    if (selectedPelicula) filtradas = filtradas.filter(f => f.pelicula_id === selectedPelicula.id);
    if (selectedSala) filtradas = filtradas.filter(f => f.id_sala === selectedSala.id_sala);
    if (selectedFecha) filtradas = filtradas.filter(f => f.horario && f.horario.startsWith(selectedFecha));
    return filtradas;
  }, [funciones, selectedPelicula, selectedSala, selectedFecha]);

  const handleSelectFuncion = async (funcion) => {
    setSelectedFuncion(funcion);
    const pelicula = peliculas.find(p => p.id === funcion.pelicula_id);
    const sala = salas.find(s => s.id_sala === funcion.id_sala);
    const asientosSala = await fetchPorSala(funcion.id_sala);
    const ocupados = asientosSala.filter(a => a.ocupado).map(a => `${a.fila}${a.numero}`);
    boleto.seleccionarFuncion(funcion, pelicula, sala, ocupados);
  };

  const handleBuyTickets = () => {
    setShowConfirm(true);
  };

  const confirmBuy = () => {
    registrarVenta({
      tipo: 'boleto',
      id_funcion: selectedFuncion?.id_funcion,
      asientos: boleto.selectedSeats,
      total: boleto.total,
      pelicula: selectedPelicula?.nombre
    });
    boleto.clearSeats();
    setShowConfirm(false);
    setSaleDone(true);
    setTimeout(() => setSaleDone(false), 3000);
  };

  const asientosSalaActual = useMemo(() => {
    if (!selectedFuncion) return [];
    const real = asientos.filter(a => a.id_sala === selectedFuncion.id_sala);
    if (real.length > 0) return real;
    const sala = selectedSala || salas.find(s => s.id_sala === selectedFuncion.id_sala);
    if (!sala?.capacidad) return [];
    const virtual = [];
    const cols = Math.min(10, Math.max(5, Math.ceil(Math.sqrt(sala.capacidad))));
    const rows = Math.ceil(sala.capacidad / cols);
    for (let r = 0; r < rows; r++) {
      const fila = String.fromCharCode(65 + r);
      const asientosEnFila = Math.min(cols, sala.capacidad - r * cols);
      for (let c = 0; c < asientosEnFila; c++) {
        virtual.push({ fila, numero: c + 1 });
      }
    }
    return virtual;
  }, [asientos, selectedFuncion, selectedSala, salas]);

  return (
    <div className="boletera">
      {saleDone && (
        <div className="sale-toast" style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', background: '#2ecc71', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, zIndex: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          ✅ Boletos comprados exitosamente
        </div>
      )}

      <div className="boletera-main">
        <div className="boletera-selectors">
          <div className="selector-group">
            <label>Película</label>
            <select value={selectedPelicula?.id || ''} onChange={e => {
              const pel = peliculas.find(p => p.id === e.target.value);
              setSelectedPelicula(pel || null);
              setSelectedFuncion(null);
              boleto.clearSeats();
            }}>
              <option value="">Seleccionar película</option>
              {peliculas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>Sala</label>
            <select value={selectedSala?.id_sala || ''} onChange={e => {
              const s = salas.find(sl => sl.id_sala === Number(e.target.value));
              setSelectedSala(s || null);
              setSelectedFuncion(null);
              boleto.clearSeats();
            }}>
              <option value="">Seleccionar sala</option>
              {salas.map(s => (
                <option key={s.id_sala} value={s.id_sala}>Sala {s.id_sala} - {s.nombre}</option>
              ))}
            </select>
          </div>

          <div className="selector-group">
            <label>Fecha</label>
            <input type="date" value={selectedFecha} onChange={e => {
              setSelectedFecha(e.target.value);
              setSelectedFuncion(null);
              boleto.clearSeats();
            }} />
          </div>

          <div className="selector-group">
            <label>Función</label>
            <select value={selectedFuncion?.id_funcion || ''} onChange={e => {
              const f = funcionesFiltradas.find(fn => fn.id_funcion === Number(e.target.value));
              if (f) handleSelectFuncion(f);
            }}>
              <option value="">Seleccionar función</option>
              {funcionesFiltradas.map(f => (
                <option key={f.id_funcion} value={f.id_funcion}>
                  {peliculas.find(p => p.id === f.pelicula_id)?.nombre || 'N/A'} - {f.horario ? new Date(f.horario).toLocaleString('es-MX') : 'N/A'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedFuncion && selectedPelicula ? (
          <>
            <SeatLegend />
            <SeatMap
              selectedSeats={boleto.selectedSeats}
              toggleSeat={boleto.toggleSeat}
              occupiedSeats={new Set(boleto.asientosOcupados)}
              asientos={asientosSalaActual}
              sala={selectedSala?.nombre || `Sala ${selectedFuncion.id_sala}`}
            />
          </>
        ) : (
          <EmptyState icon="🎬" message="Selecciona una película y función" submessage="Usa los filtros de arriba para encontrar funciones disponibles" />
        )}
      </div>

      <CartPanel
        pelicula={selectedPelicula}
        sala={selectedSala}
        funcion={selectedFuncion}
        selectedSeats={boleto.selectedSeats}
        total={boleto.total}
        onBuy={handleBuyTickets}
      />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Compra" width="400px">
        <div style={{ padding: '8px 0' }}>
          <p style={{ marginBottom: '12px', color: 'var(--text-dark)' }}>
            <strong>{selectedPelicula?.nombre}</strong><br />
            Sala: {selectedSala?.nombre} | {selectedFuncion?.horario ? new Date(selectedFuncion.horario).toLocaleString('es-MX') : ''}
          </p>
          <p style={{ marginBottom: '16px', color: 'var(--text-dark)' }}>
            Asientos: {boleto.selectedSeats.join(', ')}<br />
            Total: <strong>${boleto.total.toFixed(2)}</strong>
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="summary-btn summary-btn-secondary" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button className="summary-btn summary-btn-primary" onClick={confirmBuy}>Confirmar Compra</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
