"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useDataUpdate } from "@/lib/hooks/use-data-update";
import { useChampions } from "@/lib/hooks/use-champions";
import { GameDirectorySelector } from "@/components/game-directory/GameDirectorySelector";
import { useGameStore } from "@/lib/store";
import { Loader2, Sparkles, Trophy, Crown, AlertCircle, Shield } from "lucide-react";
import { useInitialization } from "@/lib/hooks/use-initialization";
import { useChampionPersistence } from "@/lib/hooks/use-champion-persistence";
import { filterAndSortChampions } from "@/lib/utils/champion-utils";
import ChampionGrid from "@/components/ChampionGrid";
import { SkinGrid } from "@/components/SkinGrid";
import { CustomSkinList } from "@/components/CustomSkinList";
import { EnhancedTopBar } from "@/components/layout/EnhancedTopBar";
import { AppInitializer } from "@/components/AppInitializer";
import EnhancedLoading from "@/components/EnhancedLoading";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { DownloadingModal } from "@/components/DownloadingModal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface UpdateInfo {
  has_update: boolean;
}

// Enhanced placeholder components with better animations
const ChampionSelectionPlaceholder = () => (
  <motion.div
    className="flex items-center justify-center h-full min-h-[400px]"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-center space-y-6 max-w-md">
      <motion.div
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-muted/50 to-primary/20 flex items-center justify-center mx-auto shadow-lg"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Sparkles className="h-10 w-10 text-primary/70" />
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Choose Your Champion
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Select a champion from the sidebar to explore their amazing skin collection
        </p>

        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-primary/60 mt-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="h-4 w-4" />
          <span>Ready when you are</span>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Enhanced error component
const ErrorDisplay = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <motion.div
    className="flex items-center justify-center h-screen w-full"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center space-y-6 max-w-md">
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-destructive/20 to-red-500/20 flex items-center justify-center mx-auto"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertCircle className="h-10 w-10 text-destructive" />
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-destructive">Something went wrong</h3>
        <p className="text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred while loading the application"}
        </p>
      </div>

      <Button
        onClick={onRetry}
        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg"
      >
        <Loader2 className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  </motion.div>
);

// App states
enum AppState {
  INITIALIZING = "initializing",
  SETUP = "setup",
  LOADING = "loading",
  READY = "ready",
  ERROR = "error"
}

