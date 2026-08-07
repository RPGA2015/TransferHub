import type { Locale } from "@/lib/i18n/config";
import type { ProviderId } from "@/lib/types/transfer";

type LocalizedProviderContent = { description: string; summaries: Record<ProviderId, string> };

const content: Record<Locale, LocalizedProviderContent> = {
  en: { description: "Fictional provider profile used to demonstrate comparison features.", summaries: { "provider-a": "Illustrative cash and bank payout options across supported sample corridors.", "provider-b": "Illustrative bank-deposit option with corridor-specific sample values.", "provider-c": "Illustrative cash-pickup option emphasizing short sample delivery estimates.", "provider-d": "Illustrative mobile-wallet option for supported sample corridors.", "provider-e": "Illustrative bank-deposit option currently used in one sample corridor." } },
  ht: { description: "Pwofil founisè ki envante pou montre fonksyon konparezon yo.", summaries: { "provider-a": "Opsyon egzanp pou resevwa lajan kach oswa nan bank sou koridò ki sipòte yo.", "provider-b": "Opsyon depo labank ak valè egzanp ki depann de koridò a.", "provider-c": "Opsyon pran lajan kach ak delè egzanp ki kout.", "provider-d": "Opsyon bous mobil pou koridò egzanp ki sipòte yo.", "provider-e": "Opsyon depo labank egzanp ki parèt nan yon sèl koridò." } },
  fr: { description: "Profil fictif utilisé pour présenter les fonctions de comparaison.", summaries: { "provider-a": "Options illustratives de versement en espèces ou en banque dans les corridors pris en charge.", "provider-b": "Option illustrative de dépôt bancaire avec des valeurs propres au corridor.", "provider-c": "Option illustrative de retrait d’espèces avec des délais d’exemple courts.", "provider-d": "Option illustrative de portefeuille mobile pour les corridors pris en charge.", "provider-e": "Option illustrative de dépôt bancaire utilisée dans un seul corridor d’exemple." } },
  es: { description: "Perfil ficticio utilizado para mostrar las funciones de comparación.", summaries: { "provider-a": "Opciones ilustrativas de entrega en efectivo o banco en los corredores admitidos.", "provider-b": "Opción ilustrativa de depósito bancario con valores específicos del corredor.", "provider-c": "Opción ilustrativa de retiro en efectivo con plazos de ejemplo cortos.", "provider-d": "Opción ilustrativa de billetera móvil para los corredores admitidos.", "provider-e": "Opción ilustrativa de depósito bancario usada en un solo corredor de ejemplo." } },
};

export function getLocalizedProviderContent(providerId: ProviderId, locale: Locale) {
  return { description: content[locale].description, serviceSummary: content[locale].summaries[providerId] };
}
