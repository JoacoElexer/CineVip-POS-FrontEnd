export function formatHorarioDisplay(hora, horario) {
  if (hora) return hora.split(':').slice(0, 2).join(':');
  if (horario) {
    const d = new Date(horario);
    if (isNaN(d.getTime())) return horario;
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return '';
}

export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}
