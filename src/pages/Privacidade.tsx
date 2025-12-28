import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Users, Mail, ArrowLeft } from "lucide-react";

const Privacidade = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - AWIRE DIGITAL</title>
        <meta name="description" content="Política de Privacidade da plataforma AWIRE DIGITAL em conformidade com a LGPD." />
      </Helmet>

      <Navigation />

      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-12 animate-fade-in">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ir para a Página Inicial
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AWIRE DIGITAL - Em conformidade com a Lei Geral de Proteção de Dados (LGPD)
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Section 1 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
                Introdução e Controlador de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A presente Política de Privacidade regula o tratamento de dados na plataforma AWIRE DIGITAL, 
                desenvolvida por Joel Abreu Martins de Almeida em parceria com o Instituto Federal do Tocantins (IFTO). 
                O IFTO atua como <strong className="text-foreground">Controlador de Dados</strong>, conforme definido no Art. 5º, VI da LGPD, 
                sendo responsável pelas decisões referentes ao tratamento de dados pessoais.
              </p>
            </Card>

            {/* Section 2 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
                Base Legal e Coleta de Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A coleta de dados é fundamentada no consentimento do titular (Art. 7º, I da LGPD) e na execução de contrato ou procedimentos preliminares.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Tipo de Dado</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Origem</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Finalidade</th>
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Base Legal</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Identificação Pessoal</td>
                      <td className="py-3 px-4">Artesãos e Clientes</td>
                      <td className="py-3 px-4">Nome, Telefone e E-mail para cadastro e contato via WhatsApp.</td>
                      <td className="py-3 px-4">Art. 7º, I (Consentimento)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Perfil do Artesão</td>
                      <td className="py-3 px-4">Artesãos</td>
                      <td className="py-3 px-4">Foto, Aldeia e Biografia para divulgação pública dos produtos.</td>
                      <td className="py-3 px-4">Art. 7º, I (Consentimento)</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Imagens (Biométricos)</td>
                      <td className="py-3 px-4">Artesãos</td>
                      <td className="py-3 px-4">Uso da imagem para identificação e marketing cultural.</td>
                      <td className="py-3 px-4">Art. 11 (Dados Sensíveis)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Dados de Navegação</td>
                      <td className="py-3 px-4">Visitantes</td>
                      <td className="py-3 px-4">IP, cookies e tempo de permanência para análise de tráfego.</td>
                      <td className="py-3 px-4">Art. 7º, IX (Legítimo Interesse)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Section 3 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
                Armazenamento e Compartilhamento (Operadores)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Os dados são processados por operadores que garantem a segurança técnica da plataforma:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Firebase Hosting & Firestore:</strong> Armazenamento seguro de dados estruturados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Cloudinary:</strong> Processamento e otimização de imagens de mídia.</span>
                </li>
              </ul>
            </Card>

            {/* Section 4 */}
            <Card className="p-6 md:p-8 bg-card border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">4</span>
                Direitos do Titular
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Em conformidade com o Art. 18 da LGPD, o titular tem direito a:
              </p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Confirmação da existência de tratamento e acesso aos dados.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Correção de dados incompletos ou inexatos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Eliminação de dados pessoais tratados com o consentimento.</span>
                </li>
              </ul>
              <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Contato:</strong> As solicitações devem ser enviadas para{" "}
                  <a href="mailto:awiredigital@gmail.com" className="text-primary hover:underline">
                    awiredigital@gmail.com
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Privacidade;
