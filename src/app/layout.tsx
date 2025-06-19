import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { TerminalLogListener } from "@/components/providers/TerminalLogListener";
import { ThemeToneProvider } from "@/components/providers/ThemeToneProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <title>League Skin Manager</title>
        <meta
          name="description"
          content="A powerful and elegant League of Legends skin manager with modern UI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950`}
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Main content with backdrop blur */}
        <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeToneProvider>
              {/* Enhanced main content area */}
              <ErrorBoundary>
                <main className="flex-1 flex flex-col overflow-hidden">
                  {children}
                </main>
              </ErrorBoundary>
              
              {/* Enhanced Toaster with custom styling */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  className: "backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-white/20 dark:border-slate-700/50 shadow-xl",
                  duration: 4000,
                }}
              />
              
              <TerminalLogListener />
            </ThemeToneProvider>
          </ThemeProvider>
        </div>


      </body>
    </html>
  );
}