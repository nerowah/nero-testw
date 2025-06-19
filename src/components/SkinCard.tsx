import React, { Suspense, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChromaSelector } from "./ChromaSelector";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Check, Play, ImageIcon, AlertCircle } from "lucide-react";
import { Skin } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { useSkinCardLogic } from "@/lib/hooks/use-skin-card-logic";
import { motion, AnimatePresence } from "framer-motion";

interface SkinCardProps {
  championId: number;
  skin: Skin;
}

export const SkinCard = React.memo(function SkinCard({
  championId,
  skin,
}: SkinCardProps) {
  const {
    cardRef,
    selectedChroma,
    isHovering,
    imgLoaded,
    isSelected,
    currentImageSrc,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    handleChromaSelect,
    setImgLoaded,
  } = useSkinCardLogic(championId, skin);

  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setImgLoaded(true);
    setIsImageLoading(false);
    setImageError(false);
  }, [setImgLoaded]);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsImageLoading(false);
  }, []);

  // Generate a simple placeholder based on skin name
  const generatePlaceholder = () => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'];
    const colorIndex = skin.name.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card
        ref={cardRef}
        className={cn(
          "size-full relative cursor-pointer p-0 rounded-lg overflow-hidden transition-all duration-300 group",
          "hover:shadow-xl hover:shadow-primary/10",
          isSelected 
            ? "ring-2 ring-primary shadow-lg shadow-primary/20" 
            : "hover:ring-1 hover:ring-primary/50"
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Loading skeleton */}
        <AnimatePresence>
          {isImageLoading && !imageError && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20"
            >
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image or error state */}
        {currentImageSrc && !imageError ? (
          <Image
            src={currentImageSrc}
            alt={selectedChroma?.name ?? skin.name}
            width={308}
            height={560}
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7jHzsl1hpkzqCBww5Qgv8AqReaXLjv2H6H9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7jHzsl1hpkwqqv7BccgQX/ACWPvyV4Abl4x9lX9g+OQIHhwZXoXMUMhGhH0noBXH"
            priority={false}
          />
        ) : (
          <div className={cn(
            "w-full h-full flex items-center justify-center",
            generatePlaceholder()
          )}>
            {imageError ? (
              <div className="text-center text-white">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-60" />
                <p className="text-xs opacity-80">Image not available</p>
              </div>
            ) : (
              <ImageIcon className="h-8 w-8 text-white/60" />
            )}
          </div>
        )}

        {/* Selection overlay */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 z-30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-primary/90 p-3 rounded-full shadow-lg"
              >
                <Check className="size-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover overlay */}
        <AnimatePresence>
          {!isSelected && isHovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full"
              >
                <Play className="size-8 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with name and chroma selector */}
        <CardFooter className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-end z-20">
          <div className="w-full h-fit flex items-end justify-between gap-2">
            <motion.h3 
              className="text-sm font-semibold text-white drop-shadow-md flex-1 truncate"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {selectedChroma?.name ?? skin.name}
            </motion.h3>

            {/* Chroma Selector positioned in bottom right */}
            {skin.chromas.length > 0 && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ChromaSelector
                  chromas={skin.chromas}
                  onSelect={handleChromaSelect}
                  selectedChromaId={selectedChroma?.id}
                />
              </motion.div>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});
