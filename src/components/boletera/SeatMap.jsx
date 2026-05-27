import { useMemo } from 'react';

export default function SeatMap({ selectedSeats, toggleSeat, occupiedSeats, sala, asientos = [] }) {
  const asientosPorFila = useMemo(() => {
    const map = {};
    asientos.forEach(a => {
      const key = a.fila;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return map;
  }, [asientos]);

  const filas = useMemo(() => Object.keys(asientosPorFila).sort(), [asientosPorFila]);

  if (asientos.length === 0) {
    return (
      <div className="seat-map-container">
        <p style={{ color: 'var(--text-muted)', padding: '40px' }}>No hay asientos configurados para esta sala</p>
      </div>
    );
  }

  return (
    <div className="seat-map-container">
      <div className="seat-screen">
        <span>Pantalla - {sala}</span>
        <div className="seat-screen-bar" />
      </div>

      <div className="seat-grid">
        {filas.map(fila => (
          <div key={fila} className="seat-row">
            <span className="seat-row-label">{fila}</span>
            <div className="seat-row-seats">
              {(asientosPorFila[fila] || []).map(a => {
                const seatId = `${a.fila}${a.numero}`;
                const isOcupado = occupiedSeats.has(seatId);
                const isSelected = selectedSeats.includes(seatId);
                const isSillaRuedas = a.tipo === 'silla_ruedas';

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
                    {isSillaRuedas ? '♿' : a.numero}
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