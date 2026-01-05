import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ArtesaoPerfilSkeleton = () => {
  return (
    <>
      {/* Profile Header Skeleton */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton className="w-40 h-40 md:w-48 md:h-48 rounded-full" />
            <div className="text-center md:text-left flex-1 space-y-4">
              <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-40 mx-auto md:mx-0" />
              <Skeleton className="h-20 w-full max-w-2xl" />
              <Skeleton className="h-12 w-64 mx-auto md:mx-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Skeleton className="h-10 w-80 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card border-border">
                <Skeleton className="aspect-square w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ArtesaoPerfilSkeleton;
