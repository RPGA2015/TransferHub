import { illustrativeCorridors } from "@/lib/data/corridors";
import {
  productionDataStatus,
  productionProviders,
  productionQuotes,
} from "@/lib/services/prototypeDataAdapter";

import type { Corridor } from "@/lib/types/transfer";
import type {
  ProductionDataStatus,
  ProductionProvider,
  ProductionQuote,
} from "@/lib/types/production";

export type ProductionDataSource = {
  getCorridors(): readonly Corridor[];
getProviders(): readonly ProductionProvider[];
getQuotes(): readonly ProductionQuote[];
getStatus(): ProductionDataStatus;
};

export const prototypeProductionDataSource: ProductionDataSource = {
  getCorridors() {
    return illustrativeCorridors;
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
