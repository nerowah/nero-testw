import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CustomSkin } from "./types";

interface SelectedSkin {
  championId: number;
  skinId: number;
  chromaId?: number;
  fantome?: string;
  timestamp?: number; // For tracking usage
}

// Define the possible injection statuses
export type InjectionStatus = "idle" | "injecting" | "success" | "error" | "cancelled";

// Custom skin tabs
export type SkinTab = "official" | "custom";

// Enhanced party member interface
export interface PartyMember {
  id: string;
  name: string;
  availability: "online" | "away" | "offline" | "in-game";
  skins: Map<number, SelectedSkin>; // Map of champion ID to selected skin
  lastSeen: number; // Timestamp
  version?: string; // App version for compatibility
}

// Settings interface for better organization
interface AppSettings {
  autoUpdateData: boolean;
  enablePartyMode: boolean;
  enableNotifications: boolean;
  theme: "light" | "dark" | "system";
  language: string;
  maxCacheSize: number;
  debugMode: boolean;
}

// Performance metrics for monitoring
interface PerformanceMetrics {
  lastUpdateCheck: number;
  averageUpdateTime: number;
  updateCount: number;
  errorCount: number;
}

interface GameState {
  // Core game state
  leaguePath: string | null;
  lcuStatus: string | null;
  injectionStatus: InjectionStatus;
  
  // Skin selection state
  selectedSkins: Map<number, SelectedSkin>;
  favorites: Set<number>;
  recentChampions: number[]; // Recently selected champions
  
  // UI state
  hasCompletedOnboarding: boolean;
  activeTab: SkinTab;
  
  // Custom skins
  customSkins: Map<number, CustomSkin[]>;
  
  // Data management
  hasNewDataUpdate: boolean;
  lastDataUpdate: number;
  
  // Party mode state
  partyMembers: PartyMember[];
  pendingSyncRequest: {
    memberId: string;
    memberName: string;
    data: string;
    timestamp: number;
  } | null;
  
  // App settings
  settings: AppSettings;
  
  // Performance metrics
  metrics: PerformanceMetrics;
  
  // Actions with improved typing and performance
  setLeaguePath: (path: string) => void;
  setLcuStatus: (status: string) => void;
  setInjectionStatus: (status: InjectionStatus) => void;
  
  // Skin management
  selectSkin: (
    championId: number,
    skinId: number,
    chromaId?: number,
    fantome?: string
  ) => void;
  clearSelection: (championId: number) => void;
  clearAllSelections: () => void;
  getSelectedSkin: (championId: number) => SelectedSkin | undefined;
  
  // Favorites management
  toggleFavorite: (championId: number) => void;
  setFavorites: (favorites: Set<number>) => void;
  addToRecent: (championId: number) => void;
  
  // UI state management
  setHasCompletedOnboarding: (completed: boolean) => void;
  setActiveTab: (tab: SkinTab) => void;
  
  // Custom skins management
  addCustomSkin: (skin: CustomSkin) => void;
  removeCustomSkin: (skinId: string) => void;
  setCustomSkins: (skins: CustomSkin[]) => void;
  getCustomSkins: (championId: number) => CustomSkin[];
  
  // Data update management
  setHasNewDataUpdate: (hasUpdate: boolean) => void;
  updateLastDataUpdate: () => void;
  
  // Party mode management
  addPartyMember: (member: PartyMember) => void;
  removePartyMember: (memberId: string) => void;
  updatePartyMemberSkins: (
    memberId: string,
    skins: Map<number, SelectedSkin>
  ) => void;
  updatePartyMemberStatus: (memberId: string, availability: PartyMember["availability"]) => void;
  clearParty: () => void;
  setPendingSyncRequest: (
    request: { memberId: string; memberName: string; data: string } | null
  ) => void;
  
  // Settings management
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // Performance tracking
  updateMetrics: (updates: Partial<PerformanceMetrics>) => void;
  
  // Bulk operations for better performance
  bulkUpdateSkins: (updates: Array<{ championId: number; skin: SelectedSkin }>) => void;
  bulkToggleFavorites: (championIds: number[]) => void;
  
  // Data cleanup
  cleanupOldData: () => void;
}

// Default settings
const defaultSettings: AppSettings = {
  autoUpdateData: true,
  enablePartyMode: false,
  enableNotifications: true,
  theme: "system",
  language: "en",
  maxCacheSize: 100,
  debugMode: false,
};

// Default metrics
const defaultMetrics: PerformanceMetrics = {
  lastUpdateCheck: 0,
  averageUpdateTime: 0,
  updateCount: 0,
  errorCount: 0,
};

