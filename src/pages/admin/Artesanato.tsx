import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import cocar from "@/assets/cocar.jpg";
import colar from "@/assets/colar.jpg";
import pulseira from "@/assets/pulseira.jpg";

const Artesanato = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [aldeiaFilter, setAldeiaFilter] = useState("all");

  const products = [
    { id: 1, name: "Cocar Tradicional", image: cocar, artisan: "Juma Karajá", category: "Adornos", aldeia: "Canoanã" },
    { id: 2, name: "Colar de Sementes", image: colar, artisan: "Aranã Txuiri", category: "Adornos", aldeia: "Txuiri" },
    { id: 3, name: "Pulseira Javaé", image: pulseira, artisan: "Ijanaru Javaé", category: "Adornos", aldeia: "Canoanã" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Artesanato</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova produtos</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Artesanato
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Novo Artesanato</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input id="name" placeholder="Ex: Cocar Tradicional" className="bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" placeholder="Descreva o artesanato..." className="bg-background" rows={4} />
                  </div>
                  <div>
                    <Label htmlFor="image">Imagem do Produto</Label>
                    <Input id="image" type="file" accept="image/*" className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Artesão</Label>
                      <Select>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecionar Artesão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="juma">Juma Karajá</SelectItem>
                          <SelectItem value="arana">Aranã Txuiri</SelectItem>
                          <SelectItem value="ijanaru">Ijanaru Javaé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecionar Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="adornos">Adornos</SelectItem>
                          <SelectItem value="utilitarios">Utilitários</SelectItem>
                          <SelectItem value="decoracao">Decoração</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Aldeia/Origem</Label>
                    <Select>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecionar Aldeia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canoana">Canoanã</SelectItem>
                        <SelectItem value="txuiri">Txuiri</SelectItem>
                        <SelectItem value="pimentel">Pimentel Barbosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                    Salvar Artesanato
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="p-6 bg-card border-border/10 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="adornos">Adornos</SelectItem>
                  <SelectItem value="utilitarios">Utilitários</SelectItem>
                  <SelectItem value="decoracao">Decoração</SelectItem>
                </SelectContent>
              </Select>
              <Select value={aldeiaFilter} onValueChange={setAldeiaFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Aldeia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Aldeias</SelectItem>
                  <SelectItem value="canoana">Canoanã</SelectItem>
                  <SelectItem value="txuiri">Txuiri</SelectItem>
                  <SelectItem value="pimentel">Pimentel Barbosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-card border-border/10 overflow-hidden hover:border-gold/30 transition-all">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1">Por: {product.artisan}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                    <span className="bg-green-medium/20 px-2 py-1 rounded">{product.category}</span>
                    <span className="bg-green-medium/20 px-2 py-1 rounded">{product.aldeia}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-border/20 hover:bg-green-medium/20">
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Artesanato;
