import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

// Local character images uploaded to /public. Using runtime paths (not
// imports) so the build succeeds even before the files are added.
const SOLAR_SRC = import.meta.env.BASE_URL + 'solar-panel.png'
const CHAR2_SRC = import.meta.env.BASE_URL + 'character-2.png'

// Slide 1's headline is the LUMENTRACK wordmark (SVG in /public).
const LOGO_SRC = import.meta.env.BASE_URL + 'Group.svg'

const IMAGES = [
  { src: SOLAR_SRC, bg: '#F4845F', panel: '#F79B7F' },
  { src: CHAR2_SRC, bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
]

// Giant background headline per slide. Slide 0 uses the LUMENTRACK SVG
// wordmark (handled separately); the rest use temporary copy.
const TITLES = ['', 'One platform.', 'Every part of your business.', '']

const EASE = 'cubic-bezier(0.4,0,0.2,1)'

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
  const isAnimating = useRef(false)

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

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating.current) return
    isAnimating.current = true
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4,
    )
    window.setTimeout(() => {
      isAnimating.current = false
    }, 650)
  }, [])

  // Advance the carousel with the scroll wheel / trackpad (down = next, up =
  // prev) and with vertical swipes on touch devices. The 650ms animation lock
  // inside `navigate` throttles rapid wheel/swipe events to one step at a time.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return
      e.preventDefault()
      navigate(e.deltaY > 0 ? 'next' : 'prev')
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const delta = touchStartY - e.touches[0].clientY
      if (Math.abs(delta) < 40) return
      e.preventDefault()
      navigate(delta > 0 ? 'next' : 'prev')
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
  }, [navigate])

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
          style={{ zIndex: 2, top: '18%' }}
        >
          {activeIndex === 0 ? (
            <img
              key="logo"
              src={LOGO_SRC}
              alt="LUMENTRACK"
              draggable={false}
              style={{
                width: 'min(88vw, 880px)',
                height: 'auto',
                animation: `th-fade 650ms ${EASE}`,
              }}
            />
          ) : (
            <span
              key={activeIndex}
              style={{
                fontFamily: 'Anton, sans-serif',
                fontSize: 'clamp(44px, 11.5vw, 200px)',
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
          )}
        </div>

        {/* 3. Top-left brand label */}
        <div
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase"
          style={{ zIndex: 60, color: '#ffffff', opacity: 0.9, letterSpacing: '0.18em' }}
        >
          TOONHUB
        </div>

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
              )
            }

            // Slide 3's character (index 2) is removed — that slide is text only.
            if (index === 2) return null

            // Slide 1's character (index 0) is rendered 20% smaller.
            const baseScale = index === 0 ? 0.8 : 1
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

        {/* 5. Bottom-left text + scroll hint */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{ color: '#ffffff', opacity: 0.95, letterSpacing: '0.02em' }}
          >
            TOONHUB FIGURINES
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{ color: '#ffffff', opacity: 0.85, lineHeight: 1.6 }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a vision,
            the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div
            className="flex items-center gap-2 uppercase text-xs font-semibold select-none"
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

        {/* 6. Bottom-right link */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10"
          style={{ zIndex: 60 }}
        >
          <a
            href="#"
            className="flex items-center"
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(20px, 4vw, 56px)',
              fontWeight: 400,
              color: '#ffffff',
              opacity: 0.95,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 200ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
          >
            DISCOVER IT
            <ArrowRight className="w-5 h-5 sm:w-8 sm:h-8" strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </div>
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
