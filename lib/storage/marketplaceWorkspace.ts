import { illustrativeCorridors } from "@/lib/data/corridors";
import { fictionalProviderProfiles } from "@/lib/data/providers";
import type { CorridorId, ProviderId, StoredWorkspaceState, WorkspaceState } from "@/lib/types/transfer";

export const marketplaceWorkspaceStorageKey = "transferhub_marketplace_workspace_v2";
export const legacyMarketplaceWorkspaceStorageKey = "transferhub_marketplace_workspace_v1";
export const marketplaceWorkspaceStorageVersion = 2 as const;
export const recentCorridorLimit = 6;
export const recentProviderLimit = 6;

const validCorridorIds = new Set<CorridorId>(illustrativeCorridors.map(({ id }) => id));
const validProviderIds = new Set<ProviderId>(fictionalProviderProfiles.map(({ id }) => id));

export const emptyWorkspace: WorkspaceState = {
  favoriteCorridorIds: [],
  pinnedCorridorIds: [],
  recentCorridorIds: [],
  favoriteProviderIds: [],
  recentProviderIds: [],
};

function sanitizeCorridorIds(value: unknown): CorridorId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is CorridorId => typeof id === "string" && validCorridorIds.has(id as CorridorId)))];
}

function sanitizeProviderIds(value: unknown): ProviderId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is ProviderId => typeof id === "string" && validProviderIds.has(id as ProviderId)))];
}

export function sanitizeWorkspace(value: unknown): WorkspaceState {
  if (!value || typeof value !== "object") return { ...emptyWorkspace };
  const candidate = value as Partial<StoredWorkspaceState>;
  const favoriteCorridorIds = sanitizeCorridorIds(candidate.favoriteCorridorIds);
  const favoriteIds = new Set(favoriteCorridorIds);
  return {
    favoriteCorridorIds,
    pinnedCorridorIds: sanitizeCorridorIds(candidate.pinnedCorridorIds).filter((id) => favoriteIds.has(id)),
    recentCorridorIds: sanitizeCorridorIds(candidate.recentCorridorIds).slice(0, recentCorridorLimit),
    favoriteProviderIds: sanitizeProviderIds(candidate.favoriteProviderIds),
    recentProviderIds: sanitizeProviderIds(candidate.recentProviderIds).slice(0, recentProviderLimit),
  };
}

export function loadWorkspace(): WorkspaceState {
  if (typeof window === "undefined") return { ...emptyWorkspace };
  try {
    const stored = window.localStorage.getItem(marketplaceWorkspaceStorageKey) ?? window.localStorage.getItem(legacyMarketplaceWorkspaceStorageKey);
    if (!stored) return { ...emptyWorkspace };
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return { ...emptyWorkspace };
    const version = (parsed as { version?: unknown }).version;
    if (version !== 1 && version !== marketplaceWorkspaceStorageVersion) return { ...emptyWorkspace };
    const workspace = sanitizeWorkspace(parsed);
    if (version === 1) saveWorkspace(workspace);
    return workspace;
  } catch {
    return { ...emptyWorkspace };
  }
}

export function saveWorkspace(workspace: WorkspaceState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored: StoredWorkspaceState = { version: marketplaceWorkspaceStorageVersion, ...sanitizeWorkspace(workspace) };
    window.localStorage.setItem(marketplaceWorkspaceStorageKey, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

export function addFavorite(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  if (!validCorridorIds.has(corridorId) || workspace.favoriteCorridorIds.includes(corridorId)) return workspace;
  return { ...workspace, favoriteCorridorIds: [...workspace.favoriteCorridorIds, corridorId] };
}

export function removeFavorite(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  return {
    ...workspace,
    favoriteCorridorIds: workspace.favoriteCorridorIds.filter((id) => id !== corridorId),
    pinnedCorridorIds: workspace.pinnedCorridorIds.filter((id) => id !== corridorId),
  };
}

export function toggleFavorite(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  return workspace.favoriteCorridorIds.includes(corridorId) ? removeFavorite(workspace, corridorId) : addFavorite(workspace, corridorId);
}

export function pinCorridor(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  if (!workspace.favoriteCorridorIds.includes(corridorId) || workspace.pinnedCorridorIds.includes(corridorId)) return workspace;
  return { ...workspace, pinnedCorridorIds: [...workspace.pinnedCorridorIds, corridorId] };
}

export function unpinCorridor(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  return { ...workspace, pinnedCorridorIds: workspace.pinnedCorridorIds.filter((id) => id !== corridorId) };
}

export function togglePin(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  return workspace.pinnedCorridorIds.includes(corridorId) ? unpinCorridor(workspace, corridorId) : pinCorridor(workspace, corridorId);
}

export function recordRecentCorridor(workspace: WorkspaceState, corridorId: CorridorId): WorkspaceState {
  if (!validCorridorIds.has(corridorId)) return workspace;
  return { ...workspace, recentCorridorIds: [corridorId, ...workspace.recentCorridorIds.filter((id) => id !== corridorId)].slice(0, recentCorridorLimit) };
}

export function clearRecentCorridors(workspace: WorkspaceState): WorkspaceState {
  return { ...workspace, recentCorridorIds: [] };
}

export function toggleProviderFavorite(workspace: WorkspaceState, providerId: ProviderId): WorkspaceState {
  if (!validProviderIds.has(providerId)) return workspace;
  return { ...workspace, favoriteProviderIds: workspace.favoriteProviderIds.includes(providerId)
    ? workspace.favoriteProviderIds.filter((id) => id !== providerId)
    : [...workspace.favoriteProviderIds, providerId] };
}

export function recordRecentProvider(workspace: WorkspaceState, providerId: ProviderId): WorkspaceState {
  if (!validProviderIds.has(providerId)) return workspace;
  return { ...workspace, recentProviderIds: [providerId, ...workspace.recentProviderIds.filter((id) => id !== providerId)].slice(0, recentProviderLimit) };
}

export function clearRecentProviders(workspace: WorkspaceState): WorkspaceState {
  return { ...workspace, recentProviderIds: [] };
}

export function recordRecentProviderInStorage(providerId: ProviderId): void {
  const current = loadWorkspace();
  if (current.recentProviderIds[0] === providerId) return;
  saveWorkspace(recordRecentProvider(current, providerId));
}

export function recordRecentCorridorInStorage(corridorId: CorridorId): void {
  const current = loadWorkspace();
  if (current.recentCorridorIds[0] === corridorId) return;
  saveWorkspace(recordRecentCorridor(current, corridorId));
}
