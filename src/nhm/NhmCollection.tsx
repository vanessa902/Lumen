import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bone, Dna, Leaf, ArrowUpRight } from 'lucide-react'
import { chaptersData, PTERODACTYL_IMG } from './data'
import SandTransitionImage from './SandTransitionImage'

const circleIcons = [Bone, Dna, Leaf]

export default function NhmCollection() {
  const [activeChapter, setActiveChapter] = useState(2)

  useEffect(() => {
    const id = setInterval(() => setActiveChapter((prev) => (prev + 1) % chaptersData.length), 3500)
    return () => clearInterval(id)
  }, [])

  const active = chaptersData[activeChapter]
  const counter = String(activeChapter + 1).padStart(2, '0')

  return (
    <section className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30 font-sans overflow-hidden">
      {/* 3A. Pterodactyl overlapping image */}
      <motion.img
        src={PTERODACTYL_IMG}
        alt=""
        initial={{ y: '-65%', opacity: 0 }}
        whileInView={{ y: '-78%', opacity: 1 }}
        viewport={{ margin: '100px' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] md:w-[1100px] max-w-none pointer-events-none z-0"
      />

      {/* 3B. Heading area */}
      <div className="relative z-10 px-8 md:px-16 pt-32 md:pt-48 mb-16 flex flex-col xl:flex-row justify-between gap-10">
        <h2 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-[60rem]">
          Curated from millions of years of wonder
          <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 translate-y-[-4px]">
            {circleIcons.map((Icon, i) => (
              <span
                key={i}
                className="group w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center transition-colors hover:bg-white hover:text-black hover:border-white"
              >
                <Icon size={22} />
              </span>
            ))}
          </span>
          & discovery.
        </h2>

        <div className="xl:text-right shrink-0">
          <p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed">
            We don't just display fossils
            <br />
            we share earth's story
          </p>
          <div className="flex xl:justify-end gap-3 flex-wrap">
            {['Educational', 'Authentic', 'Inspiring'].map((t) => (
              <span
                key={t}
                className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 transition-colors hover:bg-white hover:text-black hover:border-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3C. Two-column panel */}
      <div className="relative z-10 h-[1px] bg-gray-800" />
      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Left panel */}
        <div className="md:w-[35%] border-b md:border-b-0 md:border-r border-gray-800 min-h-[400px] md:min-h-[500px] flex flex-col p-8">
          <p className="text-gray-500 text-xl tracking-[0.3em]">***</p>
          <div className="relative flex-1 my-6">
            <AnimatePresence mode="wait">
              <SandTransitionImage
                key={active.image}
                src={active.image}
                alt={active.name}
                className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten"
              />
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#888] uppercase overflow-hidden h-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={counter}
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                exit={{ y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#888]"
              >
                {counter}
              </motion.span>
            </AnimatePresence>
            <span className="text-[#333]">/</span>
            <span>{String(chaptersData.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="md:w-[65%] flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-800 p-8 text-[10px] font-mono text-gray-400 tracking-widest uppercase">
            <span>Explore the past. Understand the present.</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={counter}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                Chapter {counter}
              </motion.span>
            </AnimatePresence>
          </div>

          <ul>
            {chaptersData.map((c, i) => {
              const isActive = i === activeChapter
              return (
                <li key={c.name} className="border-b border-gray-800/80">
                  <button
                    type="button"
                    onClick={() => setActiveChapter(i)}
                    className={`w-full flex items-center justify-between py-8 px-8 text-left transition-colors ${
                      isActive ? 'text-white' : 'text-[#444] hover:text-[#999]'
                    }`}
                  >
                    <span className="text-2xl md:text-[2rem] font-medium tracking-tight">{c.name}</span>
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* 3D. Footer */}
      <div className="relative z-10 h-[1px] bg-gray-800" />
      <p className="relative z-10 px-8 py-8 text-[10px] font-mono tracking-widest text-gray-500 uppercase bg-[#0a0a0a]">
        Digging into our planet's past
      </p>
    </section>
  )
}
