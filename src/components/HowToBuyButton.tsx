import { useState } from "react";
import { HelpCircle, X, ShoppingBag, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

const HowToBuyButton = () => {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      icon: ShoppingBag,
      title: "1. Escolha",
      description: "Navegue pela galeria e escolha a peça que deseja"
    },
    {
      icon: MessageCircle,
      title: "2. Clique no WhatsApp",
      description: "Use o botão verde para falar diretamente com o artesão"
    },
    {
      icon: Package,
      title: "3. Combine a compra",
      description: "Negocie preço, frete e receba sua peça em casa!"
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Como comprar"
      >
        <HelpCircle className="w-6 h-6" />
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
                className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
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
