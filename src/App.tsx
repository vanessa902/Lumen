import Hero from './Hero'
import NhmHero from './nhm/NhmHero'
import NhmExplore from './nhm/NhmExplore'
import NhmCollection from './nhm/NhmCollection'

export default function App() {
  return (
    <>
      {/* 1. NHM hero replaces the first screen */}
      <NhmHero />
      {/* 2. The Lumentrack scroll-jacked experience */}
      <Hero />
      {/* 3. The remaining NHM sections */}
      <NhmExplore />
      <NhmCollection />
    </>
  )
}
