export function formatCurrency(value: number | string) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function toDecimalString(value: number | string, fractionDigits = 2) {
  return Math.max(0, Number(value) || 0).toFixed(fractionDigits);
}
