export default function LoadingState({ message = 'Cargando...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)'
    }}>
      <div className="spinner" />
      <p style={{ fontSize: '14px', marginTop: '16px' }}>{message}</p>
    </div>
  );
}
