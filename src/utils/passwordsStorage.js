const KEY = 'pos_cine_passwords';

export function getPasswords() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPassword(entry) {
  const list = getPasswords();
  list.push({
    ...entry,
    creado_en: new Date().toISOString(),
  });
  localStorage.setItem(KEY, JSON.stringify(list));
}
