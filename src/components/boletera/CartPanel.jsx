import { HiOutlineX } from 'react-icons/hi';

export default function CartPanel({ movieInfo, selectedSeats, total }) {
  return (
    <aside className="cart-panel">
      <h2 className="cart-panel-title">Tu carrito</h2>

      <div className="cart-movie-info">
        <div className="cart-movie-img">{movieInfo.imagen}</div>
        <div className="cart-movie-details">
          <h3 className="cart-movie-name">{movieInfo.nombre}</h3>
          <div className="cart-movie-meta">
            <span className="cart-badge">{movieInfo.clasificacion}</span>
            <span>{movieInfo.duracion}</span>
          </div>
        </div>
      </div>

      <div className="cart-session-info">
        <div className="cart-session-row">
          <span>Cine:</span>
          <strong>{movieInfo.cine}</strong>
        </div>
        <div className="cart-session-row">
          <span>Fecha:</span>
          <strong>{movieInfo.fecha}</strong>
        </div>
        <div className="cart-session-row">
          <span>Hora:</span>
          <strong>{movieInfo.hora}</strong>
        </div>
        <div className="cart-session-row">
          <span>Sala:</span>
          <strong>{movieInfo.sala}</strong>
        </div>
      </div>

      <div className="cart-seats-section">
        <h4>Asientos seleccionados</h4>
        {selectedSeats.length === 0 ? (
          <p className="cart-seats-empty">No hay asientos seleccionados</p>
        ) : (
          <div className="cart-seats-list">
            {selectedSeats.map(seat => (
              <span key={seat} className="cart-seat-tag">
                {seat} <HiOutlineX />
              </span>
            ))}
          </div>
        )}
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

      <button
        className="cart-checkout-btn"
        disabled={selectedSeats.length === 0}
      >
        Continuar
      </button>
    </aside>
  );
}
