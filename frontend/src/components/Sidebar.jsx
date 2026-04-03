export default function Sidebar({ layers, onToggle, onSensors }) {
  const items = [
    { key: 'tourism', label: 'Туризм', color: '#4e9af1' },
    { key: 'infrastructure', label: 'Инфраструктура', color: '#f14e4e' },
    { key: 'transport', label: 'Транспорт', color: '#4ef1a9' },
    { key: 'settlement', label: 'Населённые пункты', color: '#a94ef1' },
  ]

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, zIndex: 1000,
      width: '220px', height: '100vh',
      background: '#0d1117', borderRight: '1px solid #2a2a3e',
      padding: '20px', boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <div style={{ color: '#4e9af1', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
        Цифровой двойник<br/>
        <span style={{ color: '#fff', fontSize: '16px' }}>Вилюйска</span>
      </div>

      <div style={{ color: '#aaa', fontSize: '12px' }}>Слои</div>

      {items.map(item => (
        <label key={item.key} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          color: '#fff', fontSize: '13px', cursor: 'pointer'
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: layers[item.key] ? item.color : '#444'
          }} />
          <input
            type="checkbox"
            checked={layers[item.key]}
            onChange={() => onToggle(item.key)}
            style={{ display: 'none' }}
          />
          {item.label}
        </label>
      ))}

      <div style={{ marginTop: 'auto' }}>
        <button onClick={onSensors} style={{
          width: '100%', padding: '10px',
          background: '#4e9af1', color: '#fff',
          border: 'none', borderRadius: '8px',
          cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
        }}>
          Датчики ЖКХ
        </button>
      </div>
    </div>
  )
}