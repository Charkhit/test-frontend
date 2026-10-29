export function calculateAge(birthDate: string): number | null {
  const [year, month, day] = birthDate.split('-').map(Number);
  if (!year || !month || !day) return null;

  const today = new Date();
  let age = today.getFullYear() - year;
  const birthdayHasPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!birthdayHasPassed) age -= 1;
  return age >= 0 ? age : null;
}

export function ageLabel(birthDate: string): string {
  const age = calculateAge(birthDate);
  return age === null ? '—' : `${age} ปี`;
}

export function ageNonLabel(birthDate: string): string {
  const age = calculateAge(birthDate);
  return age === null ? '—' : `${age}`;
}

export function formatDate(date: string): string {
  if (!date) return '—';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export function todayAsDateInput(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
