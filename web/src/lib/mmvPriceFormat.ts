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

/** Shivi discount applied on top of ACKO Drive price for the exclusive unlocked line. */
export const SHIVI_UNLOCK_EXCLUSIVE_DISCOUNT_INR = 20_000;

function parseInrDisplayToRupees(display: string): number | null {
  const digits = display.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

/** e.g. 1460000 → "₹14,60,000" (en-IN grouping). */
function formatRupeesInrCurrency(rupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Exclusive price = ACKO Drive display amount minus the fixed Shivi discount.
 * If parsing fails, returns `ackoPriceDisplay` unchanged.
 */
export function formatExclusiveUnlockedPrice(
  ackoPriceDisplay: string,
  discountRupees: number = SHIVI_UNLOCK_EXCLUSIVE_DISCOUNT_INR,
): string {
  const acko = parseInrDisplayToRupees(ackoPriceDisplay);
  if (acko === null) {
    return ackoPriceDisplay;
  }
  const exclusive = Math.max(0, acko - discountRupees);
  return formatRupeesInrCurrency(exclusive);
}
