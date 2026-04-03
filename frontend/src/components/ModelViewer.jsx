import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={0.5} />
}

export default function ModelViewer({ model, name, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', zIndex: 2000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '700px', height: '500px',
        background: '#0d1117', borderRadius: '16px',
        border: '1px solid #2a2a3e', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: '12px', left: '16px', zIndex: 10,
          color: '#4e9af1', fontWeight: 'bold', fontSize: '16px'
        }}>
          {name}
        </div>
        <button onClick={onClose} style={{
          position: 'absolute', top: '12px', right: '16px', zIndex: 10,
          background: 'none', border: 'none', color: '#aaa',
          cursor: 'pointer', fontSize: '20px'
        }}>✕</button>
        <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Model url={`/models/${model}`} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} />
        </Canvas>
        <div style={{
          position: 'absolute', bottom: '12px', left: '50%',
          transform: 'translateX(-50%)',
          color: '#555', fontSize: '12px'
        }}>
          Зажми и потяни для вращения
        </div>
      </div>
    </div>
  )
}