import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import logoAwire from "@/assets/logo-awire.png";
import logoIfto from "@/assets/logo-ifto.png";

const Footer = () => {
  return (
    <footer className="bg-green-dark border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Info */}
          <div className="space-y-4">
            <img src={logoAwire} alt="AWIRE DIGITAL" className="h-16 w-auto" />
            <h3 className="text-lg font-bold text-foreground">PROJETO AWIRE DIGITAL</h3>
            <p className="text-sm text-muted-foreground">Inclusão Digital na Ilha do Bananal</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre</a></li>
              <li><a href="#participantes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Participantes</a></li>
              <li><a href="#arte" className="text-sm text-muted-foreground hover:text-primary transition-colors">Arte Indígena</a></li>
              <li><a href="#fotos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Fotos</a></li>
              <li><Link to="/artesanato" className="text-sm text-muted-foreground hover:text-primary transition-colors">Artesanato</Link></li>
            </ul>
          </div>

          {/* Institutions */}
          <div>
            <h4 className="text-base font-semibold text-foreground mb-4">Instituições</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.ifto.edu.br/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                  <img src={logoIfto} alt="IFTO" className="h-8 w-8" />
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">IFTO</span>
                </a>
              </li>
              <li><span className="text-sm text-muted-foreground">FUNAI</span></li>
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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 AWIRE DIGITAL. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Login do Admin
              </Link>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Uso
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