// Storage wrapper for better Map/Set handling
const storage = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    if (!item) return null;
    
    try {
      const parsed = JSON.parse(item);
      // Convert serialized Maps and Sets back to their proper types
      if (parsed.state) {
        if (parsed.state.selectedSkins) {
          parsed.state.selectedSkins = new Map(parsed.state.selectedSkins);
        }
        if (parsed.state.favorites) {
          parsed.state.favorites = new Set(parsed.state.favorites);
        }
        if (parsed.state.customSkins) {
          parsed.state.customSkins = new Map(parsed.state.customSkins);
        }
        if (parsed.state.partyMembers) {
          parsed.state.partyMembers = parsed.state.partyMembers.map((member: any) => ({
            ...member,
            skins: new Map(member.skins || [])
          }));
        }
      }
      return parsed;
    } catch {
      return null;
    }
  },
  
  setItem: (name: string, value: any) => {
    try {
      // Convert Maps and Sets to arrays for serialization
      const serializable = {
        ...value,
        state: {
          ...value.state,
          selectedSkins: value.state.selectedSkins ? Array.from(value.state.selectedSkins.entries()) : [],
          favorites: value.state.favorites ? Array.from(value.state.favorites) : [],
          customSkins: value.state.customSkins ? Array.from(value.state.customSkins.entries()) : [],
          partyMembers: value.state.partyMembers ? value.state.partyMembers.map((member: PartyMember) => ({
            ...member,
            skins: Array.from(member.skins.entries())
          })) : []
        }
      };
      localStorage.setItem(name, JSON.stringify(serializable));
    } catch (error) {
      console.warn("Failed to persist store state:", error);
    }
  },
  
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      leaguePath: null,
      lcuStatus: null,
      injectionStatus: "idle",
      selectedSkins: new Map(),
      favorites: new Set(),
      recentChampions: [],
      hasCompletedOnboarding: false,
      activeTab: "official",
      customSkins: new Map(),
      hasNewDataUpdate: false,
      lastDataUpdate: 0,
      partyMembers: [],
      pendingSyncRequest: null,
      settings: defaultSettings,
      metrics: defaultMetrics,

      // Basic setters
      setLeaguePath: (path) => set({ leaguePath: path }),
      setLcuStatus: (status) => set({ lcuStatus: status }),
      setInjectionStatus: (status) => set({ injectionStatus: status }),

      // Enhanced skin management
      selectSkin: (championId, skinId, chromaId, fantome) => {
        set((state) => {
          const newSelectedSkins = new Map(state.selectedSkins);
          newSelectedSkins.set(championId, {
            championId,
            skinId,
            chromaId,
            fantome,
            timestamp: Date.now(),
          });
          
          // Update recent champions
          const newRecent = [championId, ...state.recentChampions.filter(id => id !== championId)].slice(0, 10);
          
          return { 
            selectedSkins: newSelectedSkins,
            recentChampions: newRecent,
          };
        });
      },

      clearSelection: (championId) => {
        set((state) => {
          const newSelectedSkins = new Map(state.selectedSkins);
          newSelectedSkins.delete(championId);
          return { selectedSkins: newSelectedSkins };
        });
      },

      clearAllSelections: () => set({ selectedSkins: new Map() }),

      getSelectedSkin: (championId) => {
        const state = get();
        return state.selectedSkins.get(championId);
      },

      // Enhanced favorites management
      toggleFavorite: (championId) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          if (newFavorites.has(championId)) {
            newFavorites.delete(championId);
          } else {
            newFavorites.add(championId);
          }
          return { favorites: newFavorites };
        });
      },

      setFavorites: (favorites) => set({ favorites }),

      addToRecent: (championId) => {
        set((state) => {
          const newRecent = [championId, ...state.recentChampions.filter(id => id !== championId)].slice(0, 10);
          return { recentChampions: newRecent };
        });
      },

      // UI state
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Enhanced custom skins management
      addCustomSkin: (skin) => {
        set((state) => {
          const newCustomSkins = new Map(state.customSkins);
          const championId = skin.champion_id;
          const existingSkins = newCustomSkins.get(championId) ?? [];
          newCustomSkins.set(championId, [...existingSkins, skin]);
          return { customSkins: newCustomSkins };
        });
      },

      removeCustomSkin: (skinId) => {
        set((state) => {
          const newCustomSkins = new Map(state.customSkins);

          for (const [championId, skins] of newCustomSkins.entries()) {
            const updatedSkins = skins.filter((skin) => skin.id !== skinId);

            if (updatedSkins.length !== skins.length) {
              if (updatedSkins.length === 0) {
                newCustomSkins.delete(championId);
              } else {
                newCustomSkins.set(championId, updatedSkins);
              }
              break;
            }
          }

          return { customSkins: newCustomSkins };
        });
      },

      setCustomSkins: (skins) => {
        set(() => {
          const customSkinsMap = new Map<number, CustomSkin[]>();

          skins.forEach((skin) => {
            const championId = skin.champion_id;
            const existingSkins = customSkinsMap.get(championId) ?? [];
            customSkinsMap.set(championId, [...existingSkins, skin]);
          });

          return { customSkins: customSkinsMap };
        });
      },

      getCustomSkins: (championId) => {
        const state = get();
        return state.customSkins.get(championId) ?? [];
      },

      // Data update management
      setHasNewDataUpdate: (hasUpdate) => set({ hasNewDataUpdate: hasUpdate }),
      updateLastDataUpdate: () => set({ lastDataUpdate: Date.now() }),

      // Enhanced party mode
      addPartyMember: (member) => {
        set((state) => {
          if (state.partyMembers.some((m) => m.id === member.id)) {
            return state;
          }
          if (state.partyMembers.length >= 4) {
            return state;
          }
          return { 
            partyMembers: [...state.partyMembers, { 
              ...member, 
              lastSeen: Date.now() 
            }] 
          };
        });
      },

      removePartyMember: (memberId) => {
        set((state) => ({
          partyMembers: state.partyMembers.filter((m) => m.id !== memberId),
        }));
      },

      updatePartyMemberSkins: (memberId, skins) => {
        set((state) => ({
          partyMembers: state.partyMembers.map((member) =>
            member.id === memberId 
              ? { ...member, skins, lastSeen: Date.now() } 
              : member
          ),
        }));
      },

      updatePartyMemberStatus: (memberId, availability) => {
        set((state) => ({
          partyMembers: state.partyMembers.map((member) =>
            member.id === memberId 
              ? { ...member, availability, lastSeen: Date.now() } 
              : member
          ),
        }));
      },

      clearParty: () => set({ partyMembers: [] }),

      setPendingSyncRequest: (request) => {
        set({ 
          pendingSyncRequest: request ? { 
            ...request, 
            timestamp: Date.now() 
          } : null 
        });
      },

      // Settings management
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      resetSettings: () => set({ settings: defaultSettings }),

      // Performance tracking
      updateMetrics: (updates) => {
        set((state) => ({
          metrics: { ...state.metrics, ...updates }
        }));
      },

      // Bulk operations
      bulkUpdateSkins: (updates) => {
        set((state) => {
          const newSelectedSkins = new Map(state.selectedSkins);
          updates.forEach(({ championId, skin }) => {
            newSelectedSkins.set(championId, skin);
          });
          return { selectedSkins: newSelectedSkins };
        });
      },

      bulkToggleFavorites: (championIds) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          championIds.forEach(id => {
            if (newFavorites.has(id)) {
              newFavorites.delete(id);
            } else {
              newFavorites.add(id);
            }
          });
          return { favorites: newFavorites };
        });
      },

      // Data cleanup
      cleanupOldData: () => {
        set((state) => {
          const now = Date.now();
          const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
          
          // Clean up old party member data
          const activePartyMembers = state.partyMembers.filter(
            member => member.lastSeen > oneMonthAgo
          );
          
          // Clean up old recent champions
          const recentChampions = state.recentChampions.slice(0, 10);
          
          return {
            partyMembers: activePartyMembers,
            recentChampions,
          };
        });
      },
    }),
    {
      name: "game-store",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        // Only persist certain parts of the state
        leaguePath: state.leaguePath,
        favorites: state.favorites,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        activeTab: state.activeTab,
        recentChampions: state.recentChampions,
        settings: state.settings,
        lastDataUpdate: state.lastDataUpdate,
        metrics: state.metrics,
      }),
    }
  )
);

