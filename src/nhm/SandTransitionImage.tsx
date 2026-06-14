import { useEffect, useRef, useState } from 'react'
import { usePresence } from 'motion/react'

// Image that dissolves in/out like sand using an SVG turbulence +
// displacement filter chain, driven by a requestAnimationFrame loop.
export default function SandTransitionImage({
  src,
  alt,
  className,
}: {
  src: string
  alt?: string
  className?: string
}) {
  const [isPresent, safeToRemove] = usePresence()
  const idRef = useRef('sand-' + Math.random().toString(36).slice(2))
  const [p, setP] = useState(isPresent ? 0 : 0) // 0 = fully shown, 1 = fully dissolved

  // Filter primitive values derived from progress p.
  const dispScale = p * 150
  const dy = isPresent ? -p * 80 : p * 120
  const dx = isPresent ? -p * 30 : p * 30
  const blur = p * 6
  const opacity = Math.max(0, 1 - p * 1.2)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const DURATION = 900
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      if (isPresent) {
        // entering: dissolve from 1 -> 0 with quartic ease-out
        setP(1 - (1 - Math.pow(1 - t, 4)))
      } else {
        // exiting: dissolve from 0 -> 1 with cubic ease-in
        setP(Math.pow(t, 3))
      }
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!isPresent) {
        safeToRemove?.()
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isPresent, safeToRemove])

  const id = idRef.current
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves={4} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={dispScale} result="disp" />
          <feOffset in="disp" dx={dx} dy={dy} result="off" />
          <feGaussianBlur in="off" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0`}
          />
        </filter>
      </defs>
      <image
        href={src}
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid meet"
        crossOrigin="anonymous"
        filter={`url(#${id})`}
      >
        <title>{alt}</title>
      </image>
    </svg>
  )
}
