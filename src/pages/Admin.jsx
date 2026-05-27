import { useState } from 'react';
import { useSalas, useAsientos } from '../hooks/useFunciones.js';
import { useMetodosPago, usePromociones } from '../hooks/useConfiguracion.js';
import { usePeliculas } from '../hooks/usePeliculas.js';
import { useUsuarios } from '../hooks/useUsuarios.js';
import Modal from '../components/common/Modal.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import '../styles/admin.css';

const TABS = [
  { id: 'salas', label: 'Salas' },
  { id: 'asientos', label: 'Asientos' },
  { id: 'peliculas', label: 'Películas' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'pagos', label: 'Métodos de Pago' },
  { id: 'promos', label: 'Promociones' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('salas');

  return (
    <div className="admin">
      <div className="admin-header">
        <h2>Administración</h2>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`admin-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'salas' && <SalasPanel />}
        {activeTab === 'asientos' && <AsientosPanel />}
        {activeTab === 'peliculas' && <PeliculasPanel />}
        {activeTab === 'usuarios' && <UsuariosPanel />}
        {activeTab === 'pagos' && <MetodosPagoPanel />}
        {activeTab === 'promos' && <PromocionesPanel />}
      </div>
    </div>
  );
}

function SalasPanel() {
  const { salas, agregar, actualizar, eliminar } = useSalas();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ nombre: '', capacidad: '' });

  const openCreate = () => { setEditing(null); setForm({ nombre: '', capacidad: '' }); setShow(true); };
  const openEdit = (s) => { setEditing(s); setForm({ nombre: s.nombre || '', capacidad: s.capacidad || '' }); setShow(true); };

  const handleSave = () => {
    if (!form.nombre || !form.capacidad) return;
    const data = { nombre: form.nombre, capacidad: Number(form.capacidad) };
    if (editing) actualizar(editing.id_sala, data);
    else agregar(data);
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Salas" count={salas.length} onCreate={openCreate} />
      {salas.length === 0 ? <p className="admin-empty">No hay salas registradas</p> : (
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Capacidad</th><th>Acciones</th></tr></thead>
          <tbody>
            {salas.map(s => (
              <tr key={s.id_sala}>
                <td className="admin-cell-name">{s.nombre}</td>
                <td>{s.capacidad} asientos</td>
                <td className="admin-actions">
                  <button onClick={() => openEdit(s)}><HiOutlinePencil /></button>
                  <button className="admin-delete" onClick={() => setDeleteId(s.id_sala)}><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title={editing ? 'Editar Sala' : 'Nueva Sala'}>
        <div className="admin-form">
          <div className="admin-form-group">
            <label>Nombre de la sala</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Sala 1" />
          </div>
          <div className="admin-form-group">
            <label>Capacidad</label>
            <input type="number" min="1" value={form.capacidad} onChange={e => setForm({ ...form, capacidad: e.target.value })} placeholder="Ej: 100" />
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} message="¿Eliminar esta sala?" onConfirm={() => { eliminar(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} confirmText="Eliminar" danger />
    </>
  );
}

function AsientosPanel() {
  const { salas } = useSalas();
  const { asientos, agregarLote, eliminarPorSala } = useAsientos();
  const [salaFilter, setSalaFilter] = useState('');
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ fila: 'A', numero_inicio: 1, cantidad: 10 });

  const filtered = salaFilter ? asientos.filter(a => a.id_sala === Number(salaFilter)) : asientos;

  const handleGenerate = () => {
    if (!salaFilter) return;
    const nuevos = [];
    for (let i = 0; i < Number(form.cantidad); i++) {
      nuevos.push({ id_sala: Number(salaFilter), fila: form.fila.toUpperCase(), numero: Number(form.numero_inicio) + i });
    }
    agregarLote(nuevos);
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Asientos" count={filtered.length} onCreate={() => setShow(true)} />
      <div className="admin-filter-bar">
        <select value={salaFilter} onChange={e => setSalaFilter(e.target.value)}>
          <option value="">Todas las salas</option>
          {salas.map(s => <option key={s.id_sala} value={s.id_sala}>{s.nombre}</option>)}
        </select>
        {salaFilter && (
          <button className="admin-delete-btn" onClick={() => eliminarPorSala(Number(salaFilter))}>Limpiar asientos</button>
        )}
      </div>

      {filtered.length === 0 ? <p className="admin-empty">No hay asientos para esta sala</p> : (
        <table className="admin-table">
          <thead><tr><th>Sala</th><th>Fila</th><th>Número</th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id_asiento}>
                <td>{salas.find(s => s.id_sala === a.id_sala)?.nombre || 'N/A'}</td>
                <td>{a.fila}</td>
                <td>{a.numero}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title="Generar Asientos">
        <div className="admin-form">
          <div className="admin-form-group">
            <label>Sala</label>
            <select value={salaFilter} onChange={e => setSalaFilter(e.target.value)}>
              <option value="">Seleccionar sala</option>
              {salas.map(s => <option key={s.id_sala} value={s.id_sala}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Fila</label>
              <input type="text" maxLength="1" value={form.fila} onChange={e => setForm({ ...form, fila: e.target.value })} placeholder="A" />
            </div>
            <div className="admin-form-group">
              <label>Número inicial</label>
              <input type="number" min="1" value={form.numero_inicio} onChange={e => setForm({ ...form, numero_inicio: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label>Cantidad</label>
              <input type="number" min="1" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: e.target.value })} />
            </div>
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleGenerate}>Generar</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function MetodosPagoPanel() {
  const { metodos, agregar, actualizar, eliminar } = useMetodosPago();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ tipo: '' });

  const openCreate = () => { setEditing(null); setForm({ tipo: '' }); setShow(true); };
  const openEdit = (m) => { setEditing(m); setForm({ tipo: m.tipo || '' }); setShow(true); };

  const handleSave = () => {
    if (!form.tipo) return;
    if (editing) actualizar(editing.id_pago, { tipo: form.tipo });
    else agregar({ tipo: form.tipo });
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Métodos de Pago" count={metodos.length} onCreate={openCreate} />
      {metodos.length === 0 ? <p className="admin-empty">No hay métodos de pago registrados</p> : (
        <table className="admin-table">
          <thead><tr><th>Método</th><th>Acciones</th></tr></thead>
          <tbody>
            {metodos.map(m => (
              <tr key={m.id_pago}>
                <td className="admin-cell-name">{m.tipo}</td>
                <td className="admin-actions">
                  <button onClick={() => openEdit(m)}><HiOutlinePencil /></button>
                  <button className="admin-delete" onClick={() => setDeleteId(m.id_pago)}><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title={editing ? 'Editar Método' : 'Nuevo Método de Pago'}>
        <div className="admin-form">
          <div className="admin-form-group">
            <label>Tipo</label>
            <input type="text" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} placeholder="Ej: Efectivo" />
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} message="¿Eliminar este método de pago?" onConfirm={() => { eliminar(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} confirmText="Eliminar" danger />
    </>
  );
}

function PromocionesPanel() {
  const { promociones, agregar, actualizar, eliminar } = usePromociones();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ nombre: '', precio_combo: '', activo: true });

  const openCreate = () => { setEditing(null); setForm({ nombre: '', precio_combo: '', activo: true }); setShow(true); };
  const openEdit = (p) => { setEditing(p); setForm({ nombre: p.nombre || '', precio_combo: p.precio_combo || '', activo: p.activo !== false }); setShow(true); };

  const handleSave = () => {
    if (!form.nombre || !form.precio_combo) return;
    const data = { nombre: form.nombre, precio_combo: Number(form.precio_combo), activo: form.activo };
    if (editing) actualizar(editing.id_promo, data);
    else agregar(data);
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Promociones" count={promociones.length} onCreate={openCreate} />
      {promociones.length === 0 ? <p className="admin-empty">No hay promociones registradas</p> : (
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Precio Combo</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {promociones.map(p => (
              <tr key={p.id_promo}>
                <td className="admin-cell-name">{p.nombre}</td>
                <td><span className="admin-descuento">${(p.precio_combo || 0).toFixed(2)}</span></td>
                <td><span className={`admin-descuento ${p.activo === false ? 'admin-inactivo' : ''}`}>{p.activo !== false ? 'Activa' : 'Inactiva'}</span></td>
                <td className="admin-actions">
                  <button onClick={() => openEdit(p)}><HiOutlinePencil /></button>
                  <button className="admin-delete" onClick={() => setDeleteId(p.id_promo)}><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title={editing ? 'Editar Promoción' : 'Nueva Promoción'}>
        <div className="admin-form">
          <div className="admin-form-group">
            <label>Nombre</label>
            <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Combo Familiar" />
          </div>
          <div className="admin-form-group">
            <label>Precio Combo ($)</label>
            <input type="number" step="0.01" min="0" value={form.precio_combo} onChange={e => setForm({ ...form, precio_combo: e.target.value })} placeholder="Ej: 9.99" />
          </div>
          <div className="admin-form-group">
            <label style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} />
              Promoción activa
            </label>
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} message="¿Eliminar esta promoción?" onConfirm={() => { eliminar(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} confirmText="Eliminar" danger />
    </>
  );
}

function PeliculasPanel() {
  const { peliculas, agregar, actualizar, eliminar } = usePeliculas();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    nombre: '', genero: '', duracion: '', clasificacion: '',
    idioma: 'Español', formato: '2D', anio: '', director: '',
    emoji: '🎬', activa: true,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', genero: '', duracion: '', clasificacion: '', idioma: 'Español', formato: '2D', anio: '', director: '', emoji: '🎬', activa: true });
    setShow(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      nombre: p.nombre || '', genero: p.genero || '', duracion: p.duracion || '',
      clasificacion: p.clasificacion || '', idioma: p.idioma || 'Español',
      formato: p.formato || '2D', anio: p.anio || '', director: p.director || '',
      emoji: p.emoji || '🎬', activa: p.activa !== false,
    });
    setShow(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.duracion) return;
    const data = { ...form, anio: form.anio ? Number(form.anio) : null };
    if (editing) actualizar(editing.id, data);
    else agregar(data);
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Películas" count={peliculas.length} onCreate={openCreate} />
      {peliculas.length === 0 ? <p className="admin-empty">No hay películas registradas</p> : (
        <table className="admin-table">
          <thead><tr><th>Película</th><th>Género</th><th>Duración</th><th>Clasificación</th><th>Formato</th><th>Acciones</th></tr></thead>
          <tbody>
            {peliculas.map(p => (
              <tr key={p.id}>
                <td className="admin-cell-name">
                  <span style={{ marginRight: '6px' }}>{p.emoji || '🎬'}</span>
                  {p.nombre}
                </td>
                <td>{p.genero || '—'}</td>
                <td>{p.duracion}</td>
                <td>{p.clasificacion || '—'}</td>
                <td>{p.formato || '2D'}</td>
                <td className="admin-actions">
                  <button onClick={() => openEdit(p)}><HiOutlinePencil /></button>
                  <button className="admin-delete" onClick={() => setDeleteId(p.id)}><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title={editing ? 'Editar Película' : 'Nueva Película'}>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 2 }}>
              <label>Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Título" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Emoji</label>
              <input type="text" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} maxLength="5" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Género</label>
              <select value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })}>
                <option value="">Seleccionar</option>
                <option value="Acción">Acción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Terror">Terror</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Animación">Animación</option>
                <option value="Aventura">Aventura</option>
                <option value="Suspenso">Suspenso</option>
                <option value="Romance">Romance</option>
                <option value="Documental">Documental</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Duración</label>
              <input type="text" value={form.duracion} onChange={e => setForm({ ...form, duracion: e.target.value })} placeholder="Ej: 2h 15m" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Clasificación</label>
              <select value={form.clasificacion} onChange={e => setForm({ ...form, clasificacion: e.target.value })}>
                <option value="">Seleccionar</option>
                <option value="A">A (Todo público)</option>
                <option value="AA">AA (Niños)</option>
                <option value="B">B (12+)</option>
                <option value="B15">B15 (15+)</option>
                <option value="C">C (18+)</option>
                <option value="D">D (18+ con contenido)</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Formato</label>
              <select value={form.formato} onChange={e => setForm({ ...form, formato: e.target.value })}>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Idioma</label>
              <select value={form.idioma} onChange={e => setForm({ ...form, idioma: e.target.value })}>
                <option value="Español">Español</option>
                <option value="Inglés">Inglés</option>
                <option value="Subtitulada">Subtitulada</option>
              </select>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Año</label>
              <input type="number" min="1900" max="2099" value={form.anio} onChange={e => setForm({ ...form, anio: e.target.value })} placeholder="2025" />
            </div>
            <div className="admin-form-group">
              <label>Director</label>
              <input type="text" value={form.director} onChange={e => setForm({ ...form, director: e.target.value })} placeholder="Director" />
            </div>
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} message="¿Eliminar esta película?" onConfirm={() => { eliminar(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} confirmText="Eliminar" danger />
    </>
  );
}

function UsuariosPanel() {
  const { usuarios, agregar, actualizar, eliminar } = useUsuarios();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'Operador', telefono: '', activo: true });

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', email: '', rol: 'Operador', telefono: '', activo: true });
    setShow(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      nombre: u.nombre || '', email: u.email || '', rol: u.rol || 'Operador',
      telefono: u.telefono || '', activo: u.activo !== false,
    });
    setShow(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.email) return;
    if (editing) actualizar(editing.id_usuario, form);
    else agregar(form);
    setShow(false);
  };

  return (
    <>
      <PanelHeader label="Usuarios" count={usuarios.length} onCreate={openCreate} />
      {usuarios.length === 0 ? <p className="admin-empty">No hay usuarios registrados</p> : (
        <table className="admin-table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Teléfono</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id_usuario}>
                <td className="admin-cell-name">{u.nombre}</td>
                <td>{u.email}</td>
                <td><span className="admin-descuento">{u.rol}</span></td>
                <td>{u.telefono || '—'}</td>
                <td><span className={`admin-descuento ${u.activo === false ? 'admin-inactivo' : ''}`}>{u.activo !== false ? 'Activo' : 'Inactivo'}</span></td>
                <td className="admin-actions">
                  <button onClick={() => openEdit(u)}><HiOutlinePencil /></button>
                  <button className="admin-delete" onClick={() => setDeleteId(u.id_usuario)}><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={show} onClose={() => setShow(false)} title={editing ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 2 }}>
              <label>Nombre</label>
              <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Operador">Operador</option>
                <option value="Cajero">Cajero</option>
              </select>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group" style={{ flex: 2 }}>
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="correo@cinevip.com" />
            </div>
            <div className="admin-form-group" style={{ flex: 1 }}>
              <label>Teléfono</label>
              <input type="text" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="555-1234" />
            </div>
          </div>
          <div className="admin-form-group">
            <label style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', textTransform: 'none' }}>
              <input type="checkbox" checked={form.activo} onChange={e => setForm({ ...form, activo: e.target.checked })} />
              Usuario activo
            </label>
          </div>
          <div className="admin-form-footer">
            <button className="summary-btn summary-btn-secondary" onClick={() => setShow(false)}>Cancelar</button>
            <button className="admin-submit" onClick={handleSave}>{editing ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} message="¿Eliminar este usuario?" onConfirm={() => { eliminar(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} confirmText="Eliminar" danger />
    </>
  );
}

function PanelHeader({ label, count, onCreate }) {
  return (
    <div className="admin-panel-header">
      <span className="admin-panel-count">{count} registro(s)</span>
      <button className="inv-add-btn" onClick={onCreate}><HiOutlinePlus /> Agregar {label}</button>
    </div>
  );
}
