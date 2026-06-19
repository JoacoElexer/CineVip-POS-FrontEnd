export default function SeatLegend() {
  const items = [
    { color: 'var(--accent)', label: 'Seleccionado' },
    { color: '#2ecc71', label: 'Disponible' },
    { color: '#666', label: 'Ocupado' },
    { color: '#3498db', label: 'Silla de ruedas' },
  ];

  return (
    <div className="seat-legend">
      {items.map(item => (
        <div key={item.label} className="seat-legend-item">
          <span className="seat-legend-dot" style={{ background: item.color }} aria-hidden="true" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
