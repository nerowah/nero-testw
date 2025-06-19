"use client";

import React from "react";
import { Loader2, Sparkles, Shield, Crown, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface EnhancedLoadingProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "champion" | "skin" | "update";
}

const loadingVariants = {
  default: {
    icon: Loader2,
    title: "Loading...",
    subtitle: "Please wait while we prepare your experience",
    color: "from-blue-500 to-purple-500",
    accentColor: "text-blue-500"
  },
  champion: {
    icon: Crown,
    title: "Loading Champions",
    subtitle: "Preparing your champion collection...",
    color: "from-yellow-500 to-orange-500",
    accentColor: "text-yellow-500"
  },
  skin: {
    icon: Sparkles,
    title: "Loading Skins",
    subtitle: "Fetching beautiful skin collections...",
    color: "from-purple-500 to-pink-500",
    accentColor: "text-purple-500"
  },
  update: {
    icon: Trophy,
    title: "Updating Data",
    subtitle: "Getting the latest champion information...",
    color: "from-green-500 to-emerald-500",
    accentColor: "text-green-500"
  }
};

export function EnhancedLoading({ 
  title, 
  subtitle, 
  variant = "default" 
}: EnhancedLoadingProps) {
  const config = loadingVariants[variant];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center justify-center h-full w-full min-h-[400px] flex-col gap-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 bg-gradient-to-br ${config.color} opacity-10 rounded-full blur-xl`}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${15 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced loading spinner */}
        <motion.div className="relative">
          {/* Outer glow ring */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} blur-2xl`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          
          {/* Rotating border ring */}
          <motion.div
            className={`relative w-24 h-24 rounded-full bg-gradient-to-r ${config.color} p-1 shadow-2xl`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
              {/* Inner icon */}
              <motion.div
                animate={variant === "default" ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
                transition={
                  variant === "default"
                    ? { duration: 1, repeat: Infinity, ease: "linear" }
                    : { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
                }
              >
                <IconComponent className={`h-8 w-8 ${config.accentColor}`} />
              </motion.div>
              
              {/* Sparkle effects for certain variants */}
              {(variant === "champion" || variant === "skin") && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Loading text with typewriter effect */}
        <motion.div 
          className="text-center space-y-4 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            {title || config.title}
          </motion.h2>
          
          {/* Progress indicator dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          
          <motion.p 
            className="text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {subtitle || config.subtitle}
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="w-80 max-w-sm h-2 bg-muted/30 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
            animate={{
              x: [-100, 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${config.accentColor.replace('text-', 'bg-')} rounded-full opacity-60`}
            animate={{
              y: [0, -100, 0],
              x: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized loading components for different contexts
export const ChampionLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="champion" />
);

export const SkinLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="skin" />
);

export const UpdateLoading = (props: Omit<EnhancedLoadingProps, 'variant'>) => (
  <EnhancedLoading {...props} variant="update" />
);
