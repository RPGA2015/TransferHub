import { illustrativeCorridors } from "@/lib/data/corridors";

import type { Corridor } from "@/lib/types/transfer";

export type ProductionDataSource = {
  getCorridors(): readonly Corridor[];
};

export const prototypeProductionDataSource: ProductionDataSource = {
  getCorridors() {
    return illustrativeCorridors;
  },
};