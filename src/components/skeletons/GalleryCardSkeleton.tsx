import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryCardSkeleton = () => {
  return (
    <Card className="bg-card border-border/10 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );
};

export default GalleryCardSkeleton;
