import {
 productionCorridors,
  productionDataStatus,
  productionProviders,
  productionQuotes,
} from "@/lib/services/prototypeDataAdapter";

import type {
  ProductionDataStatus,
  ProductionProvider,
  ProductionQuote,
  ProductionCorridor,
} from "@/lib/types/production";

export type ProductionDataSource = {
  getCorridors(): readonly ProductionCorridor[];
getProviders(): readonly ProductionProvider[];
getQuotes(): readonly ProductionQuote[];
getStatus(): ProductionDataStatus;
};

export const prototypeProductionDataSource: ProductionDataSource = {
 getCorridors() {
  return productionCorridors;
},
  getProviders() {
  return productionProviders;
},
getQuotes() {
  return productionQuotes;
},
getStatus() {
  return productionDataStatus;
},
};
