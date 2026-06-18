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
import logService from '../utils/logService.js';
import { extractOccupiedSeatIds } from '../utils/seatUtils.js';
import { getTodayDate } from '../utils/dateUtils.js';
import '../styles/boletera.css';

export default function Boletera() {
  const { salas } = useSalas();
  const { peliculas } = usePeliculas();
  const { funciones } = useFunciones();
  const { asientos, fetchPorSala } = useAsientos();
  const { registrarVenta } = useVentas();
  const boleto = useBoletos();

  const [selectedFecha, setSelectedFecha] = useState(getTodayDate);
  const [selectedFuncion, setSelectedFuncion] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saleDone, setSaleDone] = useState(false);

  const hoy = getTodayDate();

  const funcionesDelDia = useMemo(() => {
    if (!selectedFecha) return [];
    const filtradas = funciones.filter(f => f.horario && f.horario.startsWith(selectedFecha));
    const mapa = {};
    for (const f of filtradas) {
      const pid = f.pelicula_id;
      if (!mapa[pid]) mapa[pid] = [];
      mapa[pid].push(f);
    }
    const salida = [];
    for (const pid in mapa) {
      const peli = peliculas.find(p => p.id === pid);
      if (peli) {
        mapa[pid].sort((a, b) => (a.horarioDisplay || '').localeCompare(b.horarioDisplay || ''));
        salida.push({ pelicula: peli, funciones: mapa[pid] });
      }
    }
    salida.sort((a, b) => a.pelicula.nombre.localeCompare(b.pelicula.nombre));
    return salida;
  }, [funciones, selectedFecha, peliculas]);

  const handleSelectFuncion = async (funcion) => {
    setSelectedFuncion(funcion);
    const pelicula = peliculas.find(p => p.id === funcion.pelicula_id);
    const sala = salas.find(s => s.id_sala === funcion.id_sala);
    const asientosSala = await fetchPorSala(funcion.id_sala);
    const ocupados = extractOccupiedSeatIds(asientosSala);
    boleto.seleccionarFuncion(funcion, pelicula, sala, ocupados);
  };

  const handleBuyTickets = () => {
    setShowConfirm(true);
  };

  const confirmBuy = async () => {
    const res = await registrarVenta({
      tipo: 'boleto',
      id_funcion: selectedFuncion?.id_funcion,
      asientos: boleto.selectedSeats,
      total: boleto.total,
      pelicula: selectedPelicula?.nombre,
    });
    if (res) {
      const nuevosAsientos = await fetchPorSala(selectedFuncion.id_sala);
      const nuevosOcupados = extractOccupiedSeatIds(nuevosAsientos);
      boleto.setAsientosOcupados(nuevosOcupados);
      logService.info('Boletera', 'compra_exitosa', {
        asientos: boleto.selectedSeats,
        total: boleto.total,
        id_funcion: selectedFuncion?.id_funcion,
        pelicula: selectedPelicula?.nombre,
      });
    }
    boleto.clearSeats();
    setShowConfirm(false);
    setSaleDone(true);
    setTimeout(() => setSaleDone(false), 3000);
  };

  const selectedPelicula = selectedFuncion
    ? peliculas.find(p => p.id === selectedFuncion.pelicula_id)
    : null;
  const selectedSala = selectedFuncion
    ? salas.find(s => s.id_sala === selectedFuncion.id_sala)
    : null;

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
        virtual.push({ fila, numero: c + 1, ...(r === 0 && c < 2 ? { tipo: 'silla_ruedas' } : {}) });
      }
    }
    return virtual;
  }, [asientos, selectedFuncion, selectedSala, salas]);

  return (
    <div className="boletera">
      {saleDone && (
        <div className="sale-toast">
          ✅ Boletos comprados exitosamente
        </div>
      )}

      <div className="boletera-main">
        <div className="boletera-date-bar">
          <label className="boletera-date-label">Fecha</label>
          <input
            type="date"
            className="boletera-date-input"
            value={selectedFecha}
            min={hoy}
            onChange={e => {
              setSelectedFecha(e.target.value);
              setSelectedFuncion(null);
              boleto.clearSeats();
            }}
          />
        </div>

        {funcionesDelDia.length > 0 ? (
          <div className="movie-cards">
            {funcionesDelDia.map(({ pelicula, funciones: fns }) => (
              <div key={pelicula.id} className="movie-card">
                <div className="movie-card-avatar">
                  {pelicula.emoji || '🎬'}
                </div>
                <div className="movie-card-info">
                  <h3 className="movie-card-title">{pelicula.nombre}</h3>
                  <span className="movie-card-genre">{pelicula.genero || ''}</span>
                </div>
                <div className="movie-card-times">
                  {fns.map(f => (
                    <button
                      key={f.id_funcion}
                      className={`movie-time-btn ${selectedFuncion?.id_funcion === f.id_funcion ? 'movie-time-btn-active' : ''}`}
                      onClick={() => handleSelectFuncion(f)}
                    >
                      <span className="movie-time-hora">{f.horarioDisplay}</span>
                      <span className="movie-time-precio">${f.precio.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="🎬" message="No hay funciones para esta fecha" submessage="Selecciona otra fecha" />
        )}

        {selectedFuncion && selectedPelicula && (
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
        )}
      </div>

      <CartPanel
        pelicula={selectedPelicula}
        sala={selectedSala}
        funcion={selectedFuncion}
        selectedSeats={boleto.selectedSeats}
        total={boleto.total}
        onBuy={handleBuyTickets}
        onRemoveSeat={boleto.toggleSeat}
      />

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Compra" width="400px">
        <div style={{ padding: '8px 0' }}>
          <p style={{ marginBottom: '12px', color: 'var(--text-dark)' }}>
            <strong>{selectedPelicula?.nombre}</strong><br />
            Sala: {selectedSala?.nombre} | {selectedFuncion?.horarioDisplay || ''}
          </p>
          <p style={{ marginBottom: '16px', color: 'var(--text-dark)' }}>
            Asientos: {boleto.selectedSeats.join(', ')}<br />
            Total: <strong>${(boleto.total || 0).toFixed(2)}</strong>
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
