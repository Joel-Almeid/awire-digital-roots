import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import logoAwire from "@/assets/logo-awire.png";
import logoIfto from "@/assets/logo-ifto.png";
import logoNEABI from "@/assets/logo-neabi.png";

const Footer = () => {
  return (
    <footer className="bg-green-dark border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Info - Horizontal Layout */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4">
              <img src={logoAwire} alt="AWIRE DIGITAL" className="h-16 w-auto flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground leading-tight">PROJETO AWIRE DIGITAL</h3>
                <p className="text-xs text-muted-foreground">Inclusão Digital na Ilha do Bananal</p>
              </div>
              <img src={logoIfto} alt="IFTO" className="h-16 w-auto flex-shrink-0" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/#sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre</a></li>
              <li><a href="/#participantes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Participantes</a></li>
              <li><a href="/#arte" className="text-sm text-muted-foreground hover:text-primary transition-colors">Arte Indígena</a></li>
              <li><a href="/#fotos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fotos</a></li>
              <li><Link to="/artesanato" className="text-sm text-muted-foreground hover:text-primary transition-colors">Artesanato</Link></li>
            </ul>
          </div>

          {/* Institutions */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Instituições</h4>
            <ul className="space-y-3">
              <li>
                
                <a href="https://portal.ifto.edu.br/formoso" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                  <img src={logoIfto} alt="IFTO" className="h-8 w-8" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">IFTO</span>
                </a>
              </li>

              <li>
      <a 
        href="https://www.instagram.com/neabiformoso?igsh=MTd1MXJqbmZsOWRjbQ=="  
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 group"
      >
        {/* Logo NEABI*/}
        <img src={logoNEABI} alt="Logo NEABI Formoso" className="h-8 w-8" />
        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">NEABI_FORMOSO</span>
      </a>
    </li>


              <li><span className="text-sm text-muted-foreground">Secretaria de Cultura</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <a href="mailto:awiredigital@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  awiredigital@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Ilha do Bananal, Tocantins</span>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2025 AWIRE DIGITAL. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-4 text-sm flex-wrap justify-center">
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Desenvolvido por Joel Abreu Martins de Almeida / IFTO. Todos os direitos reservados conforme Lei nº 9.610/98.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
