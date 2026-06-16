import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
// Imported (not /public) so Vite fingerprints the filename and the browser
// never serves a stale cached image after a swap.
import BG_IMAGE_1 from './hero-base.jpg'
import BG_IMAGE_2 from './hero-reveal.jpg'

const SPOTLIGHT_R = 260

// Lumentrack wordmark (replaces the Lithos logo).
const LUMENTRACK_LOGO = import.meta.env.BASE_URL + 'Group.svg'

// Reveals BG_IMAGE_2 only inside a soft glowing circle that trails the cursor,
// using a canvas-drawn radial gradient as a CSS mask on the reveal layer.
function RevealLayer({
  image,
  cursorX,
  cursorY,
}: {
  image: string
  cursorX: number
  cursorY: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mask, setMask] = useState<string | undefined>()

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const resize = () => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, c.width, c.height)
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,1)')
    g.addColorStop(0.6, 'rgba(255,255,255,0.75)')
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)')
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2)
    ctx.fill()
    setMask(c.toDataURL())
  }, [cursorX, cursorY])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url("${image}")`,
          WebkitMaskImage: mask ? `url(${mask})` : undefined,
          maskImage: mask ? `url(${mask})` : undefined,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
        }}
      />
    </>
  )
}

export default function LithosHero() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 })
  const mouse = useRef({ x: -999, y: -999 })
  const smooth = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)
    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1
      setCursorPos({ x: smooth.current.x, y: smooth.current.y })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const navItems = ['Features', 'Integrations', 'About', 'Contact Us']

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Fixed navigation over the hero */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <img src={LUMENTRACK_LOGO} alt="Lumentrack" draggable={false} className="h-5 w-auto" />
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/20">
            Home
          </button>
          {navItems.map((item) => (
            <button
              key={item}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100">
          Get Started
        </button>
        <button className="md:hidden text-white" aria-label="Open menu">
          <Menu size={26} />
        </button>
      </nav>

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: '100dvh' }}
      >
        {/* 1. Base image */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
        />

        {/* 2. Cursor-spotlight reveal layer */}
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* 3. Heading */}
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95] uppercase">
            <span
              className="block text-[2.43rem] sm:text-[3.645rem] md:text-[4.86rem] hero-anim hero-reveal"
              style={{
                fontFamily: "'Haffer XH', sans-serif",
                fontWeight: 400,
                letterSpacing: '-0.04em',
                animationDelay: '0.25s',
              }}
            >
              One Platform.
            </span>
            <span
              className="block text-[2.43rem] sm:text-[3.645rem] md:text-[4.86rem] -mt-1 hero-anim hero-reveal"
              style={{
                fontFamily: "'Haffer XH', sans-serif",
                fontWeight: 600,
                letterSpacing: '-0.05em',
                animationDelay: '0.42s',
              }}
            >
              Endless Possibilities.
            </span>
          </h1>
        </div>

        {/* 4. Bottom-left paragraph */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            Lumentrack unifies CRM, proposal design, production planning, commissions, scheduling,
            and operations into one streamlined system.
          </p>
        </div>

        {/* 5. Bottom-right block */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50 flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Power Your Entire Operation
            <br />
            From a Single Platform
          </p>
          <button className="bg-[#419EFF] hover:bg-[#2f8be8] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#419EFF]/30">
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}
