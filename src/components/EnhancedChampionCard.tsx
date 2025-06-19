"use client";

import React, { useState, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Crown, Sparkles, Star, Shield } from "lucide-react";
import { Champion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  useIntersectionObserver, 
  optimizeImageUrl, 
  usePerformanceMonitor,
  ResourcePreloader 
} from "@/lib/utils/performance-utils";

interface EnhancedChampionCardProps {
  champion: Champion;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (championId: number) => void;
  onToggleFavorite: (championId: number) => void;
  priority?: 'high' | 'normal' | 'low';
  showBadges?: boolean;
  compact?: boolean;
}

const ChampionCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

const FavoriteButtonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
  favorited: {
    scale: [1, 1.3, 1],
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const EnhancedChampionCard = memo(function EnhancedChampionCard({
  champion,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onToggleFavorite,
  priority = 'normal',
  showBadges = true,
  compact = false
}: EnhancedChampionCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Performance monitoring in development
  usePerformanceMonitor(`ChampionCard-${champion.name}`);
  
  // Intersection observer for lazy loading
  const isVisible = useIntersectionObserver(cardRef, {
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Optimized image URL
  const optimizedImageUrl = optimizeImageUrl(champion.squarePortraitPath, {
    width: compact ? 120 : 160,
    height: compact ? 120 : 160,
    quality: 85,
    format: 'webp'
  });

  // Preload image when visible
  React.useEffect(() => {
    if (isVisible && !imageLoaded && !imageError) {
      const preloader = ResourcePreloader.getInstance();
      preloader.preloadImage(optimizedImageUrl)
        .then(() => setImageLoaded(true))
        .catch(() => setImageError(true));
    }
  }, [isVisible, optimizedImageUrl, imageLoaded, imageError]);

  // Memoized handlers
  const handleSelect = useCallback(() => {
    onSelect(champion.id);
  }, [champion.id, onSelect]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(champion.id);
  }, [champion.id, onToggleFavorite]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Champion stats for badges
  const championStats = {
    difficulty: champion.tags?.includes('Fighter') ? 'Medium' : 
                champion.tags?.includes('Assassin') ? 'Hard' : 'Easy',
    role: champion.tags?.[0] || 'Unknown',
    skinCount: champion.skins?.length || 0
  };

  const cardSize = compact ? 'w-24 h-24' : 'w-32 h-32';
  const padding = compact ? 'p-2' : 'p-3';

  return (
    <motion.div
      ref={cardRef}
      variants={ChampionCardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={`group relative cursor-pointer ${padding} rounded-2xl transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-br from-primary/20 via-purple-500/10 to-primary/20 border-2 border-primary/50 shadow-lg shadow-primary/25' 
          : 'bg-gradient-to-br from-background/80 to-muted/50 border border-border/50 hover:border-primary/30'
      }`}
      onClick={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background glow effect */}
      <AnimatePresence>
        {(isSelected || isHovered) && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 blur-xl -z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center space-y-3">
        {/* Champion Portrait */}
        <div className={`relative ${cardSize} rounded-xl overflow-hidden shadow-lg`}>
          {/* Loading placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse flex items-center justify-center">
              <Shield className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}

          {/* Champion image */}
          <AnimatePresence>
            {imageLoaded && (
              <motion.img
                src={optimizedImageUrl}
                alt={`${champion.name} portrait`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                loading={priority === 'high' ? 'eager' : 'lazy'}
                onError={() => setImageError(true)}
              />
            )}
          </AnimatePresence>

          {/* Error fallback */}
          {imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-red-500/10 flex items-center justify-center">
              <Crown className="h-8 w-8 text-destructive/60" />
            </div>
          )}

          {/* Favorite button */}
          <motion.div 
            className="absolute top-2 right-2"
            variants={FavoriteButtonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            animate={isFavorite ? "favorited" : "idle"}
          >
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border-0"
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-4 w-4 transition-colors duration-200 ${
                  isFavorite 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-white/80 hover:text-red-400'
                }`} 
              />
            </Button>
          </motion.div>

          {/* Selection indicator */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute inset-0 border-2 border-primary rounded-xl"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Badges */}
          {showBadges && !compact && (
            <div className="absolute bottom-2 left-2 flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5 bg-black/60 text-white border-0 backdrop-blur-sm"
                    >
                      {championStats.skinCount}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {championStats.skinCount} skins available
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Champion name */}
        <div className="text-center min-h-[2rem] flex items-center">
          <motion.h3 
            className={`font-semibold leading-tight ${
              compact ? 'text-xs' : 'text-sm'
            } ${
              isSelected 
                ? 'text-primary' 
                : 'text-foreground group-hover:text-primary'
            } transition-colors duration-200`}
            layout
          >
            {champion.name}
          </motion.h3>
        </div>

        {/* Role badge */}
        {showBadges && !compact && championStats.role !== 'Unknown' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-0.5 bg-background/80 backdrop-blur-sm"
            >
              {championStats.role}
            </Badge>
          </motion.div>
        )}

        {/* Special effects for selected state */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sparkle effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute top-1/4 right-1/4 text-yellow-400"
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0.8],
                rotate: 180
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 left-1/4 text-blue-400"
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 0.8, 0.6],
                rotate: -90
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <Star className="h-2 w-2" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default EnhancedChampionCard;
