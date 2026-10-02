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
export type ApplicationDataSourceMode = "prototype";
export function setApplicationDataSource(
  dataSource: ProductionDataSource,
): void {
  applicationDataSource = dataSource;
}
export function getApplicationDataSourceModeFromEnvironment():
  ApplicationDataSourceMode {
  const mode = process.env.TRANSFERHUB_DATA_SOURCE;

  if (mode === "prototype") {
    return mode;
  }
  return "prototype";
}
export function configureApplicationDataSource(
  mode: ApplicationDataSourceMode,
): void {
  if (mode === "prototype") {
    setApplicationDataSource(prototypeProductionDataSource);
  }
}
export function getApplicationCorridors() {
return applicationDataSource.getCorridors();
}
