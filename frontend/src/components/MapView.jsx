import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ModelViewer from './ModelViewer'

const CATEGORY_COLORS = {
  hotel: '#4e9af1',
  restaurant: '#f1a94e',
  pharmacy: '#4ef1a9',
  bank: '#f14e4e',
  government: '#a94ef1',
  museum: '#f1a94e',
  hospital: '#f14e4e',
  school: '#4ef1a9',
  park: '#4ef1a9',
  theatre: '#f1a94e',
  default: '#ffffff'
}

function getColor(props) {
  if (props.AMENITY && CATEGORY_COLORS[props.AMENITY]) return CATEGORY_COLORS[props.AMENITY]
  if (props.TOURISM === 'hotel') return CATEGORY_COLORS.hotel
  if (props.AMENITY === 'restaurant' || props.AMENITY === 'fast_food') return CATEGORY_COLORS.restaurant
  return CATEGORY_COLORS.default
}

function makeIcon(color, has3d) {
  return L.divIcon({
    className: '',
    html: `<div style="width:${has3d ? 16 : 12}px;height:${has3d ? 16 : 12}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 ${has3d ? 10 : 6}px ${color}"></div>`,
    iconSize: [has3d ? 16 : 12, has3d ? 16 : 12],
    iconAnchor: [has3d ? 8 : 6, has3d ? 8 : 6]
  })
}

export default function MapView({ layers }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [model, setModel] = useState(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
    }

    const map = L.map(mapRef.current, {
      center: [63.7522, 121.6361],
      zoom: 13
    })
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB',
      maxZoom: 19
    }).addTo(map)

    fetch('http://localhost:8000/api/objects')
      .then(r => r.json())
      .then(data => {
        data.features.forEach(feature => {
          const props = feature.properties
          const coords = feature.geometry.coordinates
          const color = getColor(props)
          const has3d = props.HAS_3D === true
          const name = props.NAME_RU || props.NAME_EN || props.NAME || props.AMENITY || props.TOURISM || 'Объект'

          const popup = L.popup({
            className: 'custom-popup'
          }).setContent(`
            <div style="color:#fff;background:#1a1a2e;padding:12px;border-radius:8px;min-width:180px">
              <b style="color:#4e9af1;font-size:14px">${name}</b><br/>
              <span style="color:#aaa;font-size:12px">${props.ADDRESS || props.AMENITY || props.TOURISM || ''}</span>
              ${has3d ? `<br/><button 
                id="btn-${props.OSM_ID || Math.random()}"
                style="margin-top:8px;padding:6px 12px;background:#4e9af1;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;width:100%"
                onclick="window.open3D('${props.MODEL}', '${name}')"
              >Посмотреть 3D модель</button>` : ''}
            </div>
          `)

          L.marker([coords[1], coords[0]], { icon: makeIcon(color, has3d) })
            .bindPopup(popup)
            .addTo(map)
        })
      })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    window.open3D = (modelFile, modelName) => {
      setModel({ file: modelFile, name: modelName })
    }
    return () => { delete window.open3D }
  }, [])

  return (
    <>
      <div
        ref={mapRef}
        style={{
          position: 'absolute',
          top: 0, left: '220px', right: 0, bottom: 0
        }}
      />
      {model && (
        <ModelViewer
          model={model.file}
          name={model.name}
          onClose={() => setModel(null)}
        />
      )}
    </>
  )
}