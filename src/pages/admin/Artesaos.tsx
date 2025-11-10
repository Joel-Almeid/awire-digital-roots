import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const Artesaos = () => {
  const artisans = [
    { id: 1, name: "Juma Karajá", aldeia: "Canoanã", whatsapp: "+55 63 99274-7396", status: true },
    { id: 2, name: "Aranã Txuiri", aldeia: "Txuiri", whatsapp: "+55 63 99274-7396", status: true },
    { id: 3, name: "Ijanaru Javaé", aldeia: "Canoanã", whatsapp: "+55 63 99274-7396", status: true },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Artesãos</h1>
              <p className="text-muted-foreground">Adicione, edite ou remova artesãos</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Novo Artesão
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Adicionar Novo Artesão</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="artisan-name">Nome do Artesão</Label>
                    <Input id="artisan-name" placeholder="Ex: Juma Karajá" className="bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="photo">Foto do Artesão</Label>
                    <Input id="photo" type="file" accept="image/*" className="bg-background" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">Link do WhatsApp</Label>
                    <Input id="whatsapp" placeholder="+55 63 99999-9999" className="bg-background" />
                  </div>
                  <div>
                    <Label>Aldeia/Origem Principal</Label>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status Ativo</Label>
                    <Switch id="status" />
                  </div>
                  <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-green-dark font-semibold">
                    Salvar Artesão
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan) => (
              <Card key={artisan.id} className="p-6 bg-card border-border/10 hover:border-gold/30 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-medium/30 flex items-center justify-center text-gold font-bold text-xl">
                    {artisan.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{artisan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">Aldeia {artisan.aldeia}</p>
                    <p className="text-xs text-muted-foreground">{artisan.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`text-sm font-medium ${artisan.status ? 'text-green-light' : 'text-destructive'}`}>
                    {artisan.status ? 'Ativo' : 'Inativo'}
                  </span>
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
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Artesaos;
