import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import PolygonSection from './PolygonSection'
import SuteraSection from './SuteraSection'

// Local character images uploaded to /public. Using runtime paths (not
// imports) so the build succeeds even before the files are added.
const SOLAR_SRC = import.meta.env.BASE_URL + 'solar-panel.png'
const CHAR2_SRC = import.meta.env.BASE_URL + 'character-2.png'
// Lumentrack wordmark shown top-left on every slide.
const LOGO_SRC = import.meta.env.BASE_URL + 'Group.svg'

// Slide 1 = the SUTÉRA section (no carousel character). Slide 2 = laptop,
// slide 3 = text only, slide 4 = solar panel.
const IMAGES = [
  { src: SOLAR_SRC, bg: '#04060d', panel: '#04060d' },
  { src: CHAR2_SRC, bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: SOLAR_SRC, bg: '#6EB5FF', panel: '#8DC4FF' },
]

// Giant background headline per slide. Slide 1 is the SUTÉRA section, slide 4
// shows the solar panel — both without a headline.
const TITLES = ['', 'One platform.', 'Every part of your business.', '']

const EASE = 'cubic-bezier(0.4,0,0.2,1)'

// Section 2 mockup: number of scroll steps that zoom it in before the next
// scroll advances to the following section.
const ZOOM_MAX = 3

const GRAIN_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>" +
      "<filter id='n'>" +
      "<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/>" +
      '</filter>' +
      "<rect width='100%' height='100%' filter='url(#n)' opacity='0.08'/>" +
      '</svg>',
  )

