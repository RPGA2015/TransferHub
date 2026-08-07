"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearRecentCorridors, clearRecentProviders, emptyWorkspace, loadWorkspace, recordRecentCorridor, recordRecentProvider, saveWorkspace, toggleFavorite, togglePin, toggleProviderFavorite } from "@/lib/storage/marketplaceWorkspace";
import type { CorridorId, ProviderId, WorkspaceState } from "@/lib/types/transfer";

export function useMarketplaceWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(emptyWorkspace);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasUserUpdate = useRef(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setWorkspace(loadWorkspace());
      setIsHydrated(true);
    });
    return () => { active = false; };
  }, []);

  const updateWorkspace = useCallback((update: (current: WorkspaceState) => WorkspaceState) => {
    hasUserUpdate.current = true;
    setWorkspace(update);
  }, []);

  useEffect(() => {
    if (!isHydrated || !hasUserUpdate.current) return;
    saveWorkspace(workspace);
  }, [isHydrated, workspace]);

  const toggleFavoriteCorridor = useCallback((corridorId: CorridorId) => updateWorkspace((current) => toggleFavorite(current, corridorId)), [updateWorkspace]);
  const togglePinnedCorridor = useCallback((corridorId: CorridorId) => updateWorkspace((current) => togglePin(current, corridorId)), [updateWorkspace]);
  const recordRecent = useCallback((corridorId: CorridorId) => updateWorkspace((current) => recordRecentCorridor(current, corridorId)), [updateWorkspace]);
  const clearRecents = useCallback(() => updateWorkspace(clearRecentCorridors), [updateWorkspace]);
  const isFavorite = useCallback((corridorId: CorridorId) => workspace.favoriteCorridorIds.includes(corridorId), [workspace.favoriteCorridorIds]);
  const isPinned = useCallback((corridorId: CorridorId) => workspace.pinnedCorridorIds.includes(corridorId), [workspace.pinnedCorridorIds]);
  const isProviderFavorite = useCallback((providerId: ProviderId) => workspace.favoriteProviderIds.includes(providerId), [workspace.favoriteProviderIds]);
  const toggleFavoriteProvider = useCallback((providerId: ProviderId) => updateWorkspace((current) => toggleProviderFavorite(current, providerId)), [updateWorkspace]);
  const recordProvider = useCallback((providerId: ProviderId) => updateWorkspace((current) => recordRecentProvider(current, providerId)), [updateWorkspace]);
  const clearProviderRecents = useCallback(() => updateWorkspace(clearRecentProviders), [updateWorkspace]);

  return { ...workspace, isHydrated, isFavorite, isPinned, isProviderFavorite, toggleFavorite: toggleFavoriteCorridor, togglePin: togglePinnedCorridor, recordRecent, clearRecents, toggleProviderFavorite: toggleFavoriteProvider, recordRecentProvider: recordProvider, clearRecentProviders: clearProviderRecents };
}
