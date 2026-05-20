/**
 * Eight-pill spinning wheel — homepage access point to /shop/ss26.
 *
 * Rotation math (per the design spec):
 *   Wheel parent : +θ          (animated 0 → 360°)
 *   Arm div      : +angle      (fixed 0 / 45 / 90 / 135°)
 *   Pill outer   : −angle      (cancels the arm)
 *   Pill inner   : −θ          (counter-spin, cancels the wheel)
 *   Total on img : 0° ✓        (image and rounded-rect stay upright)
 *
 * The component knows nothing about Shopify — it just renders whichever
 * images the parent passes in, cycling them around the 8 slots.
 */

type WheelImage = { url: string; altText?: string | null };

type Props = {
  images: readonly WheelImage[];
  /** Where the wheel links to. */
  href?: string;
  /** Accessible label for the wrapping anchor. */
  ariaLabel?: string;
};

const ARM_ANGLES = [0, 45, 90, 135] as const;
const SLOTS_PER_ARM = 2;
const TOTAL_SLOTS = ARM_ANGLES.length * SLOTS_PER_ARM; // 8

export function SpinningWheel({
  images,
  href = "/shop/ss26",
  ariaLabel = "Shop SS26",
}: Props) {
  // Distribute images across the 8 pill slots, cycling if fewer than 8.
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) =>
    images.length > 0 ? images[i % images.length] : null
  );

  return (
    <div className="flex justify-center py-28">
      <a href={href} aria-label={ariaLabel} className="group block outline-none">
        {/* Wheel parent — spins +θ */}
        <div
          className="relative"
          style={{
            width: "clamp(300px, 40vw, 640px)",
            height: "clamp(300px, 40vw, 640px)",
            animation: "spin-wheel 28s linear infinite",
            willChange: "transform",
          }}
        >
          {ARM_ANGLES.map((angle, armIdx) => {
            const leftSlot = slots[armIdx * SLOTS_PER_ARM];
            const rightSlot = slots[armIdx * SLOTS_PER_ARM + 1];
            return (
              <div
                key={angle}
                className="absolute inset-0 flex items-center justify-between"
                style={{
                  transform: `rotate(${angle}deg)`,
                  padding: "clamp(4px, 0.6vw, 8px)",
                }}
              >
                <Pill image={leftSlot} cancelArm={angle} />
                <Pill image={rightSlot} cancelArm={angle} />
              </div>
            );
          })}
        </div>
      </a>
    </div>
  );
}

function Pill({
  image,
  cancelArm,
}: {
  image: WheelImage | null;
  cancelArm: number;
}) {
  return (
    // Pill outer — cancels the arm rotation (−angle)
    <div
      className="shrink-0"
      style={{
        width: "clamp(80px, 10vw, 130px)",
        height: "clamp(70px, 8.75vw, 113px)",
        transform: `rotate(${-cancelArm}deg)`,
      }}
    >
      {/* Pill inner — counter-spins the wheel (−θ); rounded shape lives here so it stays upright */}
      <div
        className="relative h-full w-full overflow-hidden rounded-[clamp(14px,1.8vw,24px)] bg-[#000002] transition-opacity duration-500 group-hover:opacity-80"
        style={{
          animation: "counter-spin 28s linear infinite",
          willChange: "transform",
        }}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.altText ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </div>
  );
}
