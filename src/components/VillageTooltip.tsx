import { useState } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface VillageTooltipProps {
  villageName: string;
  className?: string;
}

// Informações culturais sobre as aldeias
const villageInfo: Record<string, string> = {
  "Canoanã": "A aldeia Canoanã está localizada na Ilha do Bananal, maior ilha fluvial do mundo. É uma das comunidades do povo Javaé, conhecidos por sua rica tradição em artesanato e cerâmica.",
  "Txuiri": "A aldeia Txuiri faz parte do território Javaé na Ilha do Bananal, Tocantins. Seus artesãos preservam técnicas ancestrais de cestaria e adornos tradicionais.",
  "São João": "A comunidade São João mantém viva a cultura indígena através do artesanato, sendo conhecida pela produção de peças em cerâmica e fibras naturais.",
  "Boto Velho": "Localizada às margens do Rio Araguaia, a aldeia Boto Velho é conhecida pela preservação das tradições Karajá e produção de artesanato autêntico.",
  "Santa Isabel": "A aldeia Santa Isabel abriga artesãos que perpetuam a arte tradicional indígena, criando peças únicas que contam a história de seu povo.",
  "Macaúba": "A comunidade Macaúba destaca-se pela produção artesanal que reflete a conexão profunda do povo indígena com a natureza da Ilha do Bananal."
};

const defaultInfo = "Esta aldeia faz parte das comunidades indígenas da região da Ilha do Bananal, preservando tradições culturais através do artesanato.";

const VillageTooltip = ({ villageName, className = "" }: VillageTooltipProps) => {
  const [open, setOpen] = useState(false);
  const info = villageInfo[villageName] || defaultInfo;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className={`inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer ${className}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <span>{villageName}</span>
          <Info className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-4 bg-card border-border text-sm"
        side="top"
        align="start"
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Aldeia {villageName}</h4>
          <p className="text-muted-foreground leading-relaxed">{info}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VillageTooltip;