// Terminal log store with improvements
export interface TerminalLog {
  id: string;
  message: string;
  log_type: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
}

interface TerminalLogState {
  logs: TerminalLog[];
  maxLogs: number;
  addLog: (log: Omit<TerminalLog, "id">) => void;
  addBulkLogs: (logs: Array<Omit<TerminalLog, "id">>) => void;
  clearLogs: () => void;
  getLogsByLevel: (level: TerminalLog["level"]) => TerminalLog[];
  getRecentLogs: (count?: number) => TerminalLog[];
}

export const useTerminalLogStore = create<TerminalLogState>((set, get) => ({
  logs: [],
  maxLogs: 1000,

  addLog: (log) => {
    set((state) => {
      const newLog: TerminalLog = {
        ...log,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      
      const newLogs = [...state.logs, newLog];
      
      // Keep only the most recent logs
      if (newLogs.length > state.maxLogs) {
        newLogs.splice(0, newLogs.length - state.maxLogs);
      }
      
      return { logs: newLogs };
    });
  },

  addBulkLogs: (logs) => {
    set((state) => {
      const newLogs = logs.map(log => ({
        ...log,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));
      
      const allLogs = [...state.logs, ...newLogs];
      
      // Keep only the most recent logs
      if (allLogs.length > state.maxLogs) {
        allLogs.splice(0, allLogs.length - state.maxLogs);
      }
      
      return { logs: allLogs };
    });
  },

  clearLogs: () => set({ logs: [] }),

  getLogsByLevel: (level) => {
    const state = get();
    return state.logs.filter(log => log.level === level);
  },

  getRecentLogs: (count = 50) => {
    const state = get();
    return state.logs.slice(-count);
  },
}));

// Selector hooks for better performance
export const useSelectedSkin = (championId: number) => 
  useGameStore(state => state.selectedSkins.get(championId));

export const useIsFavorite = (championId: number) => 
  useGameStore(state => state.favorites.has(championId));

export const useCustomSkinsForChampion = (championId: number) => 
  useGameStore(state => state.customSkins.get(championId) ?? []);

export const useAppSettings = () => 
  useGameStore(state => state.settings);

export const usePerformanceMetrics = () => 
  useGameStore(state => state.metrics);
