import type { ParsedField, ParsedInterface } from './parse-types'

const DEMO_POINT = { longitude: 116.39, latitude: 39.91 }
const DEMO_POINT2 = { longitude: 121.47, latitude: 31.23 }

const MINI_GEOJSON = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: { name: 'Demo' },
    geometry: { type: 'Point', coordinates: [116.39, 39.91] },
  }],
}

/** 引用类型简化为常用子集，避免展开整个嵌套接口 */
const SIMPLE_REF_TYPES: Record<string, Record<string, unknown>> = {
  LayerStyle: { color: '#3b82f6', opacity: 0.6, pointSize: 12 },
  ChoroplethStyle: { field: 'value', breaks: [0, 50, 100], colors: ['#ffffcc', '#fd8d3c', '#e31a1c'] },
  CategoryStyle: { field: 'category', colors: ['#3b82f6', '#ef4444', '#10b981'] },
  MaterialSpec: { type: 'color', color: '#3b82f6' },
}

/** data / url 互斥：有 data 时去掉 url */
const DATA_URL_ACTIONS = new Set([
  'AddGeoJsonLayerParams', 'AddGeoJsonPrimitiveParams', 'AddHeatmapParams',
  'LoadCzmlParams', 'LoadKmlParams', 'AddLabelParams',
])

function firstUnionLiteral(type: string): string | undefined {
  const m = type.match(/'([^']+)'/)
  return m?.[1]
}

function sampleByFieldName(name: string, type: string, comment?: string): unknown {
  const n = name.toLowerCase()
  const hint = `${n} ${comment ?? ''}`.toLowerCase()

  if (n === 'longitude') return 116.39
  if (n === 'latitude') return 39.91
  if (n === 'west') return 116.3
  if (n === 'south') return 39.8
  if (n === 'east') return 116.5
  if (n === 'north') return 40.0
  if (n === 'height' && hint.includes('camera')) return 5000
  if (n === 'height') return 100
  if (n === 'heading' || n === 'roll') return 0
  if (n === 'pitch') return -45
  if (n === 'range') return 5000
  if (n === 'duration' || n === 'durationseconds') return 1.5
  if (n === 'speed') return 0.5
  if (n === 'bbox') return [116.3, 39.8, 116.5, 40.0] as [number, number, number, number]
  if (n === 'id') return 'demo-layer'
  if (n === 'layerid') return 'cities'
  if (n === 'entityid') return 'marker1'
  if (n === 'name') return 'Demo'
  if (n === 'label') return 'Demo'
  if (n === 'url' || n === 'modeluri' || n === 'image') return 'https://example.com/data'
  if (n === 'color' || n === 'pathcolor' || n === 'material' || n === 'fillcolor' || n === 'outlinecolor') return '#3b82f6'
  if (n === 'basemap') return firstUnionLiteral(type) ?? 'dark'
  if (n === 'mode') return firstUnionLiteral(type) ?? 'distance'
  if (n === 'provider') return firstUnionLiteral(type) ?? 'cesiumion'
  if (n === 'servicetype') return firstUnionLiteral(type) ?? 'xyz'
  if (n === 'action') return firstUnionLiteral(type) ?? 'play'
  if (n === 'coordinates') return [[116.39, 39.91], [121.47, 31.23]]
  if (n === 'positions') return [DEMO_POINT, DEMO_POINT2]
  if (n === 'data') return MINI_GEOJSON
  if (n === 'field') return 'name'
  if (n === 'visible' || n === 'show' || n === 'fill' || n === 'outline') return true
  if (n === 'opacity' || n === 'cellalpha') return 0.5
  if (n === 'width' || n === 'pathwidth' || n === 'strokewidth') return 3
  if (n === 'radius' || n === 'pointsize') return 12
  if (n === 'ionassetid' || n === 'cesiumionassetid') return 96188
  if (n === 'token') return 'YOUR_ION_TOKEN'
  if (n === 'featureindex') return 0
  if (n === 'length' || n === 'semimajoraxis') return 500
  if (n === 'semiminoraxis' || n === 'topradius' || n === 'bottomradius') return 50
  if (n === 'scale') return 1
  if (n === 'time' || n === 'starttime') return '2024-01-01T00:00:00Z'
  if (n === 'stoptime') return '2024-01-02T00:00:00Z'
  if (n === 'currenttime') return '2024-01-01T12:00:00Z'
  if (n === 'multiplier') return 1
  if (n === 'dimensions') return { width: 100, length: 100, height: 100 }
  if (n === 'minimumheights') return [0, 0]
  if (n === 'maximumheights') return [100, 100]
  if (n === 'entities') return [{ type: 'marker', longitude: 116.39, latitude: 39.91, label: 'Batch' }]
  if (n === 'waypoints') return [
    { longitude: 116.39, latitude: 39.91, time: '2024-01-01T00:00:00Z' },
    { longitude: 121.47, latitude: 31.23, time: '2024-01-01T00:01:00Z' },
  ]
  if (n === 'style' || n === 'layerstyle') return { color: '#3b82f6', opacity: 0.6, pointSize: 12 }
  if (n === 'labelstyle') return { fillColor: '#f97316', font: '14px sans-serif' }
  if (n === 'position') return { ...DEMO_POINT, height: 0 }
  if (n === 'orientation') return { heading: 0, pitch: 0, roll: 0 }
  if (n === 'pixeloffset') return type.includes('[') ? [0, 0] : { x: 0, y: 0 }
  if (n === 'gradient' && type.includes('Record')) return { 0.25: '#0000ff', 0.55: '#00ff00', 1: '#ff0000' }
  if (n === 'gradient' && type.includes('[')) return ['#FF0000', '#0000FF']
  if (n === 'clockrange') return firstUnionLiteral(type) ?? 'UNBOUNDED'
  if (n === 'cornertype' || n === 'horizontalorigin' || n === 'verticalorigin' || n === 'heightreference') {
    return firstUnionLiteral(type) ?? 'CENTER'
  }
  if (n.startsWith('enable') || n === 'fogenabled' || n === 'fxaa' || n === 'bloom') return true
  if (n === 'minimumzoomdistance') return 1
  if (n === 'maximumzoomdistance') return 50000000
  if (n === 'labelfield') return 'name'
  if (n === 'datarefid') return undefined

  return sampleByType(type)
}