// Main component
export default function EnhancedHome() {
  const { champions, loading, error, hasData } = useChampions();
  const { updateData, isUpdating, progress } = useDataUpdate();
  const { 
    leaguePath, 
    activeTab, 
    favorites, 
    toggleFavorite, 
    autoUpdateData
  } = useGameStore();
  
  // App state management
  const [appState, setAppState] = useState<AppState>(AppState.INITIALIZING);
  const [initError, setInitError] = useState<string>("");

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

  // Handle initialization completion
  const handleInitializationComplete = useCallback(() => {
    if (!leaguePath) {
      setAppState(AppState.SETUP);
    } else if (!hasData) {
      setAppState(AppState.LOADING);
    } else {
      setAppState(AppState.READY);
    }
  }, [leaguePath, hasData]);

  // Handle initialization error
  const handleInitializationError = useCallback((error: string) => {
    setInitError(error);
    setAppState(AppState.ERROR);
  }, []);

  // Optimized data update handler
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

  // Auto-download data if not available
  useEffect(() => {
    if (appState === AppState.LOADING && !isInitialDataLoad && !isUpdating) {
      setIsInitialDataLoad(true);
      handleUpdateData().finally(() => {
        setIsInitialDataLoad(false);
        setAppState(AppState.READY);
      });
    }
  }, [appState, isInitialDataLoad, isUpdating, handleUpdateData]);

  // Auto-update check
  useEffect(() => {
    if (!autoUpdateData || appState !== AppState.READY) return;

    const checkForUpdates = async () => {
      try {
        const updateResult: UpdateInfo = await invoke("check_github_updates");
        if (updateResult.has_update) {
          await invoke("update_champion_data_from_github");
          toast.success("Champion data auto-updated!");
        }
      } catch (err) {
        console.warn("Auto-update check failed:", err);
      }
    };

    checkForUpdates();
  }, [autoUpdateData, appState]);

  // Handle app state changes
  useEffect(() => {
    if (leaguePath && hasData && appState === AppState.SETUP) {
      setAppState(AppState.READY);
    }
  }, [leaguePath, hasData, appState]);

  // Retry handler for errors
  const handleRetry = useCallback(() => {
    setInitError("");
    setAppState(AppState.INITIALIZING);
  }, []);

  // Render based on app state
  switch (appState) {
    case AppState.INITIALIZING:
      return (
        <AppInitializer
          onComplete={handleInitializationComplete}
          onError={handleInitializationError}
        />
      );

    case AppState.ERROR:
      return (
        <ErrorDisplay
          error={new Error(initError)}
          onRetry={handleRetry}
        />
      );

    case AppState.SETUP:
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GameDirectorySelector />
        </motion.div>
      );

    case AppState.LOADING:
      return (
        <EnhancedLoading
          message="Loading Champion Data"
          progress={isInitialDataLoad ? progress : undefined}
          showTips={true}
        />
      );

    case AppState.READY:
      // Handle runtime errors
      if (error) {
        return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
      }

      // Show loading if still loading data
      if (loading || isInitialDataLoad) {
        return (
          <EnhancedLoading
            message="Finalizing Setup"
            progress={progress}
            variant="compact"
          />
        );
      }

      // Main application UI
      return (
        <motion.div
          className="flex flex-col h-full w-full bg-gradient-to-br from-background via-muted/5 to-primary/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Enhanced TopBar */}
          <EnhancedTopBar
            champions={champions}
            selectedChampionId={selectedChampion}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onChampionSelect={handleChampionSelect}
            onUpdateData={handleCheckForUpdates}
            isUpdating={isUpdating}
          />

          {/* Downloading Modal */}
          <DownloadingModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            onUpdate={handleUpdateData}
            progress={progress}
            isUpdating={isUpdating}
          />

          {/* Main Content */}
          <Suspense fallback={<EnhancedLoading variant="minimal" />}>
            <motion.div
              className="flex flex-1 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Champion Sidebar */}
              <motion.div
                className="w-1/4 xl:w-1/5 border-r border-border/50 bg-gradient-to-b from-muted/10 to-background/80 backdrop-blur-sm overflow-hidden"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <ChampionGrid
                  champions={filteredChampions}
                  onSelectChampion={handleChampionSelect}
                  selectedChampionId={selectedChampion}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              </motion.div>

              {/* Main Content Area */}
              <motion.div
                className="w-3/4 xl:w-4/5 flex flex-col overflow-hidden relative"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {/* Enhanced background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  />
                </div>

                {/* Content header */}
                <AnimatePresence mode="wait">
                  {selectedChampionData && (
                    <motion.div
                      key={selectedChampionData.id}
                      className="relative z-10 p-6 border-b border-border/50 bg-gradient-to-r from-background/90 to-muted/30 backdrop-blur-sm"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Crown className="h-7 w-7 text-primary" />
                        </motion.div>
                        <div>
                          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {selectedChampionData.name}
                          </h1>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Sparkles className="h-3 w-3" />
                            {activeTab === "official" ? "Official Skins" : "Custom Skins"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main content */}
                <div className="flex-1 overflow-y-auto relative z-10">
                  <motion.div
                    className="p-6"
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <AnimatePresence mode="wait">
                      {!selectedChampionData ? (
                        <ChampionSelectionPlaceholder />
                      ) : activeTab === "official" ? (
                        <motion.div
                          key="official"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <SkinGrid champion={selectedChampionData} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="custom"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                          <CustomSkinList championId={selectedChampion} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </Suspense>
        </motion.div>
      );

    default:
      return <EnhancedLoading message="Initializing..." />;
  }
}
