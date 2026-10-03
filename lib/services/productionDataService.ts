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
export type ApplicationDataSourceStatus = {
  mode: ApplicationDataSourceMode;
  isLive: boolean;
};
export function setApplicationDataSource(
  dataSource: ProductionDataSource,
): void {
  applicationDataSource = dataSource;
}
export function getApplicationDataSourceModeFromEnvironment():
  ApplicationDataSourceMode {
  const mode = process.env.TRANSFERHUB_DATA_SOURCE?.trim();

if (!mode || mode === "prototype") {
  return "prototype";
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
export function initializeApplicationDataSource(): void {
  const mode = getApplicationDataSourceModeFromEnvironment();
  configureApplicationDataSource(mode);
}
export function getApplicationDataSourceMode(): ApplicationDataSourceMode {
  return getApplicationDataSourceModeFromEnvironment();
}
export function getApplicationDataSourceStatus(): ApplicationDataSourceStatus {
  return {
    mode: getApplicationDataSourceMode(),
    isLive: false,
  };
}export function getApplicationCorridors() {
return applicationDataSource.getCorridors();
}
