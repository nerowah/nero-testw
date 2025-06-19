"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
          "[&>div]:!block" // Ensure content is displayed as block
        )}
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-all duration-200 ease-out",
        "hover:bg-muted/20 data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0",
        orientation === "vertical" &&
          "h-full w-3 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-3 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full transition-all duration-200",
          "bg-border/60 hover:bg-border/80 active:bg-border",
          "hover:shadow-sm"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
