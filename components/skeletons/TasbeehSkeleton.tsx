import { Skeleton } from "../ui/Skeleton";

export function TasbeehSkeleton() {
  return (
    <div className="relative min-h-dvh pb-32 px-4 pt-6">
      <div className="flex items-center justify-between pb-2">
        <Skeleton width={100} height={12} radius={3} />
        <Skeleton width={32} height={32} radius={16} />
      </div>

      <div className="mx-auto mb-3 flex flex-col items-center gap-2">
        <Skeleton width={160} height={24} radius={4} />
        <Skeleton width={120} height={16} radius={4} />
      </div>

      <div className="relative mx-auto mb-4 flex items-center justify-center">
        <Skeleton width={320} height={320} radius={160} />
      </div>

      <div className="mx-4 mb-6 flex justify-center gap-2">
        <Skeleton width={60} height={32} radius={16} />
        <Skeleton width={60} height={32} radius={16} />
        <Skeleton width={80} height={32} radius={16} />
      </div>
    </div>
  );
}