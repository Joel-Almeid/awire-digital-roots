import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  image: string;
  alt?: string;
  onClose: () => void;
}

const Lightbox = ({ image, alt = "", onClose }: LightboxProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </Button>

      <img
        src={image}
        alt={alt}
        className="max-w-full max-h-full object-contain animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
