/**
 * 经测试验证的命令示例参数（优先于类型自动推导）。
 * 自动推导用于 bridge 新增且未收录的命令。
 */
import { extent } from '../cmd-helpers'

const MINI_POINT_GEOJSON = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: { name: 'Demo Point' },
    geometry: { type: 'Point', coordinates: [116.39, 39.91] },
  }],
}

const MINI_HEATMAP_GEOJSON = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [116.4, 39.9] },
    properties: { weight: 1 },
  }],
}

export const COMMAND_PARAM_PRESETS: Record<string, Record<string, unknown>> = {
  flyTo: { longitude: 116.39, latitude: 39.91, height: 5000 },
  setView: { longitude: 121.47, latitude: 31.23, height: 8000, heading: 0, pitch: -45, roll: 0 },
  getView: {},
  zoomToExtent: extent(115, 39, 117, 41),
  lookAtTransform: { longitude: 116.39, latitude: 39.91, height: 0, heading: 0, pitch: -30, range: 5000 },
  startOrbit: { speed: 0.5 },
  stopOrbit: {},
  setCameraOptions: {
    enableRotate: true, enableTranslate: true, enableZoom: true, enableTilt: true,
    enableLook: true, minimumZoomDistance: 1, maximumZoomDistance: 50000000, enableInputs: true,
  },
  saveViewpoint: { name: 'demo-view' },
  loadViewpoint: { name: 'demo-view' },
  listViewpoints: {},

  addGeoJsonLayer: {
    id: 'demo-layer',
    name: 'Demo Layer',
    data: MINI_POINT_GEOJSON,
    style: { color: '#3b82f6', pointSize: 12 },
  },
  addGeoJsonPrimitive: {
    id: 'demo-primitive',
    data: {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [116.39, 39.91] },
        properties: {},
      }],
    },
  },
  addHeatmap: { id: 'heatmap1', data: MINI_HEATMAP_GEOJSON, radius: 40 },
  listLayers: {},
  getLayerSchema: { layerId: 'cities' },
  removeLayer: { id: 'demo-layer' },
  setLayerVisibility: { id: 'cities', visible: true },
  updateLayerStyle: { layerId: 'cities', layerStyle: { color: '#3b82f6', opacity: 0.6 } },
  setBasemap: { basemap: 'dark' },
  clearAll: {},

  addMarker: { longitude: 116.39, latitude: 39.91, label: 'Demo', color: '#ef4444' },
  addLabel: {
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
  },
  addPolyline: {
    coordinates: [[116.39, 39.91], [121.47, 31.23]],
    color: '#3b82f6',
    width: 3,
  },
  addPolygon: {
    coordinates: [[116.3, 39.8], [116.5, 39.8], [116.5, 40.0], [116.3, 40.0]],
    color: '#10b981',
    opacity: 0.5,
  },
  addModel: { longitude: 116.39, latitude: 39.91, url: 'https://example.com/model.glb' },
  updateEntity: { entityId: 'marker1', label: 'Updated' },
  removeEntity: { entityId: 'marker1' },
  batchAddEntities: {
    entities: [{ type: 'marker', longitude: 116.39, latitude: 39.91, label: 'Batch' }],
  },
  queryEntities: {},
  getEntityProperties: { entityId: 'marker1' },
  addBillboard: { longitude: 116.39, latitude: 39.91, image: 'https://example.com/icon.png' },
  addBox: {
    longitude: 116.39,
    latitude: 39.91,
    height: 100,
    dimensions: { width: 100, length: 100, height: 100 },
    material: '#3b82f6',
  },
  addCorridor: {
    positions: [{ longitude: 116.39, latitude: 39.91 }, { longitude: 116.45, latitude: 39.95 }],
    width: 200,
    material: '#8b5cf6',
  },
  addCylinder: {
    longitude: 116.39,
    latitude: 39.91,
    length: 200,
    topRadius: 50,
    bottomRadius: 50,
    material: '#06b6d4',
  },
  addEllipse: {
    longitude: 116.39,
    latitude: 39.91,
    semiMajorAxis: 500,
    semiMinorAxis: 300,
    material: '#f59e0b',
  },
  addRectangle: { west: 116.3, south: 39.8, east: 116.5, north: 40.0, material: '#10b981' },
  addWall: {
    positions: [
      { longitude: 116.39, latitude: 39.91, height: 0 },
      { longitude: 116.45, latitude: 39.95, height: 0 },
    ],
    maximumHeights: [100, 100],
    minimumHeights: [0, 0],
    material: '#ef4444',
  },

  load3dTiles: { id: 'tiles-demo', ionAssetId: 96188 },
  load3dGaussianSplat: { id: 'splat1', url: 'https://example.com/splat.splat' },
  loadTerrain: { provider: 'cesiumion', cesiumIonAssetId: 1 },
  loadImageryService: {
    id: 'imagery1',
    serviceType: 'xyz',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opacity: 0.8,
  },
  loadCzml: { id: 'czml1', url: 'https://example.com/demo.czml' },
  loadKml: { id: 'kml1', url: 'https://example.com/demo.kml' },
  setSceneOptions: { fogEnabled: true, skyAtmosphereShow: true },
  setPostProcess: { bloom: false, fxaa: true },
  setEdgeDisplayMode: { mode: 'surfaces_only' },
  setGlobeLighting: { enableLighting: true },
  setIonToken: { token: 'YOUR_ION_TOKEN' },
  exportScene: {},

  createAnimation: {
    waypoints: [
      { longitude: 116.39, latitude: 39.91, time: '2024-01-01T00:00:00Z' },
      { longitude: 121.47, latitude: 31.23, time: '2024-01-01T00:01:00Z' },
    ],
  },
  controlAnimation: { action: 'play' },
  removeAnimation: { entityId: 'anim1' },
  listAnimations: {},
  updateAnimationPath: { entityId: 'anim1', color: '#3b82f6', width: 3 },
  trackEntity: { entityId: 'anim1' },
  controlClock: {
    action: 'configure',
    startTime: '2024-01-01T00:00:00Z',
    stopTime: '2024-01-02T00:00:00Z',
  },
  playTrajectory: {
    id: 'traj1',
    coordinates: [[116.39, 39.91, 1000], [121.47, 31.23, 1000]],
    durationSeconds: 20,
  },

  screenshot: {},
  highlight: { layerId: 'cities', featureIndex: 0, color: '#fbbf24' },
  measure: {
    mode: 'distance',
    positions: [[116.39, 39.91], [116.45, 39.95]],
  },
}
