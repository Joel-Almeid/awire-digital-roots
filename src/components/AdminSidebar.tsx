import { Home, Package, Users, Image, Settings, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { useAuth } from "@/contexts/AuthContext";
import logoAwire from "@/assets/logo-awire.png";

export const AdminSidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Artesanato", path: "/admin/artesanato" },
    { icon: Users, label: "Artesãos", path: "/admin/artesaos" },
    { icon: Image, label: "Galeria de Fotos", path: "/admin/fotos" },
    { icon: Settings, label: "Configurações", path: "/admin/configuracoes" },
  ];

  return (
    <aside className="w-64 bg-green-dark border-r border-border/10 min-h-screen flex flex-col">
      <div className="p-6 border-b border-border/10">
        <img src={logoAwire} alt="AWIRE DIGITAL" className="h-12 w-auto mb-2" />
        <h2 className="text-sm text-muted-foreground">Painel Admin</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-green-medium/20 hover:text-foreground transition-all"
            activeClassName="bg-green-medium/30 text-gold font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
