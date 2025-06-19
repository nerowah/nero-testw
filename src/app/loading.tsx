"use client";

import { Loader2, Sparkles, Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full flex-col gap-6 animate-in fade-in-50 duration-700">
      {/* Main loading animation container */}
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse scale-150"></div>
        
        {/* Rotating border ring */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 animate-spin">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
            {/* Inner spinning loader */}
            <div className="relative">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500 animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading text with typewriter effect */}
      <div className="text-center space-y-3">
        <div className="flex items-center gap-2 text-lg font-medium text-slate-700 dark:text-slate-300">
          <span className="animate-pulse">Loading League Skin Manager</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          Preparing your skin collection...
        </p>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400/60 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
}