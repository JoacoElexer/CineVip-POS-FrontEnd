export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel, confirmText = 'Aceptar', cancelText = 'Cancelar', danger = false }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal-container" style={{ maxWidth: '400px' }}>
        <div className="modal-body" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '24px', lineHeight: 1.5 }}>{message}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              className="summary-btn summary-btn-secondary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button
              className="summary-btn summary-btn-primary"
              style={danger ? { background: '#e74c3c' } : {}}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
