import { filas, asientosPorFila, asientosSillaRuedas } from '../../data/funciones.js';

export default function SeatMap({ selectedSeats, toggleSeat, occupiedSeats, sala }) {
  return (
    <div className="seat-map-container">
      <div className="seat-screen">
        <span>Pantalla Sala {sala}</span>
        <div className="seat-screen-bar" />
      </div>

      <div className="seat-grid">
        {filas.map(fila => (
          <div key={fila} className="seat-row">
            <span className="seat-row-label">{fila}</span>
            <div className="seat-row-seats">
              {Array.from({ length: asientosPorFila }, (_, i) => {
                const num = i + 1;
                const seatId = `${fila}${num}`;
                const isOcupado = occupiedSeats.has(seatId);
                const isSillaRuedas = asientosSillaRuedas.has(seatId);
                const isSelected = selectedSeats.includes(seatId);

                let clase = 'seat';
                if (isOcupado) clase += ' seat-occupied';
                else if (isSelected) clase += ' seat-selected';
                else if (isSillaRuedas) clase += ' seat-wheelchair';
                else clase += ' seat-available';

                return (
                  <button
                    key={seatId}
                    className={clase}
                    onClick={() => toggleSeat(seatId, isOcupado)}
                    disabled={isOcupado}
                    title={`${seatId}${isSillaRuedas ? ' (Silla de ruedas)' : ''}`}
                  >
                    {isSillaRuedas ? '♿' : num}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
