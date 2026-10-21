import { assets } from "@/lib/design/assets";

export function LeafBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        backgroundColor: "var(--color-canvas)",
        backgroundImage: `url("https://ik.imagekit.io/rgbcpayfx/New%20Project%203%20_1691533_.jpg?updatedAt=1792544722084")`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
