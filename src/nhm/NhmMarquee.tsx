import marquee from './marquee.svg'

// Infinite marquee strip that bridges Section 3 (Collection) and the next
// section below it. Four identical copies scroll left; the animation shifts the
// track by exactly one copy (-25%) so the loop is seamless.
export default function NhmMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0a0a0a] z-30 leading-[0]">
      <div className="nhm-marquee-track flex w-max">
        {Array.from({ length: 4 }).map((_, i) => (
          <img
            key={i}
            src={marquee}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-[56px] md:h-[64px] w-auto block shrink-0 select-none pointer-events-none"
          />
        ))}
      </div>
    </div>
  )
}
