import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AdminProductCardSkeleton = () => {
  return (
    <Card className="bg-card border-border/10 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-10" />
        </div>
      </div>
    </Card>
  );
};

export default AdminProductCardSkeleton;
