export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function currentPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function formatDateIso(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function periodLabel(month: number, year: number) {
  return `${MONTHS[month - 1]} ${year}`.toUpperCase();
}

export function dayFromIso(date: string) {
  return new Date(`${date}T00:00:00`).getDate();
}
