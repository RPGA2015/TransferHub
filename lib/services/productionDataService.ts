import { illustrativeCorridors } from "@/lib/data/corridors";
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
    corridors: applicationDataSource.getCorridors(),
    providers: applicationDataSource.getProviders(),
    quotes: applicationDataSource.getQuotes(),
    status: applicationDataSource.getStatus(),
  };
}
export type ApplicationDataSourceMode = "prototype";
export type ApplicationDataSourceSemantics = "illustrative";
let applicationDataSource: ProductionDataSource =
  prototypeProductionDataSource;

let applicationDataSourceMode: ApplicationDataSourceMode = "prototype";
export type ApplicationDataSourceStatus = {
  mode: ApplicationDataSourceMode;
  semantics: ApplicationDataSourceSemantics;
  isLive: boolean;
};
export type ApplicationDataSourceMetadataContract = {
  mode: ApplicationDataSourceMode;
  semantics: ApplicationDataSourceSemantics;
  isLive: boolean;
};

export type ApplicationDataSourceMetadataSnapshot =
  Readonly<ApplicationDataSourceMetadataContract>;
  export function createApplicationDataSourceMetadataSnapshot(
  metadata: ApplicationDataSourceMetadataContract,
): ApplicationDataSourceMetadataSnapshot {
  return {
    ...metadata,
  };
}
export function setApplicationDataSource(
  dataSource: ProductionDataSource,
  mode: ApplicationDataSourceMode,
): void {
  applicationDataSource = dataSource;
  applicationDataSourceMode = mode;
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
  setApplicationDataSource(prototypeProductionDataSource, mode);
}
}
export function initializeApplicationDataSource(): void {
  const mode = getApplicationDataSourceModeFromEnvironment();
  configureApplicationDataSource(mode);
}
export function getApplicationDataSourceStatus(): ApplicationDataSourceStatus {
  return {
    mode: applicationDataSourceMode,
    semantics: "illustrative",
    isLive: false,
  };
}
export function getApplicationDataSourceMetadata(): ApplicationDataSourceMetadataSnapshot {
  return createApplicationDataSourceMetadataSnapshot(
  getApplicationDataSourceStatus(),
);
}export function getApplicationCorridors() {
  return illustrativeCorridors;
}
