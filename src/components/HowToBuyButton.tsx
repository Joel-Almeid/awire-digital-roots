import { useState } from "react";
import { HelpCircle, ShoppingBag, MessageCircle, Package, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const HowToBuyButton = () => {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      icon: ShoppingBag,
      title: "1. Escolha",
      description: "Navegue pela galeria e escolha a peça que deseja",
      clickable: false
    },
    {
      icon: MessageCircle,
      title: "2. Clique no WhatsApp",
      description: "Use o botão verde para falar diretamente com o artesão",
      clickable: false
    },
    {
      icon: Package,
      title: "3. Combine a compra",
      description: "Negocie preço, frete e receba sua peça em casa!",
      clickable: false
    },
    {
      icon: Headphones,
      title: "4. Dúvidas?",
      description: "Fale agora com o suporte do projeto.",
      clickable: true,
      action: () => {
        const message = encodeURIComponent("Olá, estou navegando no Awire Digital e preciso de ajuda.");
        window.open(`https://wa.me/5563992747396?text=${message}`, "_blank");
      },
      cta: "CLIQUE AQUI"
    }
  ];

  return (
    <>
      {/* Floating Button - positioned above WhatsApp */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-32 md:bottom-36 right-4 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 scale-90 md:scale-100"
        aria-label="Como comprar"
      >
        <HelpCircle className="w-6 h-6 md:w-7 md:h-7" />
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-foreground">
              Como Comprar?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={step.clickable ? step.action : undefined}
                className={`flex items-start gap-4 p-3 rounded-lg bg-secondary/30 ${
                  step.clickable 
                    ? "cursor-pointer hover:bg-primary/20 border-2 border-primary/30 hover:border-primary transition-all" 
                    : ""
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.clickable ? "bg-green-500/20" : "bg-primary/20"
                }`}>
                  <step.icon className={`w-5 h-5 ${step.clickable ? "text-green-500" : "text-primary"}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.cta && (
                    <span className="text-sm font-bold text-green-500 mt-1 inline-block">
                      {step.cta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Pagamento direto ao artesão. Valorizando a cultura indígena.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HowToBuyButton;