type Role = 'center' | 'left' | 'right' | 'back'

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false,
  )
  // Cursor-driven tilt for the centered character
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  // Section 2 mockup zoom level (0..ZOOM_MAX)
  const [zoom, setZoom] = useState(0)
  // 'hero' = the scroll-jacked carousel, 'polygon' = the section below it.
  const [phase, setPhase] = useState<'hero' | 'polygon'>('hero')
  // Drives the blur + fade-to-black overlay between phases.
  const [transitioning, setTransitioning] = useState(false)
  const isAnimating = useRef(false)
  // Refs mirror state so the scroll handler always reads current values.
  const activeRef = useRef(0)
  const zoomRef = useRef(0)
  const phaseRef = useRef<'hero' | 'polygon'>('hero')
  activeRef.current = activeIndex
  zoomRef.current = zoom
  phaseRef.current = phase

  // Preload all images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image()
      img.src = item.src
    })
  }, [])

  // Track viewport width for mobile breakpoint
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Move to the previous/next section. Entering section 2 starts zoomed out
  // when arriving from above, or fully zoomed in when arriving from below.
  const go = useCallback((direction: 'next' | 'prev') => {
    isAnimating.current = true
    setActiveIndex((prev) => {
      const next = direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4
      activeRef.current = next
      const z = next === 1 ? (direction === 'next' ? 0 : ZOOM_MAX) : 0
      zoomRef.current = z
      setZoom(z)
      return next
    })
    window.setTimeout(() => {
      isAnimating.current = false
    }, 650)
  }, [])

  // Blur + fade-to-black transition between the hero and the Polygon section.
  const transition = useCallback((to: 'hero' | 'polygon') => {
    isAnimating.current = true
    setTransitioning(true)
    window.setTimeout(() => {
      setPhase(to)
      phaseRef.current = to
      const sc = document.getElementById('poly-scroller')
      if (sc) sc.scrollTop = 0
      setTransitioning(false)
      window.setTimeout(() => (isAnimating.current = false), 560)
    }, 520)
  }, [])

  // Hero-phase scroll: section 2 zooms the mockup through ZOOM_MAX steps before
  // advancing; the last section scrolls down into the Polygon section.
  const handleHeroScroll = useCallback(
    (dir: 'down' | 'up') => {
      if (isAnimating.current) return
      const ai = activeRef.current
      const z = zoomRef.current
      if (ai === 1) {
        if (dir === 'down' && z < ZOOM_MAX) {
          isAnimating.current = true
          zoomRef.current = z + 1
          setZoom(z + 1)
          window.setTimeout(() => (isAnimating.current = false), 220)
          return
        }
        if (dir === 'up' && z > 0) {
          isAnimating.current = true
          zoomRef.current = z - 1
          setZoom(z - 1)
          window.setTimeout(() => (isAnimating.current = false), 220)
          return
        }
      }
      if (dir === 'down') {
        if (ai < 3) go('next')
        else transition('polygon')
      } else if (ai > 0) {
        go('prev')
      }
    },
    [go, transition],
  )

  // Drive sections with the scroll wheel / trackpad and vertical swipes.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return
      if (phaseRef.current === 'polygon') {
        // Native scroll inside the section; only intercept an up-scroll at the
        // very top to return to the hero.
        const sc = document.getElementById('poly-scroller')
        if (e.deltaY < 0 && (sc?.scrollTop ?? 0) <= 2 && !isAnimating.current) {
          e.preventDefault()
          transition('hero')
        }
        return
      }
      e.preventDefault()
      handleHeroScroll(e.deltaY > 0 ? 'down' : 'up')
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartY - e.touches[0].clientY
      if (Math.abs(delta) < 40) return
      if (phaseRef.current === 'polygon') {
        const sc = document.getElementById('poly-scroller')
        if (delta < 0 && (sc?.scrollTop ?? 0) <= 2 && !isAnimating.current) {
          e.preventDefault()
          transition('hero')
        }
        return
      }
      e.preventDefault()
      handleHeroScroll(delta > 0 ? 'down' : 'up')
      touchStartY = e.touches[0].clientY
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [handleHeroScroll, transition])

  const center = activeIndex
  const left = (activeIndex + 3) % 4
  const right = (activeIndex + 1) % 4
  // back = (activeIndex + 2) % 4 — any index that is not center/left/right

  const roleFor = (index: number): Role => {
    if (index === center) return 'center'
    if (index === left) return 'left'
    if (index === right) return 'right'
    return 'back'
  }

  const styleForRole = (role: Role): CSSProperties => {
    switch (role) {
      case 'center':
        return {
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: 'blur(0px)',
          opacity: 1,
          zIndex: 20,
          left: '50%',
          height: isMobile ? '60%' : '92%',
          bottom: isMobile ? '22%' : 0,
        }
      case 'left':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '20%' : '30%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        }
      case 'right':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(2px)',
          opacity: 0.85,
          zIndex: 10,
          left: isMobile ? '80%' : '70%',
          height: isMobile ? '16%' : '28%',
          bottom: isMobile ? '32%' : '12%',
        }
      case 'back':
        return {
          transform: 'translateX(-50%) scale(1)',
          filter: 'blur(4px)',
          opacity: 1,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '13%' : '22%',
          bottom: isMobile ? '32%' : '12%',
        }
    }
  }

  return (
    <>
    <div
      style={{
        backgroundColor: '#04050c',
        fontFamily: 'Inter, sans-serif',
      }}
      className="relative w-full overflow-hidden"
    >
      <div style={{ height: '100vh', overflow: 'hidden' }} className="relative w-full">
        {/* 0. Per-slide background layers (crossfade) */}
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          {IMAGES.map((_, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transition: `opacity 650ms ${EASE}`,
              }}
            >
              {renderBackground(i)}
            </div>
          ))}
        </div>

        {/* Shared blueprint grid behind every slider */}
        <div className="su-grid" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

        {/* 1. Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* 2. Giant ghost text / logo (per-slide headline) */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none px-4"
          // Section 3 ("Every part of your business.") sits a bit below center.
          style={{ zIndex: 2, top: activeIndex === 2 ? '38%' : '18%' }}
        >
          <span
            key={activeIndex}
            style={{
              fontFamily: "'Haffer XH', sans-serif",
              // Section 3's headline is 40% smaller than the other slides.
              fontSize:
                activeIndex === 2
                  ? 'clamp(26px, 6.9vw, 120px)'
                  : 'clamp(44px, 11.5vw, 200px)',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 1,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              // Short headlines stay on a single line; long copy wraps.
              whiteSpace: TITLES[activeIndex].length <= 14 ? 'nowrap' : 'normal',
              maxWidth: TITLES[activeIndex].length <= 14 ? 'none' : '92vw',
              animation: `th-fade 650ms ${EASE}`,
            }}
          >
            {TITLES[activeIndex]}
          </span>
        </div>

        {/* 3. Top-left Lumentrack logo */}
        <img
          src={LOGO_SRC}
          alt="Lumentrack"
          draggable={false}
          className="absolute left-4 sm:left-10"
          style={{ top: 30, height: 18, width: 'auto', zIndex: 60, opacity: 0.95 }}
        />

        {/* 4. Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = roleFor(index)
            const isCenter = role === 'center'

            // Only the active section's character is rendered. No rotating or
            // blurred side/back figures appear during scroll — each section
            // just shows its own element.
            if (!isCenter) return null

            // Special treatment for slide 2's laptop mockup: sits below the
            // headline, cropped at the hero's bottom edge, rising from below
            // while growing, with a moving blue light.
            if (index === 1) {
              return (
                <div
                  key={item.src}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: isMobile ? '24%' : '22%',
                    width: isMobile ? '90vw' : 'min(54vw, 760px)',
                    zIndex: 20,
                  }}
                >
                  <div key={`rise-${activeIndex === 1}`} className="th-laptop-rise">
                    <div
                      style={{
                        transform: `scale(${1 + zoom * 0.34})`,
                        transformOrigin: 'center 40%',
                        transition: `transform 280ms ${EASE}`,
                      }}
                    >
                      <div className="th-laptop-glow" />
                      <img
                        src={item.src}
                        alt=""
                        draggable={false}
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          display: 'block',
                          width: '100%',
                          height: 'auto',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            }

            // Slide 1 is the SUTÉRA section and slide 3 is text only — neither
            // renders a carousel character.
            if (index === 0 || index === 2) return null

            // The solar panel is rendered 20% smaller.
            const baseScale = item.src === SOLAR_SRC ? 0.8 : 1
            const tiltStr = ` perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            return (
              <div
                key={item.src}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  const px = (e.clientX - r.left) / r.width - 0.5
                  const py = (e.clientY - r.top) / r.height - 0.5
                  setTilt({ rx: -py * 16, ry: px * 16 })
                }}
                onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition: `transform 650ms ${EASE}, filter 650ms ${EASE}, left 650ms ${EASE}`,
                  willChange: 'transform, filter',
                  ...styleForRole(role),
                }}
              >
                {/* Float wrapper: gentle continuous bob */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    animation: `th-float ${4 + index * 0.6}s ease-in-out infinite`,
                    willChange: 'transform',
                  }}
                >
                  <img
                    src={item.src}
                    alt=""
                    draggable={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'bottom center',
                      transform: `scale(${baseScale})${tiltStr}`,
                      transition: 'transform 200ms ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* 5. Centered scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-12"
          style={{ zIndex: 60 }}
        >
          <div
            className="flex flex-col items-center gap-2 uppercase text-xs font-semibold select-none"
            style={{ color: '#ffffff', opacity: 0.9, letterSpacing: '0.18em' }}
          >
            Scroll
            <ChevronDown
              size={18}
              strokeWidth={2.25}
              style={{ animation: 'toonhub-bounce 1.6s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* Slide 1 = the SUTÉRA section (covers the TOONHUB chrome) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 70,
            opacity: activeIndex === 0 ? 1 : 0,
            pointerEvents: activeIndex === 0 ? 'auto' : 'none',
            transition: `opacity 650ms ${EASE}`,
          }}
        >
          <SuteraSection />
        </div>
      </div>
    </div>

    {/* The section that follows below the hero */}
    {phase === 'polygon' && (
      <div
        id="poly-scroller"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          overflowY: 'auto',
          background: '#04060d',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <PolygonSection />
      </div>
    )}

    {/* Blur + fade-to-black transition overlay */}
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: '#000',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        opacity: transitioning ? 1 : 0,
        transition: 'opacity 500ms ease',
        pointerEvents: transitioning ? 'auto' : 'none',
      }}
    />
    </>
  )
}

