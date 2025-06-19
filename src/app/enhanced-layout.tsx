import { Poppins, Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { TerminalLogListener } from "@/components/providers/TerminalLogListener";
import { ThemeToneProvider } from "@/components/providers/ThemeToneProvider";
import { motion } from "framer-motion";

// Optimized font loading with display swap for better performance
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

// Enhanced background component with performance optimizations
const EnhancedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Main gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950" />
    
    {/* Animated background elements - reduced for better performance */}
    <motion.div 
      className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 20, 0],
        y: [0, -10, 0]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl"
      animate={{
        scale: [1.1, 1, 1.1],
        opacity: [0.2, 0.4, 0.2],
        x: [0, -15, 0],
        y: [0, 15, 0]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2
      }}
    />
    <motion.div 
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"
      animate={{
        rotate: [0, 180, 360],
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    
    {/* Glass overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
  </div>
);

// Performance optimized metadata
const getPageMetadata = () => ({
  title: "FeitanxMoussaid - League Skin Manager",
  description: "A powerful and elegant League of Legends skin manager with modern UI, real-time LCU integration, and custom skin support.",
  keywords: "League of Legends, LoL, Skins, Custom Skins, Skin Manager, LCU, Riot Games",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#3b82f6",
  colorScheme: "light dark",
});

export default function EnhancedRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metadata = getPageMetadata();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="viewport" content={metadata.viewport} />
        <meta name="theme-color" content={metadata.themeColor} />
        <meta name="color-scheme" content={metadata.colorScheme} />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/favicon.ico" as="image" />
        
        {/* Optimize loading */}
        <link rel="prefetch" href="/api/champions" />
        
        {/* PWA support */}
        <meta name="application-name" content="FeitanxMoussaid" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FeitanxMoussaid" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased flex flex-col h-screen overflow-hidden`}
        suppressHydrationWarning
      >
        {/* Enhanced animated background */}
        <EnhancedBackground />

        {/* Main content with backdrop blur and performance optimizations */}
        <div className="relative z-10 flex flex-col h-full backdrop-blur-[2px]">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="osskins-theme"
          >
            <ThemeToneProvider>
              {/* Enhanced main content area */}
              <motion.main 
                className="flex-1 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {children}
              </motion.main>
              
              {/* Enhanced Toaster with improved styling */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: "backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-700/50 shadow-2xl",
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }
                }}
                closeButton
                richColors
                expand
                visibleToasts={5}
              />
              
              <TerminalLogListener />
            </ThemeToneProvider>
          </ThemeProvider>
        </div>

        {/* Performance monitoring script for development */}
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Performance monitoring
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', () => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData.loadEventEnd - perfData.loadEventStart > 1000) {
                      console.warn('Page load time exceeded 1 second:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                    }
                  });
                  
                  // Memory usage monitoring
                  if ('memory' in performance) {
                    setInterval(() => {
                      const memory = performance.memory;
                      if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
                        console.warn('High memory usage detected:', (memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB');
                      }
                    }, 30000);
                  }
                }
              `
            }}
          />
        )}
      </body>
    </html>
  );
}
