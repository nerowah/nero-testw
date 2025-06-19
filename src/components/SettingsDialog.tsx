import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/lib/store";
import { toast } from "sonner";
import { 
  Settings, 
  RefreshCw, 
  FolderOpen, 
  Search, 
  Palette, 
  Database,
  HardDrive,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { ThemeToneSelector } from "./ThemeToneSelector";
import { Separator } from "./ui/separator";
import { useLeagueDirectory } from "@/lib/hooks/use-league-directory";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SettingsDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const leaguePath = useGameStore((s) => s.leaguePath);
  const setLeaguePath = useGameStore((s) => s.setLeaguePath);
  const autoUpdateData = useGameStore((s) => s.autoUpdateData);
  const setAutoUpdateData = useGameStore((s) => s.setAutoUpdateData);
  const { isLoading, handleSelectDirectory, handleAutoDetect } =
    useLeagueDirectory(setLeaguePath);

  const hasValidPath = leaguePath && leaguePath.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
            <Settings className="size-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-base">
            Customize your application preferences and configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          {/* Data Management Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Database className="size-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Data Management</h3>
                <p className="text-sm text-muted-foreground">Control how champion data is updated</p>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Auto Update Champion Data</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically fetch the latest champion data when available
                  </p>
                </div>
                <Switch
                  checked={autoUpdateData}
                  onCheckedChange={setAutoUpdateData}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Theme Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                <Palette className="size-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize the look and feel</p>
              </div>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <ThemeToneSelector />
            </div>
          </div>

          <Separator className="my-6" />

          {/* League Installation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                <HardDrive className="size-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">League of Legends Installation</h3>
                <p className="text-sm text-muted-foreground">Configure your game directory path</p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-4">
              {/* Path Status Indicator */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background border">
                {hasValidPath ? (
                  <>
                    <CheckCircle className="size-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-700">Path configured</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="size-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-amber-700">No path configured</span>
                  </>
                )}
              </div>

              {/* Path Input */}
              <div className="space-y-2">
                <Label htmlFor="leaguePath" className="text-sm font-medium">Installation Directory</Label>
                <div className="relative">
                  <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="leaguePath"
                    value={leaguePath ?? "Not configured"}
                    readOnly
                    className={cn(
                      "pl-10 font-mono text-sm",
                      hasValidPath ? "text-foreground" : "text-muted-foreground italic"
                    )}
                    placeholder="League of Legends installation path..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => void handleAutoDetect()}
                  disabled={isLoading}
                  variant="default"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Search className="size-4 mr-2" />
                      Auto Detect
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void handleSelectDirectory()}
                  disabled={isLoading}
                  className="w-full"
                >
                  <FolderOpen className="size-4 mr-2" />
                  Browse Folder
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-muted-foreground bg-blue-50/50 border border-blue-200/50 rounded-lg p-3">
                <strong>Tip:</strong> The League of Legends installation is typically located in:
                <br />• <code className="bg-muted px-1 rounded">C:\Riot Games\League of Legends</code>
                <br />• <code className="bg-muted px-1 rounded">C:\Program Files\Riot Games\League of Legends</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="pt-6 border-t border-border/50">
          {/* Watermark - Fixed version */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200/50 rounded-full px-4 py-2">
              <Heart className="size-4 text-red-500 fill-red-500" />
              <span className="text-muted-foreground">Made with love by</span>
              <strong className="text-gray-900 font-semibold">MOUSSAID &amp; FEITAN</strong>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors underline decoration-dotted"
              >
              </a>
            </div>
          </div>

          {/* Dialog Actions */}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="default" className="flex-1">
                Save & Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}