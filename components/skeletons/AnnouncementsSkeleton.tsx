import { Skeleton } from "../ui/Skeleton";

export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-[22px] overflow-hidden">
          <Skeleton width="100%" height={160} radius={0} />
          <div className="p-5 space-y-2">
            <Skeleton width="75%" height={20} radius={4} />
            <Skeleton width="50%" height={12} radius={3} />
            <Skeleton width="100%" height={12} radius={3} />
            <Skeleton width="90%" height={12} radius={3} />
          </div>
        </div>
      ))}
    </div>
  );
}