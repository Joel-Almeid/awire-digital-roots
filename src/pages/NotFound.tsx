import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-primary/20 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-20 h-20 md:w-28 md:h-28 text-primary" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
            A página que você está procurando não existe ou foi movida. 
            Que tal explorar nosso artesanato?
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Página Inicial
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border/20 hover:bg-secondary/50"
            >
              <Link to="/artesanato">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver Artesanatos
              </Link>
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
