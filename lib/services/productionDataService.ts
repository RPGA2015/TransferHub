import {
  prototypeProductionDataSource,
  type ProductionDataSource,
} from "@/lib/services/productionDataSource";

import {
  productionCorridors,
  productionProviders,
  productionQuotes,
  productionDataStatus,
} from "@/lib/services/prototypeDataAdapter";

import type {
  ProductionCorridor,
  ProductionProvider,
  ProductionQuote,
  ProductionDataStatus,
} from "@/lib/types/production";

export type ProductionDataSnapshot = {
  corridors: readonly ProductionCorridor[];
  providers: readonly ProductionProvider[];
  quotes: readonly ProductionQuote[];
  status: ProductionDataStatus;
};

export function getProductionDataSnapshot(): ProductionDataSnapshot {
  return {
    corridors: productionCorridors,
    providers: productionProviders,
    quotes: productionQuotes,
    status: productionDataStatus,
    };
}
let applicationDataSource: ProductionDataSource =
 prototypeProductionDataSource;

export function setApplicationDataSource(
  dataSource: ProductionDataSource,
): void {
  applicationDataSource = dataSource;
}
export function getApplicationCorridors() {
return applicationDataSource.getCorridors();
}
