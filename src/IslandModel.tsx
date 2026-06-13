import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react'
import * as THREE from 'three'

const GLB = import.meta.env.BASE_URL + 'island.glb'

function Model({ onReady }: { onReady: () => void }) {
  const { scene } = useGLTF(GLB, true)
  const ref = useRef<THREE.Group>(null)

  useEffect(() => {
    onReady()
  }, [onReady])

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    // Slow auto-rotation
    g.rotation.y += delta * 0.22
    // Cursor-driven tilt + gentle float
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.18, 0.05)
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12
  })

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

// Cursor-driven camera drift (parallax), like the reference.
function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.7,
      0.04,
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      0.4 + state.pointer.y * 0.4,
      0.04,
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

class Boundary extends Component<
  { children: ReactNode; onError: () => void },
  { err: boolean }
> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.err ? null : this.props.children
  }
}

export default function IslandModel({
  onReady,
  onError,
}: {
  onReady: () => void
  onError: () => void
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.6], fov: 38 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#bcd0ff', '#0a1024', 0.6]} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#7aa2ff" />
      <Boundary onError={onError}>
        <Suspense fallback={null}>
          <Model onReady={onReady} />
          <Rig />
        </Suspense>
      </Boundary>
    </Canvas>
  )
}
