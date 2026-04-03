import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const CATEGORY_COLORS = {
  hotel: '#4e9af1',
  restaurant: '#f1a94e',
  pharmacy: '#4ef1a9',
  bank: '#f14e4e',
  government: '#a94ef1',
  default: '#ffffff'
}

function getColor(props) {
  if (props.TOURISM === 'hotel') return CATEGORY_COLORS.hotel
  if (props.AMENITY === 'restaurant' || props.AMENITY === 'fast_food') return CATEGORY_COLORS.restaurant
  if (props.AMENITY === 'pharmacy') return CATEGORY_COLORS.pharmacy
  if (props.AMENITY === 'bank') return CATEGORY_COLORS.bank
  if (props.AMENITY === 'government') return CATEGORY_COLORS.government
  return CATEGORY_COLORS.default
}

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color}"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  })
}

export default function MapView({ layers }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

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
          const name = props.NAME_RU || props.NAME_EN || props.NAME || props.AMENITY || props.TOURISM || 'Объект'

          L.marker([coords[1], coords[0]], { icon: makeIcon(color) })
            .bindPopup(`
              <div style="color:#fff;background:#1a1a2e;padding:8px;border-radius:8px;min-width:150px">
                <b style="color:#4e9af1">${name}</b><br/>
                <span style="color:#aaa;font-size:12px">${props.AMENITY || props.TOURISM || ''}</span>
              </div>
            `)
            .addTo(map)
        })
      })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  return (
    <div
      ref={mapRef}
      style={{
        position: 'absolute',
        top: 0,
        left: '220px',
        right: 0,
        bottom: 0
      }}
    />
  )
}