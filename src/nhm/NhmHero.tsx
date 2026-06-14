import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Plus } from 'lucide-react'
import { HERO_VIDEO, navLinks, fadeUp, letterBlock } from './data'

// ---- NHM wordmark, built from polygons so each can slide up individually ----
const letterStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

function NhmLogo() {
  return (
    <motion.svg
      viewBox="0 0 840 100"
      className="w-full fill-[#111]"
      variants={letterStagger}
      initial="initial"
      animate="animate"
    >
      {/* N */}
      <g transform="translate(0,0)">
        {[
          '0,0 14,0 14,100 0,100',
          '200,0 214,0 214,100 200,100',
          '0,0 33,0 214,100 181,100',
        ].map((pts) => (
          <motion.polygon key={pts} points={pts} variants={letterBlock} />
        ))}
      </g>
      {/* H */}
      <g transform="translate(280,0)">
        {[
          '0,0 14,0 14,100 0,100',
          '200,0 214,0 214,100 200,100',
          '14,43 200,43 200,57 14,57',
        ].map((pts) => (
          <motion.polygon key={pts} points={pts} variants={letterBlock} />
        ))}
      </g>
      {/* M */}
      <g transform="translate(560,0)">
        {[
          '0,0 14,0 14,100 0,100',
          '266,0 280,0 280,100 266,100',
          '0,0 26,0 153,100 127,100',
          '254,0 280,0 153,100 127,100',
        ].map((pts) => (
          <motion.polygon key={pts} points={pts} variants={letterBlock} />
        ))}
      </g>
    </motion.svg>
  )
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C7 4 4 8 4 13c0 4 3 7 7 7 1 0 1-1 1-2 0-5 2-9 6-12-2 0-4 .5-6 1.5C12 4 12 3 12 2z" />
      <path d="M11 19c0-4 1-8 4-11" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M8 12c1 .5 2 .5 3 0" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M8 15c1 .5 2 .5 3 0" stroke="currentColor" strokeWidth="0.6" fill="none" />
    </svg>
  )
}

export default function NhmHero() {
  const [showVideo, setShowVideo] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowVideo(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#fcfcfc] text-[#111] font-sans">
      {/* 1D. Background video (after delay) */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            key="hero-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={HERO_VIDEO}
            />
            <div className="absolute inset-0 bg-[#fcfcfc]/35" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1A/1B. Header */}
      <motion.header
        variants={{ initial: {}, animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        initial="initial"
        animate="animate"
        className="relative z-20 pt-6 px-6 md:px-16"
      >
        <motion.h1
          variants={{ initial: { scale: 1.03 }, animate: { scale: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          className="w-full"
        >
          <NhmLogo />
        </motion.h1>

        {/* 1B. Sub-nav bar */}
        <div className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase">
          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }} className="w-[15%]">
            <p>Natura</p>
            <p>History</p>
            <p>Museum</p>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }} className="hidden md:flex w-[5%] justify-center pt-1">
            <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 md:flex-none md:w-[30%] text-gray-800 leading-relaxed font-mono normal-case tracking-[0.15em]"
          >
            <p className="hidden md:block">Exploring the story of life on earth</p>
            <p className="hidden md:block">through science, discovery</p>
            <p className="hidden md:block">and wonder.</p>
            <p className="md:hidden">Exploring the story of life on earth through science, discovery and wonder.</p>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.8, ease: 'easeOut' }} className="hidden md:flex w-[5%] justify-center pt-1">
            <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
          </motion.div>

          <motion.ul
            variants={fadeUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="hidden md:block w-[15%] text-gray-800 space-y-1"
          >
            {navLinks.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-black hover:underline">
                  {l}
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden relative z-[60] flex flex-col gap-[6px] pt-1"
          >
            <span
              className={`block w-8 h-[1.5px] bg-black transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-[3.75px]' : ''
              }`}
            />
            <span
              className={`block w-8 h-[1.5px] bg-black transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-[3.75px]' : ''
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* 1C. Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden relative z-30 bg-[#fcfcfc] border-b border-gray-200 shadow-xl px-6 py-8"
          >
            <ul className="space-y-6 text-sm font-mono tracking-[0.2em] uppercase">
              {navLinks.map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content row */}
      <div className="relative z-10 flex-1 flex justify-between">
        {/* 1E. Left sidebar */}
        <motion.div
          variants={{ initial: {}, animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
          initial="initial"
          animate="animate"
          className="px-10 md:px-16 mt-20 sm:mt-28 md:mt-32 w-[320px]"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 text-xs font-mono">
            <span>01</span>
            <span className="w-16 h-[1.5px] bg-black/20" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-6 text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1]"
          >
            TIMELESS
            <br />
            WONDERS
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-6 text-[13px] md:text-[14px] text-gray-700 w-[240px] leading-[1.6]">
            Step into the natural world and discover the stories written millions of years ago.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <button
              type="button"
              className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm transition-all duration-300 hover:-translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-none"
            >
              <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <LeafIcon className="relative z-10 w-4 h-4 text-white transition-all duration-300 group-hover:text-[#111] group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1" />
              <span className="relative z-10 text-[15px] font-medium text-white transition-colors duration-300 group-hover:text-[#111]">
                Explore Now
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* 1F. Right sidebar */}
        <motion.div
          variants={{ initial: {}, animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
          initial="initial"
          animate="animate"
          className="hidden md:flex flex-col gap-8 w-[200px] mt-12 md:mt-20 px-10 md:px-16"
        >
          <motion.div variants={fadeUp}>
            <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">Tyrannosaurus Rex</h3>
            <p className="mt-2 text-[12px] text-gray-600 leading-[1.6]">
              Late Cretaceous period
              <br />
              68-66 million years ago
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-10">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Length</p>
              <p className="text-[13px] font-medium">12.3 m</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Height</p>
              <p className="text-[13px] font-medium">4.0 m</p>
            </div>
          </motion.div>

          <motion.button variants={fadeUp} type="button" className="group flex items-center gap-3">
            <span className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-colors group-hover:border-black group-hover:bg-[#111]">
              <Plus size={16} strokeWidth={1.5} className="transition-colors group-hover:text-white" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold">View Details</span>
          </motion.button>
        </motion.div>
      </div>

      {/* 1G. Bottom-left "scroll to explore" */}
      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 1.2, duration: 0.8 }}
        className="hidden md:flex items-center gap-4 absolute bottom-10 left-[2.5rem] md:left-[4rem] z-10"
      >
        <span className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px]">
          <span className="w-[1px] h-[12px] bg-gray-600" />
          <span className="w-[1px] h-[12px] bg-gray-600" />
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}