function sampleByType(type: string): unknown {
  const t = type.replace(/\s/g, '')
  if (t === 'string') return 'demo'
  if (t === 'number') return 1
  if (t === 'boolean') return true
  if (t === 'unknown' || t === 'any' || t.startsWith('Record<')) return {}
  if (t.startsWith('unknown[]') || t === 'unknown[]') return []
  if (t.includes('number[][]')) return [[116.39, 39.91, 0], [121.47, 31.23, 0]]
  if (t.includes('number[]')) return [116.39, 39.91]
  if (t.includes('[number,number,number,number]')) return [116.3, 39.8, 116.5, 40.0]
  if (t.includes('[number,number]')) return [0, 0]
  if (t.startsWith('PositionDegrees[]')) {
    return [{ longitude: 116.39, latitude: 39.91 }, { longitude: 116.45, latitude: 39.95 }]
  }
  if (t.startsWith('AnimationWaypoint[]')) {
    return [{ longitude: 116.39, latitude: 39.91, time: '2024-01-01T00:00:00Z' }]
  }
  if (t.startsWith('BatchEntityDef[]')) {
    return [{ type: 'marker', longitude: 116.39, latitude: 39.91 }]
  }
  const unionLit = firstUnionLiteral(type)
  if (unionLit) return unionLit
  if (t.includes('ColorInput') || t.includes('MaterialInput')) return '#3b82f6'
  return {}
}

function buildFromInterface(
  iface: ParsedInterface,
  types: Map<string, ParsedInterface>,
  depth = 0,
): Record<string, unknown> {
  if (depth > 4) return {}
  const allOptional = iface.fields.length > 0 && iface.fields.every((f) => f.optional)
  const result: Record<string, unknown> = {}
  for (const field of iface.fields) {
    const refMatch = field.type.match(/^(\w+)(\[\])?$/)
    if (refMatch && types.has(refMatch[1])) {
      const refName = refMatch[1]
      if (SIMPLE_REF_TYPES[refName]) {
        result[field.name] = refMatch[2] ? [SIMPLE_REF_TYPES[refName]] : { ...SIMPLE_REF_TYPES[refName] }
        continue
      }
      const ref = types.get(refName)!
      const val = buildFromInterface(ref, types, depth + 1)
      result[field.name] = refMatch[2] ? [val] : val
      continue
    }
    if (field.type.startsWith('{')) {
      result[field.name] = sampleByFieldName(field.name, field.type, field.comment)
      continue
    }
    if (field.optional && !allOptional && !isUsefulOptional(field)) continue
    const val = sampleByFieldName(field.name, field.type, field.comment)
    if (val !== undefined) result[field.name] = val
  }
  return result
}

function isUsefulOptional(field: ParsedField): boolean {
  const demoKeys = [
    'height', 'heading', 'pitch', 'roll', 'duration', 'style', 'color', 'width',
    'opacity', 'name', 'id', 'label', 'url', 'data', 'radius', 'material',
  ]
  return demoKeys.includes(field.name.toLowerCase())
}

function postProcess(typeName: string, params: Record<string, unknown>): Record<string, unknown> {
  if (DATA_URL_ACTIONS.has(typeName) && params.data != null) {
    const { url: _, ...rest } = params
    return rest
  }
  return params
}

export function buildSampleParams(
  typeName: string | undefined,
  types: Map<string, ParsedInterface>,
): Record<string, unknown> {
  if (!typeName) return {}
  const iface = types.get(typeName)
  if (!iface) return {}
  return postProcess(typeName, buildFromInterface(iface, types))
}
