import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "awire_consent_accepted";

const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-in">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border border-border rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Ao navegar no AWIRE DIGITAL, você concorda com nossos{" "}
              <Link to="/termos" className="text-primary hover:underline font-medium">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacidade" className="text-primary hover:underline font-medium">
                Política de Privacidade
              </Link>.
            </p>
          </div>
          <Button 
            onClick={handleAccept}
            className="whitespace-nowrap"
          >
            Aceitar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
