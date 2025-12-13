import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { 
  getArtesanatos, 
  getArtesaos, 
  getCategorias, 
  getAldeias,
  getCollectionCount,
  Artesanato,
  Artesao,
  Categoria,
  Aldeia
} from "@/lib/firestore";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ['hsl(43, 74%, 58%)', 'hsl(160, 75%, 30%)', 'hsl(160, 56%, 23%)', 'hsl(160, 87%, 15%)', '#8884d8', '#82ca9d', '#ffc658'];

interface CategoryCount {
  name: string;
  value: number;
}

interface AldeiaCount {
  name: string;
  produtos: number;
  artesaos: number;
}

const Estatisticas = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalArtesaos: 0,
    totalFotos: 0
  });
  const [categoryData, setCategoryData] = useState<CategoryCount[]>([]);
  const [aldeiaData, setAldeiaData] = useState<AldeiaCount[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);

      try {
        const [artesanatos, artesaos, categorias, aldeias, fotosCount] = await Promise.all([
          getArtesanatos(),
          getArtesaos(),
          getCategorias(),
          getAldeias(),
          getCollectionCount("fotos")
        ]);

        if (!isMounted) return;

        // Contar produtos por categoria
        const categoryCountMap: Record<string, number> = {};
        artesanatos.forEach(a => {
          const cat = a.categoria || "Sem categoria";
          categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
        });
        const catData = Object.entries(categoryCountMap).map(([name, value]) => ({ name, value }));

        // Contar produtos e artesãos por aldeia
        const aldeiaProductMap: Record<string, number> = {};
        const aldeiaArtesaoMap: Record<string, number> = {};
        
        artesanatos.forEach(a => {
          const ald = a.aldeia || "Sem aldeia";
          aldeiaProductMap[ald] = (aldeiaProductMap[ald] || 0) + 1;
        });
        
        artesaos.forEach(a => {
          const ald = a.aldeia || "Sem aldeia";
          aldeiaArtesaoMap[ald] = (aldeiaArtesaoMap[ald] || 0) + 1;
        });

        const allAldeias = new Set([...Object.keys(aldeiaProductMap), ...Object.keys(aldeiaArtesaoMap)]);
        const aldData = Array.from(allAldeias).map(name => ({
          name,
          produtos: aldeiaProductMap[name] || 0,
          artesaos: aldeiaArtesaoMap[name] || 0
        })).sort((a, b) => b.produtos - a.produtos);

        setStats({
          totalProdutos: artesanatos.length,
          totalArtesaos: artesaos.filter(a => a.ativo !== false).length,
          totalFotos: fotosCount
        });
        setCategoryData(catData);
        setAldeiaData(aldData);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Estatísticas
            </h1>
            <p className="text-muted-foreground">
              Visualize dados e métricas do site AWIRE DIGITAL
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando estatísticas...</p>
            </div>
          ) : (
            <>
              {/* Métricas Chave */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-card border-border/10 text-center">
                  <p className="text-4xl font-bold text-primary mb-2">{stats.totalProdutos}</p>
                  <p className="text-muted-foreground">Produtos Cadastrados</p>
                </Card>
                <Card className="p-6 bg-card border-border/10 text-center">
                  <p className="text-4xl font-bold text-green-light mb-2">{stats.totalArtesaos}</p>
                  <p className="text-muted-foreground">Artesãos Ativos</p>
                </Card>
                <Card className="p-6 bg-card border-border/10 text-center">
                  <p className="text-4xl font-bold text-gold mb-2">{stats.totalFotos}</p>
                  <p className="text-muted-foreground">Fotos na Galeria</p>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Pizza - Categorias */}
                <Card className="p-6 bg-card border-border/10">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Produtos por Categoria
                  </h2>
                  {categoryData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum produto cadastrado ainda.
                    </p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>

                {/* Gráfico de Barras - Aldeias */}
                <Card className="p-6 bg-card border-border/10">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Produtos e Artesãos por Aldeia
                  </h2>
                  {aldeiaData.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum dado disponível ainda.
                    </p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aldeiaData} layout="vertical">
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={100}
                            stroke="hsl(var(--muted-foreground))"
                            tick={{ fill: 'hsl(var(--foreground))' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="produtos" name="Produtos" fill="hsl(43, 74%, 58%)" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="artesaos" name="Artesãos" fill="hsl(160, 56%, 30%)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
              </div>

              {/* Tabela de Resumo */}
              <Card className="p-6 bg-card border-border/10 mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Resumo por Categoria
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/10">
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Categoria</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Quantidade</th>
                        <th className="text-right py-3 px-4 text-muted-foreground font-medium">Percentual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((cat, index) => (
                        <tr key={cat.name} className="border-b border-border/5 hover:bg-secondary/20">
                          <td className="py-3 px-4 text-foreground flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {cat.name}
                          </td>
                          <td className="text-right py-3 px-4 text-foreground">{cat.value}</td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            {stats.totalProdutos > 0 
                              ? ((cat.value / stats.totalProdutos) * 100).toFixed(1) 
                              : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Estatisticas;