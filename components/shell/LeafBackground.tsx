import { assets } from "@/lib/design/assets";

export function LeafBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundColor: "var(--color-canvas)",
        backgroundImage: `url(${assets.leaves})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}