import { useState, useEffect } from "react";
import { Plus, Package, Users, Image, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getCollectionCount, getRecentActivity, ActivityLog } from "@/lib/firestore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    artesanatos: 0,
    artesaos: 0,
    fotos: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [artesanatosCount, artesaosCount, fotosCount, activity] = await Promise.all([
        getCollectionCount("artesanatos"),
        getCollectionCount("artesaos"),
        getCollectionCount("fotos"),
        getRecentActivity(10)
      ]);
      
      setStats({
        artesanatos: artesanatosCount,
        artesaos: artesaosCount,
        fotos: fotosCount
      });
      setRecentActivity(activity);
      setLoading(false);
    };

    loadData();
  }, []);

  const statsConfig = [
    { label: "Total de Produtos", value: stats.artesanatos, icon: Package, color: "text-gold" },
    { label: "Total de Artesãos", value: stats.artesaos, icon: Users, color: "text-green-light" },
    { label: "Total de Fotos", value: stats.fotos, icon: Image, color: "text-gold" },
  ];

  const formatActivityTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo(a), {user?.displayName || user?.email || "Administrador"}!
            </h1>
            <p className="text-muted-foreground">
              Gerencie o conteúdo do site AWIRE DIGITAL
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statsConfig.map((stat) => (
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
                      onClick={() => navigate("/admin/artesaos")}
                      variant="outline"
                      className="w-full border-border/20 hover:bg-green-medium/20"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Novo Artesão
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
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Atividade Recente
                  </h2>
                  {recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma atividade registrada ainda.</p>
                  ) : (
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-start gap-3 pb-3 border-b border-border/10 last:border-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground line-clamp-2">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{formatActivityTime(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
