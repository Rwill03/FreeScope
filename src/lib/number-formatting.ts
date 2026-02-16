/**
 * Currency and number formatting utilities
 */

export function formatCurrency(value: number, currency = "EUR"): string {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(value);
}

export function formatHours(hours: number): string {
  if (hours === 0) return "—";
  if (hours === 0.5) return "30m";
  if (hours % 1 === 0) return `${hours}h`;
  return `${hours.toFixed(1)}h`;
}

export function formatEstimate(hours: number, price: number): string {
  return `${formatHours(hours)} · ${formatCurrency(price)}`;
}