// Per-slide backgrounds:
//  0 -> aurora gradient (reproduced with CSS)
//  1 -> solid #0F0D13
//  2 -> blue light arcs (uploaded image 1, recreated in CSS)
//  3 -> blue plasma capsule (uploaded image 2, recreated in CSS, animated)
function renderBackground(index: number) {
  switch (index) {
    case 0:
      return <AuroraBackground />
    case 2:
      return <ArcsBackground />
    case 3:
      return <PlasmaBackground />
    case 1:
    default:
      return <div className="absolute inset-0" style={{ backgroundColor: '#0F0D13' }} />
  }
}

// Image 1 — concentric blue light arcs sweeping across a black field. Built
// from large discs positioned above the frame so only their glowing lower edge
// shows, plus a soft central glow.
function ArcsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#020308' }}>
      <div className="th-arc-glow" />
      <div className="th-arc th-arc-1" />
      <div className="th-arc th-arc-2" />
      <div className="th-arc th-arc-3" />
      {/* Fast electric light racing side to side along the arcs */}
      <div className="th-arc-bolt th-arc-bolt-a" />
      <div className="th-arc-bolt th-arc-bolt-b" />
    </div>
  )
}

// Image 2 — a glowing blue plasma capsule on black, drifting/rotating slowly.
function PlasmaBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#010207' }}>
      <div className="th-plasma-aura" />
      <div className="th-plasma-spin">
        <div className="th-plasma-body" />
        <div className="th-plasma-ring th-plasma-ring-a" />
        <div className="th-plasma-ring th-plasma-ring-b" />
        <div className="th-plasma-core" />
      </div>
    </div>
  )
}

// Reproduces the dark navy-to-black image with a bright blue glow top-right
// using soft radial "blobs". When `animated`, the blobs slowly drift/scale so
// the gradient reads like liquid in motion.
function AuroraBackground({ animated = false }: { animated?: boolean }) {
  const a = animated ? ' th-anim' : ''
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#04050c' }}>
      <div className={'th-blob th-blob-glow' + a} />
      <div className={'th-blob th-blob-royal' + a} />
      <div className={'th-blob th-blob-streak' + a} />
    </div>
  )
}
