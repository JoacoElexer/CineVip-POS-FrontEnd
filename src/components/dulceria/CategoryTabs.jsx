export default function CategoryTabs({ categorias, activeCategoria, onSelect }) {
  return (
    <div className="category-tabs">
      {categorias.map(cat => (
        <button
          key={cat.id_categoria}
          className={`category-tab ${activeCategoria === cat.id_categoria ? 'active' : ''}`}
          onClick={() => onSelect(cat.id_categoria)}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
