import { useMemo } from 'react';
import SeatLegend from '../components/boletera/SeatLegend.jsx';
import SeatMap from '../components/boletera/SeatMap.jsx';
import CartPanel from '../components/boletera/CartPanel.jsx';
import { useBoletos } from '../hooks/useBoletos.js';
import { generarAsientosOcupados } from '../data/funciones.js';
import '../styles/boletera.css';

export default function Boletera() {
  const { selectedSeats, toggleSeat, total, movieInfo } = useBoletos();

  const occupiedSeats = useMemo(() => generarAsientosOcupados(), []);

  return (
    <div className="boletera">
      <div className="boletera-main">
        <SeatLegend />
        <SeatMap
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
          occupiedSeats={occupiedSeats}
          sala={movieInfo.sala}
        />
      </div>
      <CartPanel
        movieInfo={movieInfo}
        selectedSeats={selectedSeats}
        total={total}
      />
    </div>
  );
}
