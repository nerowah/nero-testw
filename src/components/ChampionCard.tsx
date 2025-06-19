import React, { useState, useCallback } from "react";
import { Champion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import Image from "next/image";
import { Heart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChampionCardProps {
  champion: Champion;
  isSelected: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export const ChampionCard = React.memo(function ChampionCard({
  champion,
  isSelected,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ChampionCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  }, [onToggleFavorite]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Card
        className={cn(
          "relative aspect-square cursor-pointer overflow-hidden transition-all duration-200 p-0 rounded-lg group",
          "hover:shadow-lg hover:shadow-primary/20",
          isSelected 
            ? "ring-2 ring-primary shadow-md shadow-primary/30" 
            : "hover:ring-1 hover:ring-primary/30"
        )}
        onClick={onClick}
      >
        {/* Favorite button */}
        <motion.button
          className={cn(
            "absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-sm transition-all",
            "hover:scale-110 active:scale-95",
            isFavorite 
              ? "bg-red-500/20 hover:bg-red-500/30" 
              : "bg-black/20 hover:bg-black/40"
          )}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            size={14}
            className={cn(
              "transition-all duration-200",
              isFavorite 
                ? "fill-red-500 text-red-500 drop-shadow-sm" 
                : "text-white/80 hover:text-white"
            )}
          />
        </motion.button>

        {/* Champion image */}
        {champion.iconSrc && !imageError ? (
          <Image
            src={champion.iconSrc}
            alt={champion.name}
            className={cn(
              "size-full object-cover transition-all duration-300 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            width={64}
            height={64}
            onLoad={handleImageLoad}
            onError={handleImageError}
            unoptimized
          />
        ) : (
          <div className="size-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground/60" />
          </div>
        )}

        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Selection indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-sm"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover overlay with champion name */}
        <AnimatePresence>
          {isHovering && !isSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2"
            >
              <p className="text-white text-xs font-medium text-center truncate">
                {champion.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
});
