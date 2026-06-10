import { extent } from './cmd-helpers'

export interface BridgeCommandPreset {
  action: string
  params: Record<string, unknown>
  group: 'view' | 'layer' | 'entity' | 'scene' | 'animation' | 'interaction'
}

/** bridge.execute 支持的命令及示例参数（与 cesium-mcp-bridge 类型定义一致） */
export const BRIDGE_COMMANDS: BridgeCommandPreset[] = [
  { group: 'view', action: 'flyTo', params: { longitude: 116.39, latitude: 39.91, height: 5000 } },
  { group: 'view', action: 'setView', params: { longitude: 121.47, latitude: 31.23, height: 8000, heading: 0, pitch: -45, roll: 0 } },
  { group: 'view', action: 'getView', params: {} },
  { group: 'view', action: 'zoomToExtent', params: extent(115, 39, 117, 41) },
  { group: 'view', action: 'lookAtTransform', params: { longitude: 116.39, latitude: 39.91, height: 0, heading: 0, pitch: -30, range: 5000 } },
  { group: 'view', action: 'startOrbit', params: { speed: 0.5 } },
  { group: 'view', action: 'stopOrbit', params: {} },
  { group: 'view', action: 'setCameraOptions', params: { enableRotate: true, enableZoom: true, enableTilt: true } },
  { group: 'view', action: 'saveViewpoint', params: { name: 'demo-view' } },
  { group: 'view', action: 'loadViewpoint', params: { name: 'demo-view' } },
  { group: 'view', action: 'listViewpoints', params: {} },

  { group: 'layer', action: 'addGeoJsonLayer', params: {
    id: 'demo-layer',
    name: 'Demo Layer',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Demo Point' },
        geometry: { type: 'Point', coordinates: [116.39, 39.91] },
      }],
    },
    style: { color: '#3b82f6', pointSize: 12 },
  } },
  { group: 'layer', action: 'addGeoJsonPrimitive', params: {
    id: 'demo-primitive',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [116.39, 39.91] },
        properties: {},
      }],
    },
  } },
  { group: 'layer', action: 'addHeatmap', params: {
    id: 'heatmap1',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [116.4, 39.9] },
        properties: { weight: 1 },
      }],
    },
    radius: 40,
  } },
  { group: 'layer', action: 'listLayers', params: {} },
  { group: 'layer', action: 'getLayerSchema', params: { layerId: 'cities' } },
  { group: 'layer', action: 'removeLayer', params: { id: 'demo-layer' } },
  { group: 'layer', action: 'setLayerVisibility', params: { id: 'cities', visible: true } },
  { group: 'layer', action: 'updateLayerStyle', params: { layerId: 'cities', layerStyle: { color: '#3b82f6', opacity: 0.6 } } },
  { group: 'layer', action: 'setBasemap', params: { basemap: 'dark' } },
  { group: 'layer', action: 'clearAll', params: {} },

  { group: 'entity', action: 'addMarker', params: { longitude: 116.39, latitude: 39.91, label: 'Demo', color: '#ef4444' } },
  { group: 'entity', action: 'addLabel', params: {
    field: 'name',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: { name: 'Demo Label' },
        geometry: { type: 'Point', coordinates: [116.39, 39.91] },
      }],
    },
    style: { fillColor: '#f97316', font: '14px sans-serif' },
  } },
  { group: 'entity', action: 'addPolyline', params: {
    coordinates: [[116.39, 39.91], [121.47, 31.23]],
    color: '#3b82f6',
    width: 3,
  } },
  { group: 'entity', action: 'addPolygon', params: {
    coordinates: [[116.3, 39.8], [116.5, 39.8], [116.5, 40.0], [116.3, 40.0]],
    color: '#10b981',
    opacity: 0.5,
  } },
  { group: 'entity', action: 'addModel', params: { longitude: 116.39, latitude: 39.91, url: 'https://example.com/model.glb' } },
  { group: 'entity', action: 'updateEntity', params: { entityId: 'marker1', label: 'Updated' } },
  { group: 'entity', action: 'removeEntity', params: { entityId: 'marker1' } },
  { group: 'entity', action: 'batchAddEntities', params: {
    entities: [{ type: 'marker', longitude: 116.39, latitude: 39.91, label: 'Batch' }],
  } },
  { group: 'entity', action: 'queryEntities', params: {} },
  { group: 'entity', action: 'getEntityProperties', params: { entityId: 'marker1' } },
  { group: 'entity', action: 'addBillboard', params: { longitude: 116.39, latitude: 39.91, image: 'https://example.com/icon.png' } },
  { group: 'entity', action: 'addBox', params: {
    longitude: 116.39,
    latitude: 39.91,
    height: 100,
    dimensions: { width: 100, length: 100, height: 100 },
    material: '#3b82f6',
  } },
  { group: 'entity', action: 'addCorridor', params: {
    positions: [{ longitude: 116.39, latitude: 39.91 }, { longitude: 116.45, latitude: 39.95 }],
    width: 200,
    material: '#8b5cf6',
  } },
  { group: 'entity', action: 'addCylinder', params: {
    longitude: 116.39,
    latitude: 39.91,
    length: 200,
    topRadius: 50,
    bottomRadius: 50,
    material: '#06b6d4',
  } },
  { group: 'entity', action: 'addEllipse', params: {
    longitude: 116.39,
    latitude: 39.91,
    semiMajorAxis: 500,
    semiMinorAxis: 300,
    material: '#f59e0b',
  } },
  { group: 'entity', action: 'addRectangle', params: { west: 116.3, south: 39.8, east: 116.5, north: 40.0, material: '#10b981' } },
  { group: 'entity', action: 'addWall', params: {
    positions: [{ longitude: 116.39, latitude: 39.91, height: 0 }, { longitude: 116.45, latitude: 39.95, height: 0 }],
    maximumHeights: [100, 100],
    minimumHeights: [0, 0],
    material: '#ef4444',
  } },

  { group: 'scene', action: 'load3dTiles', params: { id: 'tiles-demo', ionAssetId: 96188 } },
  { group: 'scene', action: 'load3dGaussianSplat', params: { id: 'splat1', url: 'https://example.com/splat.splat' } },
  { group: 'scene', action: 'loadTerrain', params: { provider: 'cesiumion', cesiumIonAssetId: 1 } },
  { group: 'scene', action: 'loadImageryService', params: {
    id: 'imagery1',
    serviceType: 'xyz',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opacity: 0.8,
  } },
  { group: 'scene', action: 'loadCzml', params: { id: 'czml1', url: 'https://example.com/demo.czml' } },
  { group: 'scene', action: 'loadKml', params: { id: 'kml1', url: 'https://example.com/demo.kml' } },
  { group: 'scene', action: 'setSceneOptions', params: { fogEnabled: true, skyAtmosphereShow: true } },
  { group: 'scene', action: 'setPostProcess', params: { bloom: false, fxaa: true } },
  { group: 'scene', action: 'setEdgeDisplayMode', params: { mode: 'surfaces_only' } },
  { group: 'scene', action: 'setGlobeLighting', params: { enableLighting: true } },
  { group: 'scene', action: 'setIonToken', params: { token: 'YOUR_ION_TOKEN' } },
  { group: 'scene', action: 'exportScene', params: {} },

  { group: 'animation', action: 'createAnimation', params: {
    waypoints: [
      { longitude: 116.39, latitude: 39.91, time: '2024-01-01T00:00:00Z' },
      { longitude: 121.47, latitude: 31.23, time: '2024-01-01T00:01:00Z' },
    ],
  } },
  { group: 'animation', action: 'controlAnimation', params: { action: 'play' } },
  { group: 'animation', action: 'removeAnimation', params: { entityId: 'anim1' } },
  { group: 'animation', action: 'listAnimations', params: {} },
  { group: 'animation', action: 'updateAnimationPath', params: { entityId: 'anim1', color: '#3b82f6', width: 3 } },
  { group: 'animation', action: 'trackEntity', params: { entityId: 'anim1' } },
  { group: 'animation', action: 'controlClock', params: {
    action: 'configure',
    startTime: '2024-01-01T00:00:00Z',
    stopTime: '2024-01-02T00:00:00Z',
  } },
  { group: 'animation', action: 'playTrajectory', params: {
    id: 'traj1',
    coordinates: [[116.39, 39.91, 1000], [121.47, 31.23, 1000]],
    durationSeconds: 20,
  } },

  { group: 'interaction', action: 'screenshot', params: {} },
  { group: 'interaction', action: 'highlight', params: { layerId: 'cities', featureIndex: 0, color: '#fbbf24' } },
  { group: 'interaction', action: 'measure', params: {
    mode: 'distance',
    positions: [[116.39, 39.91], [116.45, 39.95]],
  } },
]
