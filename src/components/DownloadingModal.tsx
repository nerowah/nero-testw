"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataUpdateProgress, DataUpdateResult } from "@/lib/types";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

interface GitHubUpdateProgressPayload {
  status: string; // "starting", "manifest_downloaded", "downloading_champion_files", "completed", "error"
  error?: string;
  manifest_total_champions?: number;
  current_champion_name?: string;
  processed_champions?: number;
  total_champions?: number;
  overall_progress_percent?: number;
}

interface DownloadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: DataUpdateProgress | null;
  isUpdating: boolean;
}

export function DownloadingModal({
  isOpen,
  onClose,
  progress,
  isUpdating,
}: DownloadingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [updateResult, setUpdateResult] = useState<DataUpdateResult | null>(
    null
  );
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [ghProgress, setGhProgress] = useState<GitHubUpdateProgressPayload | null>(null);

  // Check for GitHub updates when the modal is opened
  useEffect(() => {
    if (isOpen) {
      checkForUpdates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setGhProgress(null);
      return;
    }

    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await listen<GitHubUpdateProgressPayload>("GH_UPDATE_PROGRESS", (event) => {
        console.log("GH_UPDATE_PROGRESS event received:", event.payload);
        setGhProgress(event.payload);
        // If completed or error, could potentially stop listening or reset updatingData
        if (event.payload.status === "completed" || event.payload.status === "error") {
          // setUpdatingData(false); // Example: stop showing GH progress as primary
        }
      });
    };

    if (updatingData) { // Only listen if we are in GitHub update mode
      setupListener();
    }

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [isOpen, updatingData]);

  // Function to check for updates from GitHub
  const checkForUpdates = () => {
    setCheckingForUpdates(true);

    startTransition(async () => {
      try {
        const result = await invoke<DataUpdateResult>("check_github_updates");
        setUpdateResult(result);
        console.log("Update check result:", result);
      } catch (error) {
        console.error("Failed to check for updates:", error);
        toast.error("Failed to check for updates");
      } finally {
        setCheckingForUpdates(false);
      }
    });
  };

  // Function to pull updates from GitHub
  const pullUpdates = () => {
    setUpdatingData(true);

    startTransition(async () => {
      try {
        const updateToast = toast.loading("Updating data from GitHub...");
        const result = await invoke<DataUpdateResult>(
          "update_champion_data_from_github"
        );

        toast.dismiss(updateToast);

        if (result.success) {
          toast.success(
            `Update completed successfully! ${
              result.updatedChampions?.length ?? 0
            } champions updated.`
          );
          setUpdateResult(result);
        } else {
          toast.error(`Update failed: ${result.error ?? "Unknown error"}`);
        }
      } catch (error) {
        console.error("Failed to update data:", error);
        toast.error(`Failed to update data: ${error}`);
      } finally {
        setUpdatingData(false);
      }
    });
  };

  const getStatusMessage = () => {
    if (updatingData && ghProgress) {
      if (ghProgress.status === "error") return `Error: ${ghProgress.error || "Unknown error"}`;
      if (ghProgress.status === "completed") return "GitHub update completed!";
      if (ghProgress.status === "starting") return "Starting GitHub update...";
      if (ghProgress.status === "manifest_downloaded") return "Manifest downloaded, preparing files...";
      if (ghProgress.status === "downloading_champion_files") {
        return ghProgress.current_champion_name
          ? `Downloading: ${ghProgress.current_champion_name}`
          : "Downloading champion files...";
      }
      return `GitHub Update: ${ghProgress.status}`;
    }
    if (checkingForUpdates) return "Checking for updates...";
    if (isUpdating && !updatingData) return "Downloading CommunityDragon data..."; // Original isUpdating prop
    if (!progress && !updatingData) return "Initializing..."; // Default if no specific states match

    // Fallback to original progress prop if not in gh update mode
    if (progress && !updatingData) {
      switch (progress.status) {
        case "checking": return "Checking for updates...";
        case "downloading": return "Downloading updates...";
        case "processing": return `Processing ${progress.currentChampion}...`;
        default: return "Processing updates...";
      }
    }
    return "Loading..."; // Generic fallback
  };

  // Determine progress values based on current update type
  const currentProgressPercent = updatingData && ghProgress
    ? ghProgress.overall_progress_percent || 0
    : progress?.progress || 0;

  const currentChampionName = updatingData && ghProgress
    ? ghProgress.current_champion_name
    : progress?.currentChampion;

  const processedCount = updatingData && ghProgress
    ? ghProgress.processed_champions
    : progress?.processedChampions;

  const totalCount = updatingData && ghProgress
    ? ghProgress.total_champions
    : progress?.totalChampions;

  const displayStatusMessage = getStatusMessage();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col space-y-4">
          <DialogHeader>
            <DialogTitle>Data Updates</DialogTitle>
            <p className="text-sm text-muted-foreground animate-in fade-in-50 duration-300">
              {displayStatusMessage}
            </p>
          </DialogHeader>

          {/* Update Source Indicator */}
          { (updatingData || isUpdating) && (
            <p className="text-xs text-muted-foreground/80 text-center mb-2 animate-in fade-in-20 duration-300">
              {updatingData
                ? "Update source: GitHub Repository"
                : (isUpdating ? "Update source: CommunityDragon API" : "")}
            </p>
          )}

          {/* Combined Progress Display */}
          {(isUpdating || updatingData) && (!updateResult || updatingData) && (ghProgress || progress) && (
            <div className="space-y-2 animate-in fade-in-50 duration-300">
              <Progress
                value={currentProgressPercent}
                className={`transition-all duration-300 ${
                  isPending ? "opacity-50" : "opacity-100"
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(currentProgressPercent)}%</span>
                {(processedCount !== undefined && totalCount !== undefined) && (
                  <span>
                    {processedCount} of {totalCount}
                    {updatingData && ghProgress && ghProgress.status === 'downloading_champion_files' ? ' files' : ' champions'}
                  </span>
                )}
              </div>
              {currentChampionName && (
                <p className="text-xs text-muted-foreground text-right animate-in slide-in-from-right-5">
                  {`Processing: ${currentChampionName}`}
                </p>
              )}
              {updatingData && ghProgress && ghProgress.status === "error" && ghProgress.error && (
                <p className="text-xs text-red-500 dark:text-red-400 text-left animate-in fade-in-20">
                  Error: {ghProgress.error}
                </p>
              )}
               {updatingData && ghProgress && ghProgress.status === "completed" && (
                <p className="text-xs text-green-600 dark:text-green-500 text-left animate-in fade-in-20">
                  Update process completed successfully.
                </p>
              )}
            </div>
          )}

          {/* GitHub update availability UI (shown if not actively updating GH data, or if GH data is done/error) */}
          {updateResult && (!updatingData || (ghProgress && (ghProgress.status === 'completed' || ghProgress.status === 'error'))) && (
            <div className="space-y-3 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Current Version:</span>
                <span className="font-mono">
                  {updateResult.current_version ?? "Not installed"}
                </span>

                <span className="text-muted-foreground">Latest Version:</span>
                <span className="font-mono">
                  {updateResult.available_version ?? "Unknown"}
                </span>
              </div>

              {updateResult.has_update ? (
                <div className="rounded-md bg-muted/50 p-3 border border-border">
                  <p className="text-sm font-medium mb-1">Update Available</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {updateResult.update_message ??
                      "New data updates are available for download."}
                  </p>
                  {/* New Changelog Display Section */}
                  {updateResult.changelog && (
                    <div className="mt-2 mb-3 p-2 border rounded-md max-h-32 overflow-y-auto bg-muted/20">
                      <h4 className="text-xs font-semibold mb-1 text-foreground/80">Changelog:</h4>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {updateResult.changelog}
                      </pre>
                    </div>
                  )}
                  {/* End of New Changelog Display Section */}
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={updatingData}
                    onClick={pullUpdates}
                  >
                    {updatingData ? "Updating..." : "Update Now"}
                  </Button>
                </div>
              ) : (
                <div className="rounded-md bg-muted/50 p-3 border border-border">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Data is up to date
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You have the latest champion data installed.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading state (Spinner for initial check or if no progress info yet) */}
          {(checkingForUpdates || (updatingData && !ghProgress)) && !updateResult && (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  {checkingForUpdates ? "Checking for updates..." : "Initializing GitHub update..."}
                </p>
              </div>
            )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={checkForUpdates}
            disabled={checkingForUpdates || updatingData}
          >
            Check for Updates
          </Button>
          <Button size="sm" onClick={onClose} disabled={updatingData}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
