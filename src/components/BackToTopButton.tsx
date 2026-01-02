import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={
        "fixed left-1/2 -translate-x-1/2 bottom-8 z-40 transition-opacity duration-300 " +
        (visible ? "opacity-100 animate-fade-in" : "opacity-0 pointer-events-none")
      }
    >
      <Button
        onClick={handleClick}
        variant="outline"
        size="icon"
        className="h-10 w-10 md:h-11 md:w-11 rounded-full border-border/40 bg-card/80 backdrop-blur hover:bg-card shadow-lg scale-[0.85] md:scale-100"
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default BackToTopButton;
