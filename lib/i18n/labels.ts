import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Country, DeliveryMethod, DigitalAccess, PayoutFilter, PayoutMethod, Region, SupportChannel } from "@/lib/types/transfer";

export const getCountryLabel = (country: Country, locale: Locale) => getDictionary(locale).countries[country];
export const getRegionLabel = (region: Region, locale: Locale) => getDictionary(locale).regions[region];
export const getPayoutMethodLabel = (method: PayoutMethod, locale: Locale) => getDictionary(locale).payoutMethods[method];
export const getPayoutFilterLabel = (filter: PayoutFilter, locale: Locale) => filter === "all" ? getDictionary(locale).comparison.allPayoutMethods : getPayoutMethodLabel(filter, locale);
const deliveryMethodLabels: Record<Locale, Record<DeliveryMethod, string>> = {
  en: {
    "Near instant": "Near instant",
    "Within an hour": "Within an hour",
    "Same day": "Same day",
    "1–2 business days": "1–2 business days",
  },
  es: {
    "Near instant": "Casi instantáneo",
    "Within an hour": "En menos de una hora",
    "Same day": "El mismo día",
    "1–2 business days": "1–2 días hábiles",
  },
  fr: {
    "Near instant": "Presque instantané",
    "Within an hour": "Dans l’heure",
    "Same day": "Le jour même",
    "1–2 business days": "1 à 2 jours ouvrables",
  },
  ht: {
    "Near instant": "Prèske touswit",
    "Within an hour": "Nan yon èdtan",
    "Same day": "Menm jou a",
    "1–2 business days": "1–2 jou ouvrab",
  },
};

export const getDeliveryMethodLabel = (
  method: DeliveryMethod,
  locale: Locale,
) => deliveryMethodLabels[locale][method];
const digitalAccessLabels: Record<Locale, Record<DigitalAccess, string>> = {
  en: {
    Web: "Web",
    "Mobile app": "Mobile app",
  },
  es: {
    Web: "Web",
    "Mobile app": "Aplicación móvil",
  },
  fr: {
    Web: "Web",
    "Mobile app": "Application mobile",
  },
  ht: {
    Web: "Web",
    "Mobile app": "Aplikasyon mobil",
  },
};

export const getDigitalAccessLabel = (
  access: DigitalAccess,
  locale: Locale,
) => digitalAccessLabels[locale][access];

const supportChannelLabels: Record<Locale, Record<SupportChannel, string>> = {
  en: {
    Email: "Email",
    Phone: "Phone",
    "In-app help": "In-app help",
    "Help center": "Help center",
  },
  es: {
    Email: "Correo electrónico",
    Phone: "Teléfono",
    "In-app help": "Ayuda en la aplicación",
    "Help center": "Centro de ayuda",
  },
  fr: {
    Email: "E-mail",
    Phone: "Téléphone",
    "In-app help": "Aide dans l’application",
    "Help center": "Centre d’aide",
  },
  ht: {
    Email: "Imèl",
    Phone: "Telefòn",
    "In-app help": "Èd nan aplikasyon an",
    "Help center": "Sant èd",
  },
};

export const getSupportChannelLabel = (
  channel: SupportChannel,
  locale: Locale,
) => supportChannelLabels[locale][channel];