import { VimeoPlayer } from "@/components/VimeoPlayer";

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      {/* Section 1 */}
      <div className="flex flex-col items-center gap-[18px] px-[20px] pt-[80px] pb-[80px] md:pl-[238px] md:pr-[calc(60px+clamp(40px,3.5vw,54px)+30px)] md:pt-[60px]">

        <div className="w-full max-w-[680px]">
          <VimeoPlayer videoId={1193786974} />
        </div>

        <div className="flex w-full max-w-[680px] flex-col gap-[40px] font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light text-[#000002] md:gap-[60px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-wrap gap-[3px]">
              <span>Based in Canada.</span>
              <span>Basé a Canada.</span>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              <span>Rooted in more than one place.</span>
              <span>Enraciné dans plus d&apos;un endroit.</span>
            </div>
          </div>
          <div className="flex flex-col gap-[40px] md:flex-row md:gap-[65px]">
            <div className="space-y-[1em] md:flex-1">
              <p>NIPASE calls Edmonton, Alberta home. English dominates here, but Canada was built on two official languages, and the people who make this country what it is bring many more than that.</p>
              <p>We sat with two friends – both bilingual, both shaped by more than one culture. We asked them what centred in the richness of one&apos;s being means to them personally. And what it means to live, think, and feel in more than one language.</p>
              <p>Their answers reminded us why we started this.</p>
              <p>Free domestic shipping on first drop orders to major areas across Canada.</p>
            </div>
            <div className="space-y-[1em] md:flex-1">
              <p>NIPASE considère Edmonton, en Alberta, comme chez soi. L&apos;anglais y domine, mais le Canada s&apos;est construit autour de deux langues officielles, et les personnes qui donnent vie à ce pays en portent bien davantage.</p>
              <p>Nous avons rencontré deux amis — tous deux bilingues, tous deux façonnés par plus d&apos;une culture. Nous leur avons demandé ce que signifie, pour eux personnellement, être ancré dans la richesse de son identité. Et ce que cela veut dire de vivre, de penser et de ressentir dans plus d&apos;une langue.</p>
              <p>Leurs réponses nous ont rappelé pourquoi nous avons lancé ce projet.</p>
              <p>Livraison gratuite partout au Canada dans les grandes zones urbaines pour les commandes de notre première collection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 600px spacer */}
      <div className="h-[150px]" />

      {/* Section 2 */}
      <div className="flex flex-col items-center gap-[18px] px-[20px] pb-[80px] md:pl-[238px] md:pr-[calc(60px+clamp(40px,3.5vw,54px)+30px)]">

        <div className="w-full max-w-[680px]">
          <VimeoPlayer videoId={1193786976} />
        </div>

        <div className="flex w-full max-w-[680px] flex-col gap-[40px] font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light text-[#000002] md:gap-[60px]">
          <div className="flex flex-col gap-[8px]">
            <span>Made in India</span>
          </div>
          <div className="space-y-[1em]">
            <p>Our first drop - the Men&apos;s Linen Overshirt - is made slowly and with care in a small town in India.</p>
            <p>To honour the origins of this garment, we connected with Anirudh Peyyala, an Edmonton local with Indian roots, and asked him to share his culture and what our founding statement - centred in the richness of one&apos;s being - means to him personally.</p>
            <p>Anirudh, thank you for your openness and for bringing this to life.</p>
            <p>He is wearing the Men&apos;s Linen Overshirt in Brown - arriving Fall 2026.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
