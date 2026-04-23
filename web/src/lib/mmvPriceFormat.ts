/**
 * MMV page only: render full-rupee display strings (e.g. "₹14,80,000")
 * as lakh labels (e.g. "₹14.8 lakh").
 * If the string already uses "lakh", it is returned unchanged.
 */
export function formatInrDisplayAsLakh(display: string): string {
  if (!display || /lakh/i.test(display)) {
    return display;
  }
  const digits = display.replace(/\D/g, "");
  if (!digits) {
    return display;
  }
  const rupees = Number(digits);
  if (!Number.isFinite(rupees) || rupees < 0) {
    return display;
  }
  const lakh = rupees / 100_000;
  const rounded = Math.round(lakh * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `₹${text} lakh`;
}
