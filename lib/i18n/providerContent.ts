import type { Locale } from "@/lib/i18n/config";
import type { ProviderId } from "@/lib/types/transfer";

type LocalizedProviderContent = {
  description: string;
  summaries: Record<ProviderId, string>;
  availabilityNotes: Record<ProviderId, string>;
};

const content: Record<Locale, LocalizedProviderContent> = {
 en: {
  description: "Fictional provider profile used to demonstrate comparison features.",
  summaries: {
    "provider-a": "Illustrative cash and bank payout options across supported sample corridors.",
    "provider-b": "Illustrative bank-deposit option with corridor-specific sample values.",
    "provider-c": "Illustrative cash-pickup option emphasizing short sample delivery estimates.",
    "provider-d": "Illustrative mobile-wallet option for supported sample corridors.",
    "provider-e": "Illustrative bank-deposit option currently used in one sample corridor.",
  },
  availabilityNotes: {
    "provider-a": "Illustrative availability varies by sample corridor and is not a live service claim.",
    "provider-b": "Shown only where a fictional bank-deposit offer exists in the prototype.",
    "provider-c": "Cash-pickup coverage shown here is fictional and corridor-specific.",
    "provider-d": "Wallet availability and delivery timing are fictional prototype metadata.",
    "provider-e": "This fictional profile appears only where an explicit sample offer is defined.",
  },
},
ht: {
  description: "Pwofil founisè ki envante pou montre fonksyon konparezon yo.",
  summaries: {
    "provider-a": "Opsyon egzanp pou resevwa lajan kach oswa nan bank sou koridò ki sipòte yo.",
    "provider-b": "Opsyon egzanp pou depo labank ak valè egzanp ki espesifik pou koridò a.",
    "provider-c": "Opsyon egzanp pou pran lajan kach ki mete aksan sou estimasyon livrezon kout.",
    "provider-d": "Opsyon egzanp bous mobil pou koridò ki sipòte yo.",
    "provider-e": "Opsyon egzanp depo labank ki aktyèlman itilize nan yon koridò egzanp.",
  },
  availabilityNotes: {
    "provider-a": "Disponibilite ilistratif la varye selon koridò egzanp lan epi li pa yon deklarasyon sèvis reyèl.",
    "provider-b": "Li parèt sèlman kote yon òf depo labank fiktif egziste nan pwototip la.",
    "provider-c": "Disponibilite pou pran lajan kach ki montre isit la se fiktif epi li espesifik pou koridò a.",
    "provider-d": "Disponibilite bous la ak tan livrezon an se done fiktif pou pwototip la.",
    "provider-e": "Pwofil fiktif sa a parèt sèlman kote yo defini yon òf egzanp klèman.",
  },
},
 fr: {
  description: "Profil fictif utilisé pour présenter les fonctions de comparaison.",
  summaries: {
    "provider-a": "Options illustratives de versement en espèces et par banque sur les corridors d’exemple pris en charge.",
    "provider-b": "Option illustrative de dépôt bancaire avec des valeurs d’exemple propres au corridor.",
    "provider-c": "Option illustrative de retrait en espèces mettant l’accent sur des délais de livraison courts.",
    "provider-d": "Option illustrative de portefeuille mobile pour les corridors d’exemple pris en charge.",
    "provider-e": "Option illustrative de dépôt bancaire actuellement utilisée dans un corridor d’exemple.",
  },
  availabilityNotes: {
    "provider-a": "La disponibilité illustrative varie selon le corridor d’exemple et ne constitue pas une offre de service réelle.",
    "provider-b": "Affiché uniquement lorsqu’une offre fictive de dépôt bancaire existe dans le prototype.",
    "provider-c": "La couverture du retrait en espèces présentée ici est fictive et propre au corridor.",
    "provider-d": "La disponibilité du portefeuille et les délais de livraison sont des données fictives du prototype.",
    "provider-e": "Ce profil fictif apparaît uniquement lorsqu’une offre d’exemple explicite est définie.",
  },
},
 es: {
  description: "Perfil ficticio utilizado para mostrar las funciones de comparación.",
  summaries: {
    "provider-a": "Opciones ilustrativas de entrega en efectivo y bancaria en corredores de ejemplo compatibles.",
    "provider-b": "Opción ilustrativa de depósito bancario con valores de ejemplo específicos del corredor.",
    "provider-c": "Opción ilustrativa de retiro en efectivo que destaca estimaciones de entrega cortas.",
    "provider-d": "Opción ilustrativa de billetera móvil para corredores de ejemplo compatibles.",
    "provider-e": "Opción ilustrativa de depósito bancario utilizada actualmente en un corredor de ejemplo.",
  },
  availabilityNotes: {
    "provider-a": "La disponibilidad ilustrativa varía según el corredor de ejemplo y no representa una oferta de servicio real.",
    "provider-b": "Se muestra únicamente cuando existe una oferta ficticia de depósito bancario en el prototipo.",
    "provider-c": "La cobertura de retiro en efectivo que se muestra aquí es ficticia y específica del corredor.",
    "provider-d": "La disponibilidad de la billetera y los tiempos de entrega son datos ficticios del prototipo.",
    "provider-e": "Este perfil ficticio aparece únicamente cuando se define explícitamente una oferta de ejemplo.",
  },
},
};

export function getLocalizedProviderContent(providerId: ProviderId, locale: Locale) {
 return {
  description: content[locale].description,
  serviceSummary: content[locale].summaries[providerId],
  availabilityNote: content[locale].availabilityNotes[providerId],
};
}
