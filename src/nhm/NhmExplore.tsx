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
  // Typewriter: transcribe the heading once the section scrolls into view.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const inView = useInView(headingRef, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= HEADING.length) {
          clearInterval(id)
          return c
        }
        return c + 1
      })
    }, 32)
    return () => clearInterval(id)
  }, [inView])

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

      {/* 2D. Dashboard mockup: rises into this white space and its lower edge
          is tucked behind the black section below (which has a higher z-index). */}
      <div className="h-[180px] sm:h-[260px] md:h-[340px]" />
      <img
        src={DASHBOARD}
        alt="Lumentrack dashboard"
        draggable={false}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[min(1200px,95vw)] z-0 select-none pointer-events-none rounded-b-[28px]"
      />

      {/* 2E. Bottom text */}
      <div className="absolute bottom-0 inset-x-0 flex justify-between px-8 md:px-16 pb-8 md:pb-12 pointer-events-none">
        <span className="hidden md:block text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
          We don't just tell stories.
        </span>
        <span className="hidden md:block text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium">
          Paleontology (C) 2026
        </span>
      </div>
    </section>
  )
}
