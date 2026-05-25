export default function CategoryTabs({ categorias, activeCategoria, onSelect }) {
  return (
    <div className="category-tabs">
      {categorias.map(cat => (
        <button
          key={cat.id}
          className={`category-tab ${activeCategoria === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}
