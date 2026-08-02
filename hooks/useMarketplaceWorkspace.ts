"use client";

import { useCallback, useEffect, useState } from "react";
import { clearRecentCorridors, emptyWorkspace, loadWorkspace, recordRecentCorridor, saveWorkspace, toggleFavorite, togglePin } from "@/lib/storage/marketplaceWorkspace";
import type { CorridorId, WorkspaceState } from "@/lib/types/transfer";

export function useMarketplaceWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(emptyWorkspace);
  const [isHydrated, setIsHydrated] = useState(false);

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
    setWorkspace((current) => {
      const next = update(current);
      saveWorkspace(next);
      return next;
    });
  }, []);

  const toggleFavoriteCorridor = useCallback((corridorId: CorridorId) => updateWorkspace((current) => toggleFavorite(current, corridorId)), [updateWorkspace]);
  const togglePinnedCorridor = useCallback((corridorId: CorridorId) => updateWorkspace((current) => togglePin(current, corridorId)), [updateWorkspace]);
  const recordRecent = useCallback((corridorId: CorridorId) => updateWorkspace((current) => recordRecentCorridor(current, corridorId)), [updateWorkspace]);
  const clearRecents = useCallback(() => updateWorkspace(clearRecentCorridors), [updateWorkspace]);
  const isFavorite = useCallback((corridorId: CorridorId) => workspace.favoriteCorridorIds.includes(corridorId), [workspace.favoriteCorridorIds]);
  const isPinned = useCallback((corridorId: CorridorId) => workspace.pinnedCorridorIds.includes(corridorId), [workspace.pinnedCorridorIds]);

  return { ...workspace, isHydrated, isFavorite, isPinned, toggleFavorite: toggleFavoriteCorridor, togglePin: togglePinnedCorridor, recordRecent, clearRecents };
}
