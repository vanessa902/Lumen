import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IMAGES = [
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png', bg: '#F4845F', panel: '#F79B7F' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png', bg: '#6BBF7A', panel: '#85CC92' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png', bg: '#E882B4', panel: '#ED9DC4' },
  { src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png', bg: '#6EB5FF', panel: '#8DC4FF' },
]

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

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating.current) return
    isAnimating.current = true
    setActiveIndex((prev) =>
      direction === 'next' ? (prev + 1) % 4 : (prev + 3) % 4,
    )
    window.setTimeout(() => {
      isAnimating.current = false
    }, 650)
  }

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
        backgroundColor: IMAGES[activeIndex].bg,
        transition: `background-color 650ms ${EASE}`,
        fontFamily: 'Inter, sans-serif',
      }}
      className="relative w-full overflow-hidden"
    >
      <div style={{ height: '100vh', overflow: 'hidden' }} className="relative w-full">
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

        {/* 2. Giant ghost text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 2, top: '18%' }}
        >
          <span
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(90px, 28vw, 380px)',
              fontWeight: 900,
              color: '#ffffff',
              opacity: 1,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            3D SHAPE
          </span>
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
            return (
              <div
                key={item.src}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transition: `transform 650ms ${EASE}, filter 650ms ${EASE}, opacity 650ms ${EASE}, left 650ms ${EASE}`,
                  willChange: 'transform, filter, opacity',
                  ...styleForRole(role),
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
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
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
          <div className="flex items-center gap-3">
            <NavButton onClick={() => navigate('prev')} label="Previous">
              <ArrowLeft size={26} strokeWidth={2.25} color="#ffffff" />
            </NavButton>
            <NavButton onClick={() => navigate('next')} label="Next">
              <ArrowRight size={26} strokeWidth={2.25} color="#ffffff" />
            </NavButton>
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

function NavButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center rounded-full w-12 h-12 sm:w-16 sm:h-16"
      style={{
        backgroundColor: 'transparent',
        border: '2px solid #ffffff',
        transition: 'transform 150ms, background-color 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)'
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {children}
    </button>
  )
}
