import type { Country, CountryCode, CurrencyCode, Region } from "@/lib/types/transfer";

export type CountryDefinition = {
  code: CountryCode;
  name: Country;
  label: string;
  currency: CurrencyCode;
  canSend: boolean;
  canReceive: boolean;
  region: Region;
};

export const countries: readonly CountryDefinition[] = [
  { code: "US", name: "United States", label: "United States", currency: "USD", canSend: true, canReceive: true, region: "North America" },
  { code: "CA", name: "Canada", label: "Canada", currency: "CAD", canSend: true, canReceive: true, region: "North America" },
  { code: "FR", name: "France", label: "France", currency: "EUR", canSend: true, canReceive: false, region: "Europe" },
  { code: "HT", name: "Haiti", label: "Haiti", currency: "HTG", canSend: true, canReceive: true, region: "Caribbean" },
  { code: "DO", name: "Dominican Republic", label: "Dominican Republic", currency: "DOP", canSend: true, canReceive: true, region: "Caribbean" },
];

export const countryCurrencies = Object.fromEntries(
  countries.map(({ name, currency }) => [name, currency]),
) as Record<Country, CurrencyCode>;

export function getCountryDefinition(country: Country): CountryDefinition {
  return countries.find(({ name }) => name === country) as CountryDefinition;
}
