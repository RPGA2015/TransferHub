import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Country, PayoutFilter, PayoutMethod, Region } from "@/lib/types/transfer";

export const getCountryLabel = (country: Country, locale: Locale) => getDictionary(locale).countries[country];
export const getRegionLabel = (region: Region, locale: Locale) => getDictionary(locale).regions[region];
export const getPayoutMethodLabel = (method: PayoutMethod, locale: Locale) => getDictionary(locale).payoutMethods[method];
export const getPayoutFilterLabel = (filter: PayoutFilter, locale: Locale) => filter === "all" ? getDictionary(locale).comparison.allPayoutMethods : getPayoutMethodLabel(filter, locale);
