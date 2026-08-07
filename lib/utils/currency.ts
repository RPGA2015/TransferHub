import type { CurrencyCode } from "@/lib/types/transfer";
import { localeFormats, type Locale } from "@/lib/i18n/config";

function safeLocale(locale: Locale): string {
  const requested = localeFormats[locale];
  return Intl.NumberFormat.supportedLocalesOf([requested]).length > 0 ? requested : "en-US";
}

export function formatCurrency(value: number, currency: CurrencyCode, maximumFractionDigits = 2, locale: Locale = "en"): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(safeLocale(locale), { style: "currency", currency, currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits }).format(safeValue);
}

export function formatExchangeRate(rate: number, sendingCurrency: CurrencyCode, receivingCurrency: CurrencyCode, locale: Locale = "en"): string {
  const safeRate = Number.isFinite(rate) ? rate : 0;
  return `1 ${sendingCurrency} = ${safeRate.toLocaleString(safeLocale(locale), { maximumFractionDigits: 2 })} ${receivingCurrency}`;
}

export function formatRecipientAmount(value: number, currency: CurrencyCode, locale: Locale = "en"): string {
  return formatCurrency(value, currency, 2, locale);
}

export function getCurrencyDisplayPrefix(currency: CurrencyCode): string {
  return currency;
}
