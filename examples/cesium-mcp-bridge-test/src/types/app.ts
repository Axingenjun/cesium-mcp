import type * as Cesium from 'cesium'
import type { CesiumBridge } from 'cesium-mcp-bridge'

export interface AppContext {
  viewer: Cesium.Viewer
  bridge: CesiumBridge
}
