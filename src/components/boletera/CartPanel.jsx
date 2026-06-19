import { HiOutlineX } from 'react-icons/hi';
import EmptyState from '../common/EmptyState.jsx';

export default function CartPanel({ pelicula, sala, funcion, selectedSeats, total, onBuy, onRemoveSeat }) {
  if (!pelicula || !funcion) {
    return (
      <aside className="cart-panel">
        <h2 className="cart-panel-title">Tu carrito</h2>
        <EmptyState icon="🎫" message="Selecciona una función" submessage="Elige película, sala, fecha y función para continuar" />
      </aside>
    );
  }

  return (
    <aside className="cart-panel">
      <h2 className="cart-panel-title">Tu carrito</h2>

      <div className="cart-movie-info">
        <div className="cart-movie-img" role="img" aria-label={pelicula.nombre || 'Película'} style={{ background: 'linear-gradient(135deg, var(--accent), #9b59b6)' }}>
          {pelicula.emoji || '🎬'}
        </div>
        <div className="cart-movie-details">
          <h3 className="cart-movie-name">{pelicula.nombre}</h3>
          <div className="cart-movie-meta">
            <span className="cart-badge">{pelicula.clasificacion || 'N/A'}</span>
            <span>{pelicula.duracion || ''}</span>
          </div>
        </div>
      </div>

      <div className="cart-session-info">
        <div className="cart-session-row">
          <span>Sala:</span>
          <strong>{sala?.nombre || `Sala ${funcion.id_sala}`}</strong>
        </div>
        <div className="cart-session-row">
          <span>Horario:</span>
          <strong>{funcion.horarioDisplay || 'N/A'}</strong>
        </div>
      </div>

      <div className="cart-seats-section">
        <h4>Asientos seleccionados</h4>
        {selectedSeats.length === 0 ? (
          <p className="cart-seats-empty">No hay asientos seleccionados</p>
        ) : (
          <>
            <div className="cart-seats-list">
              {selectedSeats.map(seat => (
                <span key={seat} className="cart-seat-tag" onClick={() => onRemoveSeat?.(seat, false)} style={{ cursor: 'pointer' }}>
                  {seat} <HiOutlineX aria-hidden="true" />
                </span>
              ))}
            </div>
            <div className="cart-total-section">
              <div className="cart-total-row">
                <span>Boletos ({selectedSeats.length})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="cart-grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        className="cart-checkout-btn"
        data-testid="btn-comprar"
        disabled={selectedSeats.length === 0}
        onClick={onBuy}
      >
        Comprar boletos
      </button>
    </aside>
  );
}
