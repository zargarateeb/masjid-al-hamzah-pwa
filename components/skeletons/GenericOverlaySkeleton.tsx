import { Skeleton } from "../ui/Skeleton";

export function GenericOverlaySkeleton() {
  return (
    <div className="space-y-3 px-4 pt-4">
      <Skeleton width="100%" height={80} radius={20} />
      <Skeleton width="100%" height={80} radius={20} />
      <Skeleton width="100%" height={80} radius={20} />
      <Skeleton width="100%" height={80} radius={20} />
      <Skeleton width="100%" height={80} radius={20} />
    </div>
  );
}