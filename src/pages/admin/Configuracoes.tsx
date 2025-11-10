import { Plus, Edit, Trash2, Save } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Configuracoes = () => {
  const categories = ["Adornos", "Utilitários", "Decoração"];
  const aldeias = ["Canoanã", "Txuiri", "Pimentel Barbosa"];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
            <p className="text-muted-foreground">Gerencie categorias, aldeias e conteúdo do site</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Gerenciar Categorias</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Nome da nova categoria" className="flex-1 bg-background" />
                  <Button className="bg-gold hover:bg-gold/90 text-green-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/10">
                      <span className="text-foreground">{category}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-border/20 hover:bg-green-medium/20">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Gerenciar Aldeias/Origens</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Nome da nova aldeia" className="flex-1 bg-background" />
                  <Button className="bg-gold hover:bg-gold/90 text-green-dark">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {aldeias.map((aldeia, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/10">
                      <span className="text-foreground">{aldeia}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-border/20 hover:bg-green-medium/20">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/10">
              <h2 className="text-xl font-semibold text-foreground mb-4">Conteúdo da Página</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="how-it-works">Texto "Como funciona?"</Label>
                  <Textarea
                    id="how-it-works"
                    rows={6}
                    className="bg-background"
                    defaultValue="1. Navegue pela galeria e escolha as peças que mais lhe agradam&#10;2. Clique no botão 'Ver Detalhes' para conhecer mais sobre o produto&#10;3. Entre em contato diretamente com o artesão via WhatsApp&#10;4. Negocie valores, formas de pagamento e entrega&#10;5. Receba sua peça única, feita com tradição e carinho"
                  />
                </div>
                <div>
                  <Label htmlFor="about-text">Texto "Sobre o Projeto"</Label>
                  <Textarea
                    id="about-text"
                    rows={4}
                    className="bg-background"
                    defaultValue="O projeto de extensão do Instituto Federal do Tocantins (IFTO) que promove a inclusão digital nas comunidades indígenas da Ilha do Bananal."
                  />
                </div>
                <Button type="submit" className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;
