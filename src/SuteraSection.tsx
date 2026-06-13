import { useEffect, useRef, useState } from 'react'

const LOGO_SRC = import.meta.env.BASE_URL + 'Group.svg'
// Centerpiece video (city-in-a-dome). WebM first for Chrome/Firefox, MP4
// fallback for Safari/iOS. Poster shows instantly while it buffers.
const DOME_WEBM = import.meta.env.BASE_URL + 'island.webm'
const DOME_MP4 = import.meta.env.BASE_URL + 'island.mp4'
const DOME_POSTER = import.meta.env.BASE_URL + 'island-poster.jpg'
// Slow the clip to half speed. The source loop is 6.04s, so the slowed loop is
// ~12.08s — the value the background-cast CSS animation is tuned to.
const DOME_RATE = 0.5

// Lumentrack product pillars shown bottom-left.
const THREADS = [
  { n: '01.', label: 'Faster Proposals' },
  { n: '02.', label: 'Automated Workflows' },
  { n: '03.', label: 'Real-Time Install Calendar' },
  { n: '04.', label: 'Accurate Battery + Solar Designs' },
  { n: '05.', label: 'Commission Tracking for Every Deal' },
  { n: '06.', label: 'Custom Permissions and Reporting' },
]

export default function SuteraSection() {
  const rootRef = useRef<HTMLDivElement>(null)
  const vidRef = useRef<HTMLVideoElement>(null)
  const [par, setPar] = useState({ x: 0, y: 0 })
  // Whether the dome video can play (otherwise show the CSS placeholder).
  const [videoReady, setVideoReady] = useState(false)

  // Play the dome clip at half speed for a calmer, dreamier loop. The
  // background cast animation (CSS) runs at the matching slowed loop length so
  // the colour shifts stay in sync with the footage.
  const slowDown = () => {
    if (vidRef.current) vidRef.current.playbackRate = DOME_RATE
  }

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
      {/* Warm light the dome casts onto the scene; pulses in sync with the
          slowed video loop so the background shifts colour at the same rhythm. */}
      <div className="su-dome-cast" />

      {/* Top bar */}
      <img className="su-brand-logo" src={LOGO_SRC} alt="Lumentrack" draggable={false} />

      {/* Headline — centered vertically in the band between the logo and the
          [ ONE PLATFORM · EVERY WORKFLOW ] chip. */}
      <div className="su-headline-band">
        <h2 className="su-headline">
          TRANSFORM YOUR
          <br />
          BUSINESS WITH
          <br />
          INTELLIGENT AUTOMATION
        </h2>
      </div>

      {/* Center — dome video with feathered edges + CSS placeholder fallback */}
      <div
        className="su-island-wrap"
        style={{
          transform: `translate(calc(-50% + ${par.x * 18}px), calc(-50% + ${par.y * 14}px))`,
        }}
      >
        <div className="su-dome">
          <video
            ref={vidRef}
            className="su-dome-vid"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={DOME_POSTER}
            aria-hidden="true"
            onLoadedMetadata={slowDown}
            onCanPlay={() => {
              slowDown()
              setVideoReady(true)
            }}
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

      {/* Annotation callouts (gentle drift via .su-move) */}
      <div className="su-call su-call-top">
        <span className="su-chip">Access our software</span>
        <div className="su-globe" />
        <div className="su-line-v" />
      </div>

      <div className="su-call su-call-tr su-move">
        <p>
          The all-in-one operating
          <br />
          system for contractors and
          <br />
          service businesses.
        </p>
        <div className="su-elbow su-elbow-tr" />
      </div>

      <div className="su-call su-call-bottom su-move">
        <p>
          Connect Lumentrack
          <br />
          to the Tools You
          <br />
          Already Use
        </p>
        <div className="su-elbow su-elbow-bottom" />
      </div>

      {/* Bottom-left — product pillars */}
      <div className="su-threads">
        <span className="su-chip su-threads-tag">[ ONE PLATFORM · EVERY WORKFLOW ]</span>
        <div className="su-threads-body">
          <ul className="su-thread-list">
            {THREADS.map((t) => (
              <li key={t.n}>
                <span className="su-thread-top">
                  {t.n}
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
          <img className="su-bio-logo" src={LOGO_SRC} alt="Lumentrack" draggable={false} />
        </div>
        <p>
          Stop jumping between 10 different tools. Lumentrack unifies CRM,
          proposal design, production modeling, commissions, scheduling, and
          internal workflows into one simple system that your entire team can
          use.
        </p>
      </div>

      <div className="su-socials">
        <button type="button">LINKEDIN</button>
        <button type="button">YOUTUBE</button>
        <button type="button">INSTAGRAM</button>
      </div>
    </section>
  )
}
