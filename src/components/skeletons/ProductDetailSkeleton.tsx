import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Gallery Skeleton */}
      <div>
        <Skeleton className="aspect-square w-full rounded-lg mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>

        {/* Artisan Card Skeleton */}
        <Card className="p-6 bg-card border-border">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>

        {/* Description Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Button Skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-14" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
