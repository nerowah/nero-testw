import React, { useMemo } from "react";
import { Champion } from "@/lib/types";
import { SkinCard } from "./SkinCard";
import { ScrollArea } from "./ui/scroll-area";
import { SkinLoading } from "./EnhancedLoading";
import { Skeleton } from "./ui/skeleton";

interface SkinGridProps {
  champion: Champion | null;
  isLoading?: boolean;
}

// Loading skeleton for skin grid
function SkinGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton 
            className="aspect-[308/560] w-full rounded-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

// Empty state component
function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto">
          <div className="w-8 h-8 rounded-lg bg-muted-foreground/20" />
        </div>
        <h3 className="text-xl font-semibold text-foreground/80">
          Select a Champion
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Choose a champion from the sidebar to view and manage their skins
        </p>
      </div>
    </div>
  );
}

export const SkinGrid = React.memo(function SkinGrid({
  champion,
  isLoading = false,
}: SkinGridProps) {
  // Memoize filtered skins for better performance
  const availableSkins = useMemo(() => {
    if (!champion) return [];
    return champion.skins.filter((skin) => !skin.isBase);
  }, [champion]);

  if (isLoading) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="p-6">
          <SkinGridSkeleton />
        </div>
      </ScrollArea>
    );
  }

  if (!champion) {
    return <EmptyState />;
  }

  if (availableSkins.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto">
            <div className="w-8 h-8 rounded-lg bg-muted-foreground/20" />
          </div>
          <h3 className="text-xl font-semibold text-foreground/80">
            No Skins Available
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            This champion doesn't have any additional skins available
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {availableSkins.map((skin, index) => (
            <div
              key={skin.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <SkinCard championId={champion.id} skin={skin} />
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
});
