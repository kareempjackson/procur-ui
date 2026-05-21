/**
 * Currency formatting utilities.
 *
 * Backend stores monetary values as plain numbers in the order/product's
 * own currency (no implicit USD assumption). Always pass the currency code
 * from the source object (order.currency, product.currency, cart.currency, etc.)
 * so locale-appropriate grouping/decimal rules apply — e.g. COP renders
 * with `.` as the thousands separator and no fractional digits.
 */

const LOCALE_BY_CURRENCY: Record<string, string> = {
  COP: "es-CO",
  XCD: "en-AG",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  CAD: "en-CA",
  MXN: "es-MX",
  BRL: "pt-BR",
};

function resolveLocale(currency: string): string | undefined {
  return LOCALE_BY_CURRENCY[currency.toUpperCase()];
}

function resolveCurrency(currency?: string | null): string {
  const code = (currency || "USD").toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : "USD";
}

/**
 * Format a monetary amount using its currency's locale conventions.
 *
 * @param amount - numeric value (may be number, string, null, or undefined)
 * @param currency - ISO 4217 currency code (defaults to USD when missing)
 */
export function formatMoney(
  amount: number | string | null | undefined,
  currency?: string | null,
): string {
  const code = resolveCurrency(currency);
  const value = Number(amount ?? 0);
  const safe = Number.isFinite(value) ? value : 0;

  try {
    return new Intl.NumberFormat(resolveLocale(code), {
      style: "currency",
      currency: code,
    }).format(safe);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(safe);
  }
}

/**
 * Build a reusable formatter — cheaper than calling `formatMoney` inside a hot
 * loop, since `Intl.NumberFormat` instances are expensive to construct.
 */
export function makeMoneyFormatter(currency?: string | null) {
  const code = resolveCurrency(currency);
  const formatter = (() => {
    try {
      return new Intl.NumberFormat(resolveLocale(code), {
        style: "currency",
        currency: code,
      });
    } catch {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      });
    }
  })();
  return (amount: number | string | null | undefined): string => {
    const value = Number(amount ?? 0);
    return formatter.format(Number.isFinite(value) ? value : 0);
  };
}
