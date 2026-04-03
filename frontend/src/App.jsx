import { useState } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import SensorPanel from './components/SensorPanel'
import './App.css'

function App() {
  const [layers, setLayers] = useState({
    tourism: true,
    infrastructure: true,
    transport: true,
    settlement: true,
    sensors: true
  })
  const [showSensors, setShowSensors] = useState(false)

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="app">
      <Sidebar layers={layers} onToggle={toggleLayer} onSensors={() => setShowSensors(!showSensors)} />
      <MapView layers={layers} />
      {showSensors && <SensorPanel onClose={() => setShowSensors(false)} />}
    </div>
  )
}

export default App