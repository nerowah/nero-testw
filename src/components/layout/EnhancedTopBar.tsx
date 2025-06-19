"use client";

import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Menu, 
  Search, 
  Crown, 
  Sparkles, 
  Bell,
  Settings,
  Download,
  Shield,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { InjectionStatusDot } from "@/components/InjectionStatusDot";
import { TitleBar } from "@/components/ui/titlebar/TitleBar";
import { ChampionSearch } from "@/components/ChampionSearch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { TerminalLogsDialog } from "@/components/TerminalLogsDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { PartyModeDialog } from "@/components/PartyModeDialog";
import { useGameStore, SkinTab } from "@/lib/store";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Champion } from "@/lib/types";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  champions: Champion[];
  selectedChampionId: number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChampionSelect: (id: number) => void;
  onUpdateData: () => void;
  isUpdating?: boolean;
}

export const EnhancedTopBar = React.memo(function EnhancedTopBar({
  champions,
  selectedChampionId,
  searchQuery,
  onSearchChange,
  onChampionSelect,
  onUpdateData,
  isUpdating = false,
}: TopBarProps) {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load saved tab preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("activeSkinsTab") as SkinTab | null;
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, [setActiveTab]);

  // Simulate notification check
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        // Check for updates or other notifications
        const result = await invoke("check_notifications");
        setHasNotifications(!!result);
      } catch (error) {
        // Silent fail
      }
    };
    checkNotifications();
  }, []);

  // Force update by deleting cache and updating
  async function handleForceUpdateData() {
    try {
      toast.promise(
        async () => {
          await invoke("delete_champions_cache");
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

  const selectedChampion = champions.find(c => c.id === selectedChampionId);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      data-tauri-drag-region
      onMouseDown={(e) => {
        if (
          (e.target as HTMLElement).closest("[data-tauri-drag-region]") &&
          !(e.target as HTMLElement).closest(
            "button, input, [role='button'], [role='combobox']"
          )
        ) {
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
      className="relative flex flex-col w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
    >
      {/* Animated gradient accent */}
      <motion.div 
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between gap-6 p-4 w-full">
        {/* Left Section - Brand & Search */}
        <div className="flex items-center gap-6 w-1/3 xl:w-1/4">
          {/* Enhanced Brand Logo */}
          <motion.div 
            className="flex items-center gap-3 shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <motion.div 
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
                animate={{ 
                  boxShadow: [
                    "0 10px 25px rgba(59, 130, 246, 0.25)",
                    "0 10px 25px rgba(147, 51, 234, 0.25)",
                    "0 10px 25px rgba(59, 130, 246, 0.25)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="h-6 w-6 text-white" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </div>
            
            <div className="hidden md:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FeitanxMoussaid
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
                Skin Manager
              </p>
            </div>
          </motion.div>

          {/* Enhanced Search Area */}
          <div className="relative flex-1 min-w-0">
            <motion.div 
              className="relative"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <ChampionSearch
                champions={champions}
                onSelect={onChampionSelect}
                selectedChampionId={selectedChampionId}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
              />
              
              {/* Search suggestions count */}
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {champions.filter(c => 
                        c.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ).length}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Center Section - Enhanced Navigation Tabs */}
        <div className="flex items-center justify-center flex-1">
          <motion.div 
            className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-1.5 border border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as SkinTab);
              }}
              className="w-full"
            >
              <TabsList className="bg-transparent border-0 gap-2 h-auto p-0">
                <TabsTrigger 
                  value="official" 
                  className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 data-[state=inactive]:hover:bg-slate-100/50 dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-200 dark:data-[state=inactive]:hover:bg-slate-700/50"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Official Skins
                  {activeTab === "official" && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="custom" 
                  className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-800 data-[state=inactive]:hover:bg-slate-100/50 dark:data-[state=inactive]:text-slate-400 dark:data-[state=inactive]:hover:text-slate-200 dark:data-[state=inactive]:hover:bg-slate-700/50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Custom Skins
                  {activeTab === "custom" && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 -z-10"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>

        {/* Right Section - Enhanced Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Champion Info Badge */}
          <AnimatePresence>
            {selectedChampion && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Crown className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate max-w-24">
                  {selectedChampion.name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Status Indicator */}
          <motion.div 
            className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <InjectionStatusDot />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 hidden lg:block">
              Status
            </span>
          </motion.div>

          {/* Notifications */}
          <motion.div className="relative">
            <Button 
              variant="outline" 
              size="icon" 
              aria-label="Notifications"
              className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-sm h-10 w-10"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <AnimatePresence>
              {hasNotifications && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Menu Button */}
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  aria-label="Menu"
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-700/80 shadow-sm h-10 w-10"
                >
                  <motion.div
                    animate={{ rotate: isMenuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="min-w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-2xl p-2" 
              align="end"
              sideOffset={8}
            >
              <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-700/50 mb-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Actions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Manage your League experience</p>
              </div>
              
              <PartyModeDialog />
              
              <DropdownMenuItem
                onClick={onUpdateData}
                disabled={isUpdating}
                className="flex items-center gap-3 px-3 py-3 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-colors rounded-xl mx-1"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <motion.div
                    animate={isUpdating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isUpdating ? Infinity : 0, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Check for Updates</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update champion data</p>
                </div>
                {isUpdating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200" />
                  </motion.div>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => void handleForceUpdateData()}
                disabled={activeTab === "custom"}
                className="flex items-center gap-3 px-3 py-3 hover:bg-orange-50/80 dark:hover:bg-orange-900/20 transition-colors rounded-xl mx-1"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Force Update Data</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clear cache & update</p>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2 bg-slate-200/50 dark:bg-slate-700/50" />
              
              <TerminalLogsDialog />
              <SettingsDialog />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TitleBar />
        </div>
      </div>
    </motion.div>
  );
});
