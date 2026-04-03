import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const STATUS_COLOR = {
  norm: '#4ef1a9',
  warn: '#f1a94e',
  crit: '#f14e4e'
}

export default function SensorPanel({ onClose }) {
  const [sensors, setSensors] = useState([])
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetch_sensors = () => {
      fetch('http://localhost:8000/api/sensors')
        .then(r => r.json())
        .then(setSensors)
    }
    fetch_sensors()
    const interval = setInterval(fetch_sensors, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadHistory = (id) => {
    setSelected(id)
    fetch(`http://localhost:8000/api/sensors/${id}/history`)
      .then(r => r.json())
      .then(data => {
        setHistory(data.history.map((v, i) => ({ hour: `${i}:00`, value: v })))
      })
  }

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, zIndex: 1000,
      width: '300px', height: '100vh',
      background: '#0d1117', borderLeft: '1px solid #2a2a3e',
      padding: '20px', boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>Датчики ЖКХ</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: '#aaa', cursor: 'pointer', fontSize: '18px'
        }}>✕</button>
      </div>

      {sensors.map(s => (
        <div key={s.id} onClick={() => loadHistory(s.id)} style={{
          background: selected === s.id ? '#1a1a2e' : '#111',
          border: `1px solid ${STATUS_COLOR[s.status]}33`,
          borderRadius: '8px', padding: '12px',
          marginBottom: '8px', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa', fontSize: '13px' }}>{s.type}</span>
            <span style={{ color: STATUS_COLOR[s.status], fontWeight: 'bold' }}>
              {s.value} {s.unit}
            </span>
          </div>
        </div>
      ))}

      {selected && history.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>
            График за 24 часа
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={history}>
              <XAxis dataKey="hour" tick={{ fill: '#aaa', fontSize: 10 }} interval={5} />
              <YAxis tick={{ fill: '#aaa', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke="#4e9af1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}