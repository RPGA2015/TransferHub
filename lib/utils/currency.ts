import type { CurrencyCode } from "@/lib/types/transfer";

export function formatCurrency(value: number, currency: CurrencyCode, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits }).format(value);
}

export function formatExchangeRate(rate: number, sendingCurrency: CurrencyCode, receivingCurrency: CurrencyCode): string {
  return `1 ${sendingCurrency} = ${rate.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${receivingCurrency}`;
}

export function formatRecipientAmount(value: number, currency: CurrencyCode): string {
  return formatCurrency(value, currency);
}

export function getCurrencyDisplayPrefix(currency: CurrencyCode): string {
  return currency;
}
