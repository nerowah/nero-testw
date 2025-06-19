"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Download, 
  Database, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Crown,
  Gamepad2,
  Palette,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/store";
import { invoke } from "@tauri-apps/api/core";

interface LoadingPhase {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  duration: number;
  color: string;
}

const LOADING_PHASES: LoadingPhase[] = [
  {
    id: "initialization",
    label: "Initializing Application",
    description: "Setting up core components...",
    icon: Shield,
    duration: 1000,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "league-detection",
    label: "Detecting League Installation",
    description: "Scanning for League of Legends...",
    icon: Gamepad2,
    duration: 1500,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "data-loading",
    label: "Loading Champion Data",
    description: "Fetching latest champion information...",
    icon: Database,
    duration: 2000,
    color: "from-purple-500 to-violet-500"
  },
  {
    id: "skin-indexing",
    label: "Indexing Skins",
    description: "Organizing skin collections...",
    icon: Palette,
    duration: 1200,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "optimization",
    label: "Optimizing Performance",
    description: "Preparing user interface...",
    icon: Zap,
    duration: 800,
    color: "from-yellow-500 to-orange-500"
  }
];

interface AppInitializerProps {
  onComplete: () => void;
  onError: (error: string) => void;
}

export function AppInitializer({ onComplete, onError }: AppInitializerProps) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phaseProgress, setPhaseProgress] = useState(0);

  const { leaguePath } = useGameStore();

  const currentPhase = LOADING_PHASES[currentPhaseIndex];
  const totalPhases = LOADING_PHASES.length;

  // Simulate initialization phases
  const runInitialization = useCallback(async () => {
    try {
      for (let i = 0; i < LOADING_PHASES.length; i++) {
        const phase = LOADING_PHASES[i];
        setCurrentPhaseIndex(i);
        setPhaseProgress(0);

        // Simulate phase progress
        const phaseStartTime = Date.now();
        const interval = setInterval(() => {
          const elapsed = Date.now() - phaseStartTime;
          const phaseProgressPercent = Math.min((elapsed / phase.duration) * 100, 100);
          setPhaseProgress(phaseProgressPercent);
          
          const overallProgress = (i / totalPhases) * 100 + (phaseProgressPercent / totalPhases);
          setProgress(overallProgress);
        }, 50);

        // Execute actual initialization logic based on phase
        switch (phase.id) {
          case "initialization":
            // Basic app initialization
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            break;
          
          case "league-detection":
            // Check for League installation
            try {
              if (!leaguePath) {
                // Try to detect League path
                await invoke("detect_league_installation");
              }
            } catch (error) {
              console.warn("League detection failed:", error);
            }
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            break;
          
          case "data-loading":
            // Load champion data
            try {
              await invoke("initialize_champion_data");
            } catch (error) {
              console.warn("Champion data loading failed:", error);
            }
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            break;
          
          case "skin-indexing":
            // Index skins
            try {
              await invoke("index_skin_data");
            } catch (error) {
              console.warn("Skin indexing failed:", error);
            }
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            break;
          
          case "optimization":
            // Final optimizations
            await new Promise(resolve => setTimeout(resolve, phase.duration));
            break;
        }

        clearInterval(interval);
        setPhaseProgress(100);
      }

      setProgress(100);
      setIsCompleted(true);
      
      // Wait a moment to show completion
      setTimeout(() => {
        onComplete();
      }, 1000);

    } catch (error) {
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      onError(errorMessage);
    }
  }, [leaguePath, onComplete, onError, errorMessage]);

  useEffect(() => {
    runInitialization();
  }, [runInitialization]);

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage("");
    setCurrentPhaseIndex(0);
    setProgress(0);
    setPhaseProgress(0);
    setIsCompleted(false);
    runInitialization();
  };

  if (hasError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Initialization Failed
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {errorMessage || "An unexpected error occurred during startup"}
            </p>
          </div>
          
          <Button onClick={handleRetry} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"
          animate={{
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto p-8">
        {/* App Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl">
            <Crown className="h-12 w-12 text-white" />
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* App Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            FeitanxMoussaid
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            League Skin Manager
          </p>
        </motion.div>

        {/* Current Phase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Phase Icon */}
            <div className="flex items-center justify-center">
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentPhase.color} flex items-center justify-center shadow-lg`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <currentPhase.icon className="h-8 w-8 text-white" />
              </motion.div>
            </div>

            {/* Phase Info */}
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {currentPhase.label}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {currentPhase.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Progress 
              value={progress} 
              className="h-3 bg-slate-200 dark:bg-slate-700"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Phase {currentPhaseIndex + 1} of {totalPhases}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Phase Indicators */}
        <div className="flex justify-center gap-2">
          {LOADING_PHASES.map((phase, index) => (
            <motion.div
              key={phase.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index < currentPhaseIndex 
                  ? 'bg-green-500' 
                  : index === currentPhaseIndex 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-slate-300 dark:bg-slate-600'
              }`}
              animate={index === currentPhaseIndex ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Completion State */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium">Initialization Complete!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
