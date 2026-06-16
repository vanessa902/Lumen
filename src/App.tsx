import Hero from './Hero'
import LithosHero from './lithos/LithosHero'
import NhmExplore from './nhm/NhmExplore'
import NhmCollection from './nhm/NhmCollection'

export default function App() {
  return (
    <>
      {/* 1. Lithos hero is the first screen */}
      <LithosHero />
      {/* 2. NHM sections */}
      <NhmExplore />
      <NhmCollection />
      {/* 3. The Lumentrack scroll-jacked experience (last) */}
      <Hero />
    </>
  )
}
