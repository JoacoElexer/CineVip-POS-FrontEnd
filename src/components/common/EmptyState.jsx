export default function EmptyState({ icon = '📭', message = 'No hay datos disponibles', submessage }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', color: 'var(--text-muted)'
    }}>
      <span style={{ fontSize: '48px', marginBottom: '16px' }} role="img" aria-label={message}>{icon}</span>
      <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: submessage ? '8px' : 0 }}>{message}</p>
      {submessage && <p style={{ fontSize: '13px' }}>{submessage}</p>}
    </div>
  );
}
