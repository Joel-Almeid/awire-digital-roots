import { useState, useEffect } from "react";
import { Accessibility, X, Sun, Type, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const AccessibilityMenu = () => {
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedContrast = localStorage.getItem("a11y-high-contrast") === "true";
    const savedFont = localStorage.getItem("a11y-large-font") === "true";
    setHighContrast(savedContrast);
    setLargeFont(savedFont);
    
    // Apply saved preferences
    if (savedContrast) document.documentElement.classList.add("high-contrast");
    if (savedFont) document.documentElement.classList.add("large-font");
  }, []);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("a11y-high-contrast", String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleLargeFont = () => {
    const newValue = !largeFont;
    setLargeFont(newValue);
    localStorage.setItem("a11y-large-font", String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add("large-font");
    } else {
      document.documentElement.classList.remove("large-font");
    }
  };

  return (
    <>
      {/* VLibras Widget - injected via script in index.html */}

      {/* Accessibility Toggle Button */}
      <Button
        onClick={() => setOpen(!open)}
        className="fixed left-4 bottom-8 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Menu de Acessibilidade"
      >
        <Accessibility className="w-6 h-6" />
      </Button>

      {/* Accessibility Panel */}
      {open && (
        <div className="fixed left-4 bottom-24 z-50 w-72 bg-card border border-border rounded-lg shadow-xl p-4 animate-in slide-in-from-left duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Accessibility className="w-5 h-5" />
              Acessibilidade
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-primary" />
                <Label htmlFor="high-contrast" className="text-sm font-medium cursor-pointer">
                  Alto Contraste
                </Label>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            {/* Large Font Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-primary" />
                <Label htmlFor="large-font" className="text-sm font-medium cursor-pointer">
                  Fonte Ampliada
                </Label>
              </div>
              <Switch
                id="large-font"
                checked={largeFont}
                onCheckedChange={toggleLargeFont}
              />
            </div>

            {/* Sitemap Link */}
            <Link
              to="/sitemap.xml"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <Map className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Mapa do Site</span>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            VLibras disponível para tradução em Libras
          </p>
        </div>
      )}
    </>
  );
};

export default AccessibilityMenu;
