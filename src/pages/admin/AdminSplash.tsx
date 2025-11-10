import { useNavigate } from "react-router-dom";
import { Package, Users, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logoAwire from "@/assets/logo-awire.png";

const AdminSplash = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Package, label: "Artesanato", description: "Gerencie produtos" },
    { icon: Users, label: "Artesãos", description: "Gerencie artesãos" },
    { icon: Image, label: "Galeria", description: "Gerencie fotos" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-dark via-green-medium to-green-dark flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full bg-card/95 backdrop-blur-sm border-border p-12 text-center animate-scale-in">
        <img src={logoAwire} alt="AWIRE DIGITAL" className="h-24 w-auto mx-auto mb-6" />
        
        <h1 className="text-4xl font-bold text-foreground mb-3">AWIRE DIGITAL</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Painel Administrativo de Gerenciamento
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="bg-background/50 rounded-lg p-6 border border-border/10 hover:border-gold/30 transition-all"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-3 text-gold" />
              <h3 className="font-semibold text-foreground mb-1">{feature.label}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <Button
          size="lg"
          onClick={() => navigate("/admin/dashboard")}
          className="bg-gold hover:bg-gold/90 text-green-dark font-semibold px-8"
        >
          Acessar Painel
        </Button>
      </Card>
    </div>
  );
};

export default AdminSplash;
