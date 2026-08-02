import type { Country, CurrencyCode } from "@/lib/types/transfer";

export type CountryDefinition = {
  name: Country;
  label: string;
  currency: CurrencyCode;
};

export const countries: readonly CountryDefinition[] = [
  { name: "United States", label: "United States", currency: "USD" },
  { name: "Canada", label: "Canada", currency: "CAD" },
  { name: "France", label: "France", currency: "EUR" },
  { name: "Haiti", label: "Haiti", currency: "HTG" },
  { name: "Dominican Republic", label: "Dominican Republic", currency: "DOP" },
];

export const sendingCountries = ["United States", "Canada", "France"] as const satisfies readonly Country[];
export const receivingCountries = ["Haiti", "Dominican Republic"] as const satisfies readonly Country[];

export const countryCurrencies = Object.fromEntries(
  countries.map(({ name, currency }) => [name, currency]),
) as Record<Country, CurrencyCode>;
