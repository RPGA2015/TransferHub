import { en } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { fr } from "@/lib/i18n/dictionaries/fr";
import { ht } from "@/lib/i18n/dictionaries/ht";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

const dictionaries: Record<Locale, Dictionary> = { en, ht, fr, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function translate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
