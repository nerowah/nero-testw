"use client";
import { useState, useEffect } from "react";
import {
  WebviewWindow,
  getCurrentWebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { Button } from "@/components/ui/button";
import { Minus, Square, X, Copy, Gamepad2 } from "lucide-react";

interface TitleBarProps {
  title?: string;
  showIcon?: boolean;
  className?: string;
}

export function TitleBar({ 
  title = "Hindi Hwak", 
  showIcon = true,
  className = "" 
}: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [appWindow, setAppWindow] = useState<WebviewWindow | null>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  useEffect(() => {
    // Get the current webview window
    const initWindow = async () => {
      try {
        const currentWindow = getCurrentWebviewWindow();
        setAppWindow(currentWindow);

        // Check if the window is maximized initially
        try {
          const maximized = await currentWindow.isMaximized();
          setIsMaximized(maximized);
        } catch (error) {
          console.error("Failed to check if window is maximized:", error);
        }

        // Listen for window resize events
        const unlistenResize = await currentWindow.listen(
          "tauri://resize",
          () => {
            currentWindow
              .isMaximized()
              .then((maximized) => {
                setIsMaximized(maximized);
              })
              .catch((error: unknown) => {
                console.error(
                  "Failed to check if window is maximized on resize:",
                  error
                );
              });
          }
        );

        return unlistenResize;
      } catch (error) {
        console.error("Failed to initialize window:", error);
        return null;
      }
    };

    let unlisten: (() => void) | null = null;
    initWindow()
      .then((unlistenFn) => {
        unlisten = unlistenFn;
      })
      .catch((error: unknown) => {
        console.error("Failed to initialize window listeners:", error);
      });

    return () => {
      // Cleanup event listeners
      if (unlisten) unlisten();
    };
  }, []);

  const minimize = async () => {
    try {
      if (appWindow) {
        await appWindow.minimize();
      }
    } catch (error) {
      console.error("Failed to minimize window:", error);
    }
  };

  const toggleMaximize = async () => {
    try {
      if (appWindow) {
        if (isMaximized) {
          await appWindow.unmaximize();
        } else {
          await appWindow.maximize();
        }
      }
    } catch (error) {
      console.error("Failed to toggle maximize:", error);
    }
  };

  const close = async () => {
    try {
      if (appWindow) {
        await appWindow.close();
      }
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  };

  return (
    <div 
      className={`
        flex items-center justify-between h-12 px-4 
        bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
        border-b border-slate-700/50 backdrop-blur-sm
        ${className}
      `}
      data-tauri-drag-region
    >
      {/* Left side - App icon and title */}
      <div className="flex items-center space-x-3 flex-1">
        {showIcon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Gamepad2 className="h-5 w-5 text-white" />
          </div>
        )}
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-white tracking-wide">
            {title}
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Ready</span>
          </div>
        </div>
      </div>

      {/* Right side - Window controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="
            h-8 w-8 rounded-md
            text-slate-300 hover:text-white
            hover:bg-slate-700/50 
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-blue-500/50
            active:scale-95
          "
          onClick={() => void minimize()}
          onMouseEnter={() => setIsHovered('minimize')}
          onMouseLeave={() => setIsHovered(null)}
          aria-label="Minimize window"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="
            h-8 w-8 rounded-md
            text-slate-300 hover:text-white
            hover:bg-slate-700/50 
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-blue-500/50
            active:scale-95
          "
          onClick={() => void toggleMaximize()}
          onMouseEnter={() => setIsHovered('maximize')}
          onMouseLeave={() => setIsHovered(null)}
          aria-label={isMaximized ? "Restore window" : "Maximize window"}
        >
          {isMaximized ? (
            <Copy className="h-3.5 w-3.5" />
          ) : (
            <Square className="h-3.5 w-3.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="
            h-8 w-8 rounded-md
            text-slate-300 hover:text-white
            hover:bg-red-500/80 hover:text-white
            transition-all duration-200 ease-in-out
            focus:ring-2 focus:ring-red-500/50
            active:scale-95
          "
          onClick={() => void close()}
          onMouseEnter={() => setIsHovered('close')}
          onMouseLeave={() => setIsHovered(null)}
          aria-label="Close window"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="
          absolute top-14 right-4 
          px-2 py-1 text-xs 
          bg-slate-800 text-white 
          rounded-md shadow-lg
          border border-slate-600
          animate-in fade-in-0 zoom-in-95
          duration-150
        ">
          {isHovered === 'minimize' && 'Minimize'}
          {isHovered === 'maximize' && (isMaximized ? 'Restore' : 'Maximize')}
          {isHovered === 'close' && 'Close'}
        </div>
      )}
    </div>
  );
}