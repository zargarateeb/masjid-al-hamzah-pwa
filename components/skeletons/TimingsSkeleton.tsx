import { Skeleton } from "../ui/Skeleton";

export function TimingsSkeleton() {
  return (
    <div className="relative min-h-dvh pb-32 px-4 pt-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton width={200} height={30} radius={6} />
        <Skeleton width={140} height={12} radius={4} />
      </div>

      <div className="mx-4 mt-5 flex justify-center">
        <Skeleton width="100%" height={56} radius={28} />
      </div>

      <div className="relative mt-6 h-[200px]">
        <div className="absolute inset-x-4 bottom-0 flex justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton width={38} height={38} radius={19} />
              <Skeleton width={28} height={10} radius={3} />
              <Skeleton width={36} height={10} radius={3} />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-5">
        <Skeleton width="100%" height={70} radius={20} />
      </div>

      <div className="mx-4 mt-5">
        <Skeleton width="100%" height={80} radius={20} />
      </div>

      <div className="mx-4 mt-6 space-y-3">
        <Skeleton width={180} height={20} radius={4} className="mb-2" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width="100%" height={130} radius={22} />
        ))}
      </div>
    </div>
  );
}