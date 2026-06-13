import { useEffect, useRef, useState } from 'react'
import { ArrowRight, DollarSign, LineChart, Repeat } from 'lucide-react'

type Item = {
  n: string
  label: string
  copy: string
  Icon: typeof Repeat
}

const ITEMS: Item[] = [
  {
    n: '01',
    label: 'Payments',
    copy: 'Money should move like information — instantly and everywhere. Polygon settles payments in seconds for a fraction of a cent, with the reach of a global network.',
    Icon: Repeat,
  },
  {
    n: '02',
    label: 'Stablecoins',
    copy: "Call us stable. That's the point. The most trusted stablecoins run on Polygon — $3.4B+ in liquidity, full reserve coverage, and the global distribution banks wish they had.",
    Icon: DollarSign,
  },
  {
    n: '03',
    label: 'RWA',
    copy: "You wouldn't sell a Van Gogh on Facebook Marketplace. Tokenized assets belong on rails with reputation. Polygon delivers trust, distribution, and infrastructure that's already proven.",
    Icon: LineChart,
  },
]

function AngularButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="poly-ang-btn">
      <span>{children}</span>
      <ArrowRight size={14} strokeWidth={2.5} />
    </button>
  )
}

export default function PolygonSection() {
  const [active, setActive] = useState(0)
  const rowsRef = useRef<(HTMLDivElement | null)[]>([])

  // Highlight the list item closest to the centre of the viewport as the
  // section scrolls.
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      rowsRef.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    const scroller = document.getElementById('poly-scroller')
    scroller?.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => scroller?.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="poly-root">
      <div className="poly-grid" />

      {/* Block 1 — Get started with Polygon */}
      <section className="poly-start">
        <h2 className="poly-start-title">
          Get started
          <br />
          with Polygon
        </h2>
        <div className="poly-btn-row">
          <AngularButton>START BUILDING</AngularButton>
          <AngularButton>CONTACT US</AngularButton>
          <AngularButton>OPEN MONEY STACK</AngularButton>
        </div>
      </section>

      {/* Block 2 — Powered by $POL */}
      <section className="poly-pol">
        <div className="poly-pol-art" />
        <div className="poly-pol-body">
          <span className="poly-tag">TOKEN</span>
          <h3 className="poly-pol-title">
            Powered
            <br />
            by $POL
          </h3>
          <p className="poly-pol-copy">
            $POL powers Polygon as the native gas and staking token that secures
            the network and enables users to access thousands of apps. A token
            with real utility.
          </p>
          <button type="button" className="poly-stake">
            STAKE NOW <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* Block 3 — What Polygon can do for you */}
      <section className="poly-list">
        <span className="poly-tag poly-list-tag">• WHAT POLYGON CAN DO FOR YOU</span>
        <div className="poly-rows">
          {ITEMS.map((it, i) => {
            const on = active === i
            return (
              <div
                key={it.label}
                ref={(el) => (rowsRef.current[i] = el)}
                className={'poly-row' + (on ? ' is-active' : '')}
              >
                <div className="poly-card">
                  <span className="poly-card-n">{it.n}</span>
                  <it.Icon size={26} strokeWidth={1.6} />
                </div>
                <h3 className="poly-row-label">{it.label}</h3>
                {on && (
                  <div className="poly-tip">
                    <span className="poly-tip-tag">{it.label.toUpperCase()}</span>
                    <p>{it.copy}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
