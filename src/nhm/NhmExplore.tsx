import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Bone, Dna, Gem, Leaf, BookOpen } from 'lucide-react'
import DASHBOARD from './dashboard.png'

const pills = [
  { icon: Bone, label: 'Dinosaurs' },
  { icon: Dna, label: 'Ancient Life' },
  { icon: Gem, label: 'Minerals' },
  { icon: Leaf, label: 'Fossils' },
  { icon: BookOpen, label: 'Learn More' },
]

const HEADING = 'The all-in-one operating system for contractors and service businesses.'

export default function NhmExplore() {
  // Typewriter: starts when the section scrolls into view, then loops forever —
  // types the full text, waits 5s, clears and replays.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let i = 0
    let cancelled = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      if (cancelled) return
      if (i < HEADING.length) {
        i += 1
        setCount(i)
        timer = setTimeout(tick, 32)
      } else {
        // Fully typed: hold 5s, then clear and replay.
        timer = setTimeout(() => {
          i = 0
          setCount(0)
          timer = setTimeout(tick, 500)
        }, 5000)
      }
    }
    tick()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [inView])

  // 3D mouse parallax + glass reflection on the dashboard mockup.
  const tiltRef = useRef<HTMLDivElement>(null)
  const target = useRef({ rx: 0, ry: 0, gx: 50, gy: 30 })
  const curr = useRef({ rx: 0, ry: 0, gx: 50, gy: 30 })
  const [fx, setFx] = useState({ rx: 0, ry: 0, gx: 50, gy: 30 })
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      target.current.rx = -ny * 5
      target.current.ry = nx * 7
      const el = tiltRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        target.current.gx = ((e.clientX - r.left) / r.width) * 100
        target.current.gy = ((e.clientY - r.top) / r.height) * 100
      }
    }
    window.addEventListener('mousemove', onMove)
    let raf = 0
    const loop = () => {
      const c = curr.current
      const t = target.current
      c.rx += (t.rx - c.rx) * 0.08
      c.ry += (t.ry - c.ry) * 0.08
      c.gx += (t.gx - c.gx) * 0.12
      c.gy += (t.gy - c.gy) * 0.12
      setFx({ rx: c.rx, ry: c.ry, gx: c.gx, gy: c.gy })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] text-[#111] font-sans flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
      {/* 2A. Section label */}
      <p className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12">
        <span className="text-gray-500">[ 02 ]</span>{' '}
        <span className="text-gray-900 font-bold uppercase">Explore Our World</span>
      </p>

      {/* 2B. Main heading (typewriter on scroll-in) */}
      <h2
        ref={headingRef}
        aria-label={HEADING}
        className="relative text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] text-center max-w-[1000px] px-6"
      >
        {/* Invisible full text reserves the final height (no layout shift) */}
        <span className="invisible" aria-hidden="true">
          The all-in-one operating system for
          <br className="hidden md:block" /> contractors and service businesses.
        </span>
        {/* Typed overlay */}
        <span className="absolute inset-0" aria-hidden="true">
          {HEADING.slice(0, count)}
          <span
            className="ml-1 inline-block w-[3px] md:w-[4px] bg-[#111] align-[-0.05em] animate-pulse"
            style={{ height: '0.85em' }}
          />
        </span>
      </h2>

      {/* 2C. Action pills */}
      <motion.div
        variants={{ initial: {}, animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 mb-10 md:mb-24 px-6"
      >
        {pills.map(({ icon: Icon, label }) => (
          <motion.button
            key={label}
            variants={{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }}
            type="button"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            <Icon size={14} strokeWidth={2} />
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* 2D. Dashboard mockup: rises into this white space and connects flush
          (square bottom) with the black section below. */}
      <div className="h-[180px] sm:h-[260px] md:h-[340px]" />
      {/* Perspective wrapper (positioning); inner tilts with the mouse and the
          bottom stays flush with the section below (transform-origin bottom). */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[min(1200px,95vw)] z-0 pointer-events-none select-none"
        style={{ perspective: '1400px' }}
      >
        <div
          ref={tiltRef}
          className="relative will-change-transform"
          style={{
            transform: `rotateX(${fx.rx}deg) rotateY(${fx.ry}deg)`,
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
          }}
        >
          <img src={DASHBOARD} alt="Lumentrack dashboard" draggable={false} className="block w-full" />
          {/* Glass reflection: a moving glare masked to the mockup's shape */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              WebkitMaskImage: `url(${DASHBOARD})`,
              maskImage: `url(${DASHBOARD})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              mixBlendMode: 'screen',
              background: `radial-gradient(260px circle at ${fx.gx}% ${fx.gy}%, rgba(255,255,255,0.32), rgba(255,255,255,0.06) 45%, rgba(255,255,255,0) 70%), linear-gradient(115deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.10) 49%, rgba(255,255,255,0) 56%)`,
            }}
          />
        </div>
      </div>
    </section>
  )
}
