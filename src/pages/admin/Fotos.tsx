import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Fotos = () => {
  const photos = [
    { id: 1, title: "Oficina de Informática", alt: "Estudantes em aula" },
    { id: 2, title: "Artesanato Local", alt: "Produtos artesanais" },
    { id: 3, title: "Comunidade Canoanã", alt: "Vista da aldeia" },
    { id: 4, title: "Aula Prática", alt: "Estudantes usando computadores" },
    { id: 5, title: "Cultura Indígena", alt: "Apresentação cultural" },
    { id: 6, title: "Projeto em Ação", alt: "Equipe trabalhando" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Galeria de Fotos</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova fotos do projeto</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Foto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Nova Foto</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="photo-upload">Upload da Imagem</Label>
                    <Input id="photo-upload" type="file" accept="image/*" className="bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="photo-title">Legenda/Título</Label>
                    <Input id="photo-title" placeholder="Ex: Oficina de Informática" className="bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="photo-alt">Texto Alternativo (Alt Text)</Label>
                    <Input id="photo-alt" placeholder="Descreva a imagem para acessibilidade" className="bg-background" />
                  </div>
                  <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                    Publicar Foto
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="bg-card border-border/10 overflow-hidden hover:border-gold/30 transition-all group">
                <div className="aspect-square bg-green-medium/30 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    [Imagem]
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground text-sm mb-1">{photo.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{photo.alt}</p>
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

export default Fotos;
