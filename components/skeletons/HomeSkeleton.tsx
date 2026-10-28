import { Skeleton } from "../ui/Skeleton";

export function HomeSkeleton() {
  return (
    <main className="pb-32">
      <div className="relative px-2 pt-[100px] pb-6">
        <div className="space-y-2">
          <Skeleton width={140} height={14} radius={3} />
          <Skeleton width={180} height={42} radius={6} />
          <Skeleton width={220} height={12} radius={3} />
          <Skeleton width={100} height={10} radius={3} />
        </div>
        <div className="mt-4 flex gap-3">
          <Skeleton width="55%" height={42} radius={16} />
          <Skeleton width="40%" height={42} radius={16} />
        </div>
      </div>

      <div className="relative z-10 -mt-16 px-2">
        <Skeleton width="100%" height={200} radius={28} />

        <div className="mt-6 flex justify-between px-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton width={40} height={40} radius={20} />
              <Skeleton width={30} height={10} radius={3} />
              <Skeleton width={36} height={10} radius={3} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="100%" height={65} radius={20} />
          ))}
        </div>

        <div className="mt-6 px-2 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton width={180} height={22} radius={4} />
            <Skeleton width={60} height={14} radius={3} />
          </div>
          <Skeleton width="100%" height={100} radius={22} />
        </div>
      </div>
    </main>
  );
}