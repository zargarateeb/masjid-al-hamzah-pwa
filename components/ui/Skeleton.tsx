export function Skeleton({
  width = "100%",
  height = 16,
  radius = 8,
  className = "",
}: {
  width?: string | number;
  height?: string | number;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, #efe9dd 0%, #f7f2e8 50%, #efe9dd 100%)",
        backgroundSize: "200% 100%",
        animation: "skeletonShimmer 1.6s linear infinite",
      }}
    >
      <style>{`
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}