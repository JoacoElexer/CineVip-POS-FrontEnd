import { getPasswords } from './passwordsStorage.js';

export function downloadPasswords() {
  const list = getPasswords();
  if (list.length === 0) return;

  const lines = [
    '=== CineVIP POS - Credenciales de Usuarios ===',
    `Generado: ${new Date().toLocaleString('es-MX')}`,
    '',
  ];

  for (const entry of list) {
    lines.push('----------------------------------------');
    lines.push(`Usuario:     ${entry.usuario}`);
    lines.push(`Contraseña:  ${entry.password}`);
    lines.push(`Nombre:      ${entry.nombre}`);
    lines.push(`Rol:         ${entry.rol}`);
    lines.push(`Creado:      ${new Date(entry.creado_en).toLocaleString('es-MX')}`);
  }

  lines.push('----------------------------------------');
  lines.push('');
  lines.push(`Total de usuarios: ${list.length}`);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'passwords.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
