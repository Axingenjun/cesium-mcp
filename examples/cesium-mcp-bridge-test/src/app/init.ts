import type { AppContext } from '../types/app'
import { log } from './bridge'
import { connectRuntime, isRuntimeConnected } from './runtime'
import { applyLang } from '../ui/i18n'
import { refreshLayers } from '../ui/layers'

export function initApp({ viewer, bridge }: AppContext): void {
  window.viewer = viewer
  window.bridge = bridge
  window._bridge = bridge

  bridge.on('layerAdded', () => refreshLayers())
  bridge.on('layerRemoved', () => refreshLayers())

  applyLang()
  log('Bridge initialized (cesium-mcp-bridge source HMR)', 'info')

  if (!isRuntimeConnected()) connectRuntime()
  refreshLayers()
}

export { teardownRuntime as teardownApp } from './runtime'
