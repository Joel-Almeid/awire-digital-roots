import { Plus, Package, Users, Image } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Total de Produtos", value: "24", icon: Package, color: "text-gold" },
    { label: "Total de Artesãos", value: "12", icon: Users, color: "text-green-light" },
    { label: "Total de Fotos", value: "48", icon: Image, color: "text-gold" },
  ];

  const recentActivity = [
    { action: "Cocar Tradicional foi adicionado", time: "Há 2 horas" },
    { action: "Pulseira Javaé foi editada", time: "Há 5 horas" },
    { action: "Nova foto adicionada à galeria", time: "Há 1 dia" },
    { action: "Artesão Juma Karajá foi atualizado", time: "Há 2 dias" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo(a), {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Gerencie o conteúdo do site AWIRE DIGITAL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 bg-card border-border/10 hover:border-gold/30 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/admin/artesanato")}
                  className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Artesanato
                </Button>
                <Button
                  onClick={() => navigate("/admin/fotos")}
                  variant="outline"
                  className="w-full border-border/20 hover:bg-green-medium/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Foto
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/10 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-gold mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
