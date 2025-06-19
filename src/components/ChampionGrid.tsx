"use client";

import React, { useMemo } from "react";
import { Champion } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { ChampionCard } from "@/components/ChampionCard";

interface ChampionGridProps {
  champions: Champion[];
  selectedChampionId: number | null;
  favorites: Set<number>;
  onSelectChampion: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

function ChampionGridLoading() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        <div className="w-full h-fit mx-auto grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 45 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="aspect-square size-[64px] rounded-lg animate-pulse" 
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

const ChampionGrid = React.memo(function ChampionGrid({
  champions,
  selectedChampionId,
  favorites,
  onSelectChampion,
  onToggleFavorite,
}: ChampionGridProps) {
  // Memoize sorted champions for better performance
  const sortedChampions = useMemo(() => {
    return [...champions].sort((a, b) => {
      const aFav = favorites.has(a.id) ? 1 : 0;
      const bFav = favorites.has(b.id) ? 1 : 0;
      if (bFav !== aFav) return bFav - aFav;
      // Secondary sort by name for consistent ordering
      return a.name.localeCompare(b.name);
    });
  }, [champions, favorites]);

  if (champions.length === 0) {
    return <ChampionGridLoading />;
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        <div className="w-fit mx-auto grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {sortedChampions.map((champion: Champion) => (
            <ChampionCard
              key={champion.id}
              champion={champion}
              isSelected={selectedChampionId === champion.id}
              isFavorite={favorites.has(champion.id)}
              onToggleFavorite={() => {
                onToggleFavorite(champion.id);
              }}
              onClick={() => {
                onSelectChampion(champion.id);
              }}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
});

export default ChampionGrid;
