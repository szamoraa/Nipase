/** Vimeo background-mode embed — autoplay, muted, looped, no controls. */
const VIMEO_ID = "1193786975";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-[60px] pt-[60px] pb-[45px] md:px-[238px]">

      {/* Video hero — viewport-centred, min 80px gap from fixed anchors */}
      <div className="flex flex-1 items-start justify-center">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/3", maxWidth: "min(946px, max(200px, calc(100vw - 636px)))" }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${VIMEO_ID}?background=1&quality=1080p&autopause=0&app_id=58479`}
            className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)]"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Nipase hero"
          />
        </div>
      </div>

      {/* SS26 spinning wheel — access point to shop */}
      <div className="flex justify-center py-28">
        <a href="/shop/ss26" aria-label="Shop SS26" className="group block outline-none">
          <div
            className="relative"
            style={{
              width: "clamp(300px, 40vw, 640px)",
              height: "clamp(300px, 40vw, 640px)",
              animation: "spin-wheel 28s linear infinite",
              willChange: "transform",
            }}
          >
            {[0, 45, 90, 135].map((angle) => (
              <div
                key={angle}
                className="absolute inset-0 flex items-center justify-between"
                style={{ transform: `rotate(${angle}deg)`, padding: "clamp(4px, 0.6vw, 8px)" }}
              >
                <div
                  className="shrink-0 overflow-hidden rounded-[clamp(14px,1.8vw,24px)] bg-[#000002] transition-opacity duration-500 group-hover:opacity-80"
                  style={{ width: "clamp(80px, 10vw, 130px)", height: "clamp(70px, 8.75vw, 113px)" }}
                />
                <div
                  className="shrink-0 overflow-hidden rounded-[clamp(14px,1.8vw,24px)] bg-[#000002] transition-opacity duration-500 group-hover:opacity-80"
                  style={{ width: "clamp(80px, 10vw, 130px)", height: "clamp(70px, 8.75vw, 113px)" }}
                />
              </div>
            ))}
          </div>
        </a>
      </div>
    </div>
  );
}
