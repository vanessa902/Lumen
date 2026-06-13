import { useEffect, useRef, useState } from 'react'

const LOGO_SRC = import.meta.env.BASE_URL + 'Group.svg'
// Centerpiece video (city-in-a-dome). WebM first for Chrome/Firefox, MP4
// fallback for Safari/iOS. Poster shows instantly while it buffers.
const DOME_WEBM = import.meta.env.BASE_URL + 'island.webm'
const DOME_MP4 = import.meta.env.BASE_URL + 'island.mp4'
const DOME_POSTER = import.meta.env.BASE_URL + 'island-poster.jpg'

const THREADS = [
  { n: '01.', tag: '(XR/MR/VR)', label: 'PERCEPTUAL INTERFACES' },
  { n: '02.', tag: '', label: 'EMBODIMENT' },
  { n: '03.', tag: '', label: 'IA & AI' },
  { n: '04.', tag: '', label: 'SYSTEM AND TOOLS' },
]

function useLocalTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      let h = d.getHours()
      const ampm = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      const hh = String(h).padStart(2, '0')
      const mm = String(d.getMinutes()).padStart(2, '0')
      setT(`ZUR ${hh} ${mm} ${ampm}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function SuteraSection() {
  const time = useLocalTime()
  const rootRef = useRef<HTMLDivElement>(null)
  const [par, setPar] = useState({ x: 0, y: 0 })
  // Whether the dome video can play (otherwise show the CSS placeholder).
  const [videoReady, setVideoReady] = useState(false)

  // Subtle cursor-driven parallax for the island and markers.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      setPar({ x, y })
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section ref={rootRef} className="su-root">
      <div className="su-grid" />
      <div className="su-glow" />

      {/* Top bar */}
      <img className="su-brand-logo" src={LOGO_SRC} alt="Lumentrack" draggable={false} />
      <div className="su-time">
        <span className="su-dim">LOCAL TIME</span>
        <span>{time}</span>
      </div>

      {/* Headline */}
      <h2 className="su-headline">
        BOOK A
        <br />
        DEMO
      </h2>

      {/* Center — dome video with feathered edges + CSS placeholder fallback */}
      <div
        className="su-island-wrap"
        style={{
          transform: `translate(calc(-50% + ${par.x * 18}px), calc(-50% + ${par.y * 14}px))`,
        }}
      >
        <div className="su-dome">
          <video
            className="su-dome-vid"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={DOME_POSTER}
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          >
            <source src={DOME_WEBM} type="video/webm" />
            <source src={DOME_MP4} type="video/mp4" />
          </video>
        </div>
        {!videoReady && (
          <>
            <div className="su-island">
              <div className="su-island-moss" />
              <div className="su-island-scan" />
              <div className="su-island-flower" />
            </div>
            <div className="su-island-tag">[ LOADING · DOME ]</div>
          </>
        )}
      </div>

      {/* Annotation callouts */}
      <div className="su-call su-call-top">
        <span className="su-chip">CHANGE REALITY</span>
        <div className="su-globe" />
        <div className="su-line-v" />
      </div>

      <div className="su-call su-call-tr">
        <p>
          WHERE IMAGINATION
          <br />
          BRANCHES INTO A<br />
          LANDSCAPE OF
          <br />
          ENDLESS DIVERSITY
        </p>
        <div className="su-elbow su-elbow-tr" />
      </div>

      <div className="su-call su-call-left">
        <p>
          FROM DEEP ROOTS,
          <br />
          CREATIVITY DRAWS ITS
          <br />
          STRENGTH
        </p>
        <div className="su-elbow su-elbow-left" />
        <span className="su-marker" />
      </div>

      <div className="su-call su-call-bottom">
        <p>
          FOUNDATION
          <br />
          DESIGNED FOR
          <br />
          GROWTH
        </p>
        <div className="su-elbow su-elbow-bottom" />
      </div>

      {/* Right data panel */}
      <div className="su-panel su-meta">
        <div className="su-meta-head">
          <span>SUTÉRA</span>
          <span className="su-dim">/25</span>
        </div>
        <p className="su-dim">SU (UNDERNEATH)</p>
        <p className="su-dim">+ TERA (EARTH)</p>
        <p className="su-meta-res">→ UNDERNEATH THE EARTH</p>
      </div>

      {/* Bottom-left — core threads */}
      <div className="su-threads">
        <span className="su-chip su-threads-tag">[ CORE THREADS OF MY WORK ]</span>
        <div className="su-threads-body">
          <div className="su-thumbs">
            <div className="su-thumb su-thumb-spark" />
            <div className="su-thumb su-thumb-grid" />
            <div className="su-thumb su-thumb-grid2" />
            <div className="su-thumb su-thumb-grid3" />
          </div>
          <ul className="su-thread-list">
            {THREADS.map((t) => (
              <li key={t.n}>
                <span className="su-thread-top">
                  {t.n}
                  {t.tag && <span className="su-thread-tag"> {t.tag}</span>}
                  <span className="su-hatch">//////</span>
                </span>
                <span className="su-thread-label">{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom-right — bio panel */}
      <div className="su-panel su-bio">
        <div className="su-bio-head">
          <span>NOT A STUDIO — JUST ME</span>
          <span className="su-x">×</span>
        </div>
        <p>
          I'm Stella Mühlhaus and I currently work at Meta. On the side I give
          talks, workshops, and mentor, as well as writing on design and
          technology. This site is simply a collection of what I do and share
          info along the way.
        </p>
      </div>

      <div className="su-socials">
        <button type="button">LINKEDIN</button>
        <button type="button">MEDIUM</button>
        <button type="button">INSTAGRAM</button>
      </div>
    </section>
  )
}
