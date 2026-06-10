import { cmd } from '../app/bridge'
import { CITIES, cityGeoJson } from './data'
import { extent } from './cmd-helpers'

export async function addCitiesLayer(): Promise<void> {
  await cmd('addGeoJsonLayer', {
    id: 'cities',
    data: cityGeoJson(),
    style: { color: '#f97316', pointSize: 28 },
  })
  await cmd('zoomToExtent', extent(100, 18, 125, 42, 2))
}

export async function addCityMarkers(): Promise<void> {
  await cmd('addLabel', {
    field: 'label',
    data: {
      type: 'FeatureCollection',
      features: CITIES.map((c) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
        properties: { label: `${c.name} (${c.pop}万)` },
      })),
    },
    style: { fillColor: '#f97316', font: '12px sans-serif', pixelOffset: [0, -16] },
  })
  await cmd('zoomToExtent', extent(100, 18, 125, 42, 2))
}

export function addRandomPolygon(): void {
  const cx = 110 + Math.random() * 15
  const cy = 25 + Math.random() * 15
  const r = 1 + Math.random() * 2
  const pts: number[][] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6
    pts.push([cx + r * Math.cos(a) * (0.8 + Math.random() * 0.4), cy + r * Math.sin(a) * (0.8 + Math.random() * 0.4)])
  }
  pts.push(pts[0]!)
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
  const color = colors[Math.floor(Math.random() * colors.length)]!
  void cmd('addGeoJsonLayer', {
    id: 'polygon1',
    data: {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [pts] }, properties: { name: '随机区域' } }],
    },
    style: { color, opacity: 0.5, strokeWidth: 3 },
  })
}

export function addPolylineLayer(): void {
  const route = [[116.39, 39.91], [118.80, 32.06], [120.15, 30.28], [121.47, 31.23]]
  void cmd('addGeoJsonLayer', {
    id: 'airline1',
    data: {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: route }, properties: { name: '京沪航线' } }],
    },
    style: { color: '#a855f7', opacity: 0.9, strokeWidth: 3 },
  })
}

export function playBeijingToShanghai(): void {
  const coordinates: number[][] = []
  const startLon = 116.39, startLat = 39.91, endLon = 121.47, endLat = 31.23
  for (let i = 0; i <= 20; i++) {
    const tt = i / 20
    coordinates.push([startLon + (endLon - startLon) * tt, startLat + (endLat - startLat) * tt])
  }
  void cmd('playTrajectory', { id: 'traj-bj-sh', coordinates, durationSeconds: 20 })
  void cmd('zoomToExtent', extent(115, 30, 123, 41))
}

export function playCircleTrajectory(): void {
  const coordinates: number[][] = []
  const cx = 116.39, cy = 39.91, r = 2
  for (let i = 0; i <= 36; i++) {
    const a = (Math.PI * 2 * i) / 36
    coordinates.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
  }
  void cmd('playTrajectory', { id: 'traj-circle', coordinates, durationSeconds: 30 })
  void cmd('flyTo', { longitude: cx, latitude: cy, height: 500000, duration: 1.5 })
}

export function addHeatmap(): void {
  const heatData = {
    type: 'FeatureCollection',
    features: CITIES.map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
      properties: { weight: c.pop / 3205 },
    })),
  }
  void cmd('addHeatmap', {
    id: 'heatmap1',
    data: heatData,
    radius: 60,
    gradient: { 0.2: '#2563eb', 0.5: '#10b981', 0.8: '#f59e0b', 1.0: '#ef4444' },
  })
  void cmd('zoomToExtent', extent(100, 18, 125, 42, 2))
}

export function addRandomHeatmap(): void {
  const features = []
  for (let i = 0; i < 200; i++) {
    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [100 + Math.random() * 25, 20 + Math.random() * 20] },
      properties: { weight: Math.random() },
    })
  }
  void cmd('addHeatmap', {
    id: 'heatmap1',
    data: { type: 'FeatureCollection', features },
    radius: 40,
    gradient: { 0.25: '#3b82f6', 0.5: '#8b5cf6', 0.75: '#ec4899', 1.0: '#ef4444' },
  })
  void cmd('zoomToExtent', extent(98, 18, 127, 42, 2))
}

export async function load3dTilesDemo(): Promise<void> {
  await cmd('load3dTiles', { id: 'tiles-demo', ionAssetId: 96188 })
  void cmd('flyTo', { longitude: -74.01, latitude: 40.71, height: 1500, duration: 3 })
}

export function loadTerrainDemo(): void {
  void cmd('loadTerrain', { provider: 'cesiumion', cesiumIonAssetId: 1 })
  void cmd('flyTo', { longitude: 86.925, latitude: 27.988, height: 12000, duration: 3 })
}

export function loadImageryDemo(): void {
  void cmd('loadImageryService', { id: 'sentinel2', ionAssetId: 3954, opacity: 0.7 })
}
