import * as Cesium from 'cesium'
import { CesiumBridge } from 'cesium-mcp-bridge'
import { HMR_VIEWER_DELAY_MS } from './config'
import { initApp, teardownApp } from './app/init'
import { bindCoordBar, createViewer, destroyViewer } from './cesium/viewer'

let viewer: Cesium.Viewer | undefined

export async function mount(): Promise<void> {
  if (viewer) {
    teardownApp(viewer)
    destroyViewer(viewer)
    viewer = undefined
    await new Promise<void>((r) => setTimeout(r, HMR_VIEWER_DELAY_MS))
  }

  viewer = await createViewer()
  bindCoordBar(viewer)
  initApp({ viewer, bridge: new CesiumBridge(viewer) })
}

export function reportInitError(err: unknown): void {
  console.error('[main] Viewer 初始化失败:', err)
  const logEl = document.getElementById('log')
  if (logEl) {
    const line = document.createElement('div')
    line.className = 'log-err'
    line.textContent = String(err)
    logEl.prepend(line)
  }
}

export function exposeCesiumGlobal(): void {
  window.Cesium = Cesium
}
