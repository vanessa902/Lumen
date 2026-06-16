import Hero from './Hero'
import LithosHero from './lithos/LithosHero'
import NhmExplore from './nhm/NhmExplore'
import NhmCollection from './nhm/NhmCollection'
import NhmMarquee from './nhm/NhmMarquee'

export default function App() {
  return (
    <>
      {/* 1. Lithos hero is the first screen */}
      <LithosHero />
      {/* 2. NHM sections */}
      <NhmExplore />
      <NhmCollection />
      {/* Marquee strip bridging section 3 and the Lumentrack section */}
      <NhmMarquee />
      {/* 3. The Lumentrack scroll-jacked experience (last) */}
      <Hero />
    </>
  )
}
