import { motion } from 'motion/react'
import { Bone, Dna, Gem, Leaf, BookOpen } from 'lucide-react'

const pills = [
  { icon: Bone, label: 'Dinosaurs' },
  { icon: Dna, label: 'Ancient Life' },
  { icon: Gem, label: 'Minerals' },
  { icon: Leaf, label: 'Fossils' },
  { icon: BookOpen, label: 'Learn More' },
]

export default function NhmExplore() {
  return (
    <section className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] text-[#111] font-sans flex flex-col items-center pt-24 md:pt-32 pb-0 z-20">
      {/* 2A. Section label */}
      <p className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12">
        <span className="text-gray-500">[ 02 ]</span>{' '}
        <span className="text-gray-900 font-bold uppercase">Explore Our World</span>
      </p>

      {/* 2B. Main heading */}
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] text-center max-w-[1000px] px-6"
      >
        The all-in-one operating system for
        <br className="hidden md:block" /> contractors and service businesses.
      </motion.h2>

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

      {/* 2D. Spacer for the pterodactyl from Section 3 to overlap into */}
      <div className="min-h-[220px] md:min-h-[450px]" />

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
