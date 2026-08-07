export const locales = ["en", "ht", "fr", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeFormats: Record<Locale, string> = {
  en: "en-US",
  ht: "ht-HT",
  fr: "fr-FR",
  es: "es",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ht: "Kreyòl ayisyen",
  fr: "Français",
  es: "Español",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = "") {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}
