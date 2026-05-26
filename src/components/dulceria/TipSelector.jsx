import { useState } from 'react';

const OPCIONES = [0, 5, 10, 15];

export default function TipSelector({ propinaPorcentaje, setPropinaPorcentaje }) {
  const [isCustom, setIsCustom] = useState(false);

  const handleSelect = (valor) => {
    if (valor === -1) {
      setIsCustom(true);
      setPropinaPorcentaje(0);
    } else {
      setIsCustom(false);
      setPropinaPorcentaje(valor);
    }
  };

  return (
    <div className="tip-selector">
      <label className="tip-label">Propina</label>
      <div className="tip-options">
        {OPCIONES.map(op => (
          <button
            key={op}
            className={`tip-option ${!isCustom && propinaPorcentaje === op ? 'active' : ''}`}
            onClick={() => handleSelect(op)}
          >
            {op}%
          </button>
        ))}
        <button
          className={`tip-option ${isCustom ? 'active' : ''}`}
          onClick={() => handleSelect(-1)}
        >
          Custom
        </button>
      </div>
      {isCustom && (
        <input
          type="number"
          className="tip-input"
          placeholder="0"
          min="0"
          max="100"
          value={propinaPorcentaje}
          onChange={e => setPropinaPorcentaje(Number(e.target.value))}
        />
      )}
    </div>
  );
}
