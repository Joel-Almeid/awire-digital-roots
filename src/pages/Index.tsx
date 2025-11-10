import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Palette, Camera, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Lightbox from "@/components/Lightbox";

import heroBackground from "@/assets/hero-background.jpg";
import sectionBg1 from "@/assets/section-background-1.jpg";
import sectionBg2 from "@/assets/section-background-2.jpg";
import sectionBg3 from "@/assets/section-background-3.jpg";
import cocar from "@/assets/cocar.jpg";
import colar from "@/assets/colar.jpg";
import pulseira from "@/assets/pulseira.jpg";

const Index = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const participants = [
    {
      name: "Adriano Ribeiro Silva",
      role: "Coordenador e idealizador do Projeto",
      institution: "IFTO",
      description: "Coordenação geral do projeto e articulação com as comunidades.",
    },
    {
      name: "Joel de Almeida",
      role: "Bolsista",
      institution: "IFTO",
      description: "Estudante do curso de Informática, atua como professor no curso e trabalha com a produção dos materiais didáticos, trabalhando no desenvolvimento do site.",
    },
    {
      name: "Fernanda de Jesus",
      role: "Voluntária",
      institution: "IFTO",
      description: "Estudante do curso de Informática, atua como professora no curso e trabalha com a produção dos materiais didáticos.",
    },
    {
      name: "Phabliny Esthefanny",
      role: "Estudante voluntária",
      institution: "IFTO",
      description: "Apoia a organização de conteúdos digitais e colabora nas oficinas de capacitação tecnológica.",
    },
    {
      name: "Juma Karajá",
      role: "Bolsista",
      institution: "IFTO",
      description: "Mediação cultural e comunicação com os alunos.",
    },
    {
      name: "Ijanaru Javaé",
      role: "Estudante",
      institution: "IFTO",
      description: "Estudante do curso de Informática e atua no apoio às oficinas e na mediação cultural.",
    },
    {
      name: "Gabriel Maluiri Vinícius Batista Javaé",
      role: "Bolsista",
      institution: "IFTO",
      description: "Estudante. Auxilia na mediação cultural e na aplicação das atividades de inclusão digital.",
    },
    {
      name: "Caio Gobbo",
      role: "Voluntário",
      institution: "IFTO",
      description: "Suporte técnico e logística.",
    },
    {
      name: "Vitor Vilas Boas",
      role: "Voluntário",
      institution: "IFTO",
      description: "Apoio em eventos e comunicação visual e orientador no desenvolvimento pedagógico do site.",
    },
  ];

  const testimonials = [
    {
      quote: "Ver a transformação digital chegando na aldeia é a realização de um sonho. Estamos conectando tradição e futuro.",
      author: "Adriano Ribeiro Silva",
      role: "Coordenador",
    },
    {
      quote: "O Awire Digital me ajudou a mostrar minha arte para o mundo. Antes eu não sabia usar o computador, agora eu converso com clientes de outros estados.",
      author: "Juma Karajá",
      role: "Artesã e Bolsista",
    },
    {
      quote: "Participar do Awire Digital é uma experiência incrível. Posso aplicar o que aprendo em informática para desenvolver o site e ainda atuar como professor, levando tecnologia real para as comunidades.",
      author: "Joel de Almeida",
      role: "Bolsista",
    },
  ];

  const artImages = [
    { src: cocar, alt: "Cocar Tradicional Indígena" },
    { src: colar, alt: "Colar de Miçangas" },
    { src: pulseira, alt: "Pulseira Artesanal" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 animate-fade-in-up">
            Conectando Tradição <br />
            <span className="text-gradient-gold">e Tecnologia</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Promovendo inclusão digital e valorizando a cultura indígena na Ilha do Bananal
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href="#sobre">
                Conheça o Projeto <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-foreground text-foreground hover:bg-foreground/10">
              <Link to="/artesanato">Ver Artesanato</Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${sectionBg1})` }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Sobre o Projeto <span className="text-primary">AWIRE DIGITAL</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">O que é</h3>
              <p className="text-muted-foreground">
                Um projeto de extensão do Instituto Federal do Tocantins (IFTO) que promove a inclusão digital nas comunidades indígenas da Ilha do Bananal, valorizando a cultura local e fortalecendo a identidade indígena.
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Por que surgiu</h3>
              <p className="text-muted-foreground">
                Para reduzir a exclusão digital e social das aldeias indígenas Canoanã e Txuiri, promovendo o acesso à tecnologia e o fortalecimento cultural.
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Aldeias atendidas</h3>
              <p className="text-muted-foreground">
                Canoanã e Txuiri, localizadas na Ilha do Bananal, maior ilha fluvial do mundo.
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold text-foreground mb-3">Objetivos</h3>
              <p className="text-muted-foreground">
                Inclusão digital das comunidades indígenas e valorização da cultura por meio da arte, educação e comunicação.
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift md:col-span-2">
              <h3 className="text-xl font-bold text-foreground mb-3">Como as ações são desenvolvidas</h3>
              <p className="text-muted-foreground">
                Por meio de oficinas de capacitação digital, produção de materiais educativos e culturais, e atividades que envolvem a participação ativa das comunidades.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Onde <span className="text-primary">Atuamos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ilha do Bananal - A maior ilha fluvial do mundo
            </p>
          </div>

          <div className="bg-card rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921648.5742886276!2d-51.85567339999999!3d-11.2436394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9393e0a1f3c1c7d1%3A0x5e5f5e5e5e5e5e5e!2sIlha%20do%20Bananal!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa da Ilha do Bananal"
            />
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section id="participantes" className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${sectionBg2})` }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossa <span className="text-primary">Equipe</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {participants.map((participant, index) => (
              <Card
                key={index}
                className="p-6 bg-card/80 backdrop-blur-sm border-border hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1 text-center">{participant.name}</h3>
                <p className="text-sm text-primary mb-1 text-center">{participant.role}</p>
                <p className="text-xs text-muted-foreground mb-3 text-center">{participant.institution}</p>
                <p className="text-sm text-muted-foreground text-center">{participant.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Indigenous Art Section */}
      <section id="arte" className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${sectionBg3})` }}
        />
        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Arte <span className="text-primary">Indígena</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground mb-12">
              <p>
                A arte indígena é uma expressão fundamental da cultura e identidade dos povos originários. Cada peça carrega histórias, símbolos e significados que atravessam gerações.
              </p>
              <p>
                O projeto AWIRE DIGITAL valoriza essa arte, especialmente os artesanatos produzidos pelas comunidades das aldeias Canoanã e Txuiri, conectando artesãos com apreciadores de arte autêntica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {artImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer group animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setLightboxImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-foreground font-semibold">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/artesanato">
                Ver Galeria de Artesanato <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section id="fotos" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Galeria de <span className="text-primary">Fotos</span>
            </h2>
            <p className="text-xl text-muted-foreground">Momentos do projeto registrados</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {[sectionBg1, sectionBg2, sectionBg3, heroBackground, cocar, colar, pulseira, sectionBg1].map((img, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover-lift"
                onClick={() => setLightboxImage(img)}
              >
                <img
                  src={img}
                  alt={`Foto do projeto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/fotos">
                Ver Galeria Completa <Camera className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              O que dizem sobre o <span className="text-primary">projeto</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="p-8 bg-card/80 backdrop-blur-sm border-border hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl text-primary mb-4">"</div>
                <p className="text-foreground mb-6 italic">{testimonial.quote}</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Entre em <span className="text-primary">Contato</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center bg-card border-border">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground">awiredigital@gmail.com</p>
            </Card>

            <Card className="p-6 text-center bg-card border-border">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">WhatsApp</h3>
              <p className="text-muted-foreground">+55 (63) 99274-7396</p>
            </Card>

            <Card className="p-6 text-center bg-card border-border">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Horário</h3>
              <p className="text-muted-foreground">Segunda - Sexta: 8h às 18h</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-background/80" />
        
        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Faça Parte do <span className="text-primary">AWIRE DIGITAL</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Você pode contribuir para o fortalecimento da inclusão digital e valorização da cultura indígena. Seja voluntário ou apoie nosso projeto!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href="https://wa.me/5563992747396" target="_blank" rel="noopener noreferrer">
              Quero ser voluntário <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default Index;
