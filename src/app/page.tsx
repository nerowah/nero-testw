"use client";

import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useDataUpdate } from "@/lib/hooks/use-data-update";
import { useChampions } from "@/lib/hooks/use-champions";
import { GameDirectorySelector } from "@/components/game-directory/GameDirectorySelector";
import { useGameStore } from "@/lib/store";
import { Loader2, Sparkles, Trophy, Crown } from "lucide-react";
import { useInitialization } from "@/lib/hooks/use-initialization";
import { useChampionPersistence } from "@/lib/hooks/use-champion-persistence";
import { filterAndSortChampions } from "@/lib/utils/champion-utils";
import ChampionGrid from "@/components/ChampionGrid";
import { SkinGrid } from "@/components/SkinGrid";
import { CustomSkinList } from "@/components/CustomSkinList";
import { TopBar } from "@/components/layout/TopBar";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DownloadingModal } from "@/components/DownloadingModal";
import { ChampionLoading, SkinLoading } from "@/components/EnhancedLoading";
import { ScrollArea } from "@/components/ui/scroll-area";
import ErrorBoundary from "@/components/ErrorBoundary";

interface UpdateInfo {
  has_update: boolean;
}

// Memoized loading component for better performance
const PageLoading = React.memo(() => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <ChampionLoading 
        title="Loading Champions Data"
        subtitle="Preparing your League experience..."
      />
    </div>
  );
});

// Memoized champion selection placeholder
const ChampionSelectionPlaceholder = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-center space-y-4 max-w-md">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto">
        <Sparkles className="h-8 w-8 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground/80">
        Select a Champion
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        Choose a champion from the sidebar to view and manage their skins
      </p>
    </div>
  </div>
);

// Main component
export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  );
}

function HomeContent() {
  const { champions, loading, error, hasData } = useChampions();
  const { updateData, isUpdating, progress } = useDataUpdate();
  const { 
    leaguePath, 
    activeTab, 
    favorites, 
    toggleFavorite, 
    settings: { autoUpdateData },
  } = useGameStore();
  
  // Local state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInitialDataLoad, setIsInitialDataLoad] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChampion, setSelectedChampion] = useState<number | null>(null);

  // Initialize app
  useInitialization();
  useChampionPersistence();

  // Memoized computed values for better performance
  const filteredChampions = useMemo(
    () => filterAndSortChampions(champions, searchQuery, favorites),
    [champions, searchQuery, favorites]
  );

  const selectedChampionData = useMemo(
    () => champions.find((champ) => champ.id === selectedChampion),
    [champions, selectedChampion]
  );

  // Optimized data update handler with better error handling
  const handleUpdateData = useCallback(async () => {
    try {
      await invoke("delete_champions_cache");
      await updateData();
      toast.success("Champion data updated successfully!");
    } catch (error) {
      console.error("Failed to update data:", error);
      toast.error(
        error instanceof Error 
          ? `Failed to update data: ${error.message}` 
          : "Failed to update data"
      );
    }
  }, [updateData]);

  const handleCheckForUpdates = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  // Optimized champion selection handler
  const handleChampionSelect = useCallback((championId: number) => {
    setSelectedChampion(championId);
  }, []);

  // Auto-download data if not available (optimized with better dependency array)
  useEffect(() => {
    if (leaguePath && hasData === false && !isInitialDataLoad && !isUpdating) {
      setIsInitialDataLoad(true);
      handleUpdateData().finally(() => {
        setIsInitialDataLoad(false);
      });
    }
  }, [leaguePath, hasData, isInitialDataLoad, isUpdating, handleUpdateData]);

  // Auto-update check (only runs once on mount when enabled)
  useEffect(() => {
    if (!autoUpdateData) return;

    const checkForUpdates = async () => {
      try {
        const updateResult: UpdateInfo = await invoke("check_github_updates");
        if (updateResult.has_update) {
          await invoke("update_champion_data_from_github");
          toast.success("Champion data auto-updated!");
        }
      } catch (err) {
        console.warn("Auto-update check failed:", err);
        // Silent fail for auto-update to avoid spam
      }
    };

    checkForUpdates();
  }, [autoUpdateData]);

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Trophy className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold">Something went wrong</h3>
          <p className="text-muted-foreground max-w-md">
            {String(error) || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  // Initial setup states
  if (!leaguePath) {
    return <GameDirectorySelector />;
  }

  // Show loading screen while downloading initial data or when loading
  if (hasData === false || loading || isInitialDataLoad) {
    return <PageLoading />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-background via-muted/10 to-primary/5">
      {/* Enhanced TopBar */}
      <div className="relative z-20">
        <TopBar
          champions={champions}
          selectedChampionId={selectedChampion}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUpdateData={handleCheckForUpdates}
          isUpdating={isUpdating}
        />
      </div>

      {/* Downloading Modal */}
      <DownloadingModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        progress={progress}
        isUpdating={isUpdating}
      />

      {/* Main Content */}
      <Suspense fallback={<PageLoading />}>
        <div className="flex flex-1 overflow-hidden">
          {/* Champion Sidebar */}
          <div className="w-1/4 xl:w-1/5 border-r border-border/50 bg-gradient-to-b from-muted/20 to-background/50 backdrop-blur-sm overflow-hidden">
            <ChampionGrid
              champions={filteredChampions}
              onSelectChampion={handleChampionSelect}
              selectedChampionId={selectedChampion}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          </div>

          {/* Main Content Area */}
          <div className="w-3/4 xl:w-4/5 flex flex-col overflow-hidden relative">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            {/* Content header */}
            {selectedChampionData && (
              <div className="relative z-10 p-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-muted/40 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {selectedChampionData.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "official" ? "Official Skins" : "Custom Skins"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex-1 relative z-10">
              {!selectedChampionData ? (
                <ChampionSelectionPlaceholder />
              ) : activeTab === "official" ? (
                <SkinGrid champion={selectedChampionData} isLoading={loading} />
              ) : (
                <ScrollArea className="h-full w-full">
                  <div className="p-6">
                    <CustomSkinList championId={selectedChampion} />
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
