import type * as Cesium from 'cesium'
import type { CesiumBridge } from 'cesium-mcp-bridge'

declare global {
  interface Window {
    viewer: Cesium.Viewer
    bridge: CesiumBridge
    _bridge: CesiumBridge
    Cesium: typeof Cesium
    cmd: (action: string, params?: Record<string, unknown>) => Promise<unknown>
  }
}

export {}
