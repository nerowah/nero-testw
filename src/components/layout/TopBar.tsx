"use client";

import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { RefreshCw, Menu, Search, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { InjectionStatusDot } from "@/components/InjectionStatusDot";
import { TitleBar } from "@/components/ui/titlebar/TitleBar";
import { ChampionSearch } from "@/components/ChampionSearch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TerminalLogsDialog } from "@/components/TerminalLogsDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { PartyModeDialog } from "@/components/PartyModeDialog";
import { useGameStore, SkinTab } from "@/lib/store";
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Champion } from "@/lib/types";
import React from "react";

interface TopBarProps {
  champions: Champion[];
  selectedChampionId: number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUpdateData: () => void;
  isUpdating?: boolean;
}

export const TopBar = React.memo(function TopBar({
  champions,
  selectedChampionId,
  searchQuery,
  onSearchChange,
  onUpdateData,
  isUpdating = false,
}: TopBarProps) {
  // Only subscribe to the specific state needed
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);

  // Load saved tab preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeSkinsTab") as SkinTab | null;
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [setActiveTab]);

  // Force update by deleting cache and updating
  async function handleForceUpdateData() {
    try {
      toast.promise(
        async () => {
          // Delete champion cache first
          await invoke("delete_champions_cache");
          // Then run update
          onUpdateData();
        },
        {
          loading: "Clearing cached data...",
          success: "Cache cleared successfully, updating champion data",
          error: "Failed to clear champion cache",
        }
      );
    } catch (error) {
      console.error("Error during force update:", error);
    }
  }

  return (
    <div
      data-tauri-drag-region
      onMouseDown={(e) => {
        if (
          (e.target as HTMLElement).closest("[data-tauri-drag-region]") &&
          !(e.target as HTMLElement).closest(
            "button, input, [role='button'], [role='combobox']"
          )
        ) {
          // Use the WebviewWindow API for window dragging
          import("@tauri-apps/api/webviewWindow")
            .then(({ getCurrentWebviewWindow }) => {
              const appWindow = getCurrentWebviewWindow();
              appWindow.startDragging().catch((error: unknown) => {
                console.error("Failed to start dragging:", error);
              });
            })
            .catch((error: unknown) => {
              console.error(error);
            });
        }
      }}
      className="flex flex-col w-full mx-auto bg-gradient-to-r from-white/80 via-slate-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
    >
      {/* Decorative gradient line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-60"></div>
      
      <div className="flex items-center justify-between gap-6 p-4 w-full mx-auto">
        {/* Left Section - Brand & Search */}
        <div className="flex items-center gap-4 w-1/3 xl:w-1/4">
          {/* Brand Logo/Icon */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Crown className="h-5 w-5 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FeitanxMoussaid
              </h1>
            </div>
          </div>

          {/* Enhanced Search Area */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <ChampionSearch
              champions={champions}
              onSelect={() => {}} // Empty function since we handle selection in main page
              selectedChampionId={selectedChampionId}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
        </div>

        {/* Center Section - Navigation Tabs */}
        <div className="flex items-center justify-center flex-1">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as SkinTab);
              }}
              className="w-full"
            >
              <TabsList className="bg-transparent border-0 gap-1 h-auto p-0">
                <TabsTrigger 
                  value="official" 
                  className="relative px-6 py-2.5 rounded-full font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-200"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Official Skins
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="relative px-6 py-2.5 rounded-full font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Custom Skins
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Right Section - Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <InjectionStatusDot />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden lg:block">
              Status
            </span>
          </div>

          {/* Menu Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                aria-label="Menu"
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-sm h-10 w-10"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="min-w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-xl" 
              align="end"
            >
              <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Actions</p>
              </div>
              
              <PartyModeDialog />
              
              <DropdownMenuItem
                onClick={() => {
                  onUpdateData();
                }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Check for Updates</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update champion data</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => {
                  void handleForceUpdateData();
                }}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 transition-colors"
                disabled={activeTab === "custom"}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Force Update Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clear cache & update</p>
                </div>
              </DropdownMenuItem>
              
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
                <TerminalLogsDialog />
                <SettingsDialog />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TitleBar />
        </div>
      </div>
    </div>
  );
});