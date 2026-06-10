/** 应用级常量 */
export const RUNTIME_WS_URL = 'ws://localhost:9100'
export const SESSION_ID = 'demo'
export const CESIUM_CONTAINER_ID = 'cesiumContainer'
export const HMR_VIEWER_DELAY_MS = 200

/** Natural Earth II，来自 bridge 依赖 cesium 的 Build 资源（vite-plugin-cesium 托管于 /cesium/） */
export const NATURAL_EARTH_TMS = `${import.meta.env.BASE_URL}cesium/Assets/Textures/NaturalEarthII/{z}/{x}/{reverseY}.jpg`
export const NATURAL_EARTH_TILE = `${import.meta.env.BASE_URL}cesium/Assets/Textures/NaturalEarthII/0/0/0.jpg`
