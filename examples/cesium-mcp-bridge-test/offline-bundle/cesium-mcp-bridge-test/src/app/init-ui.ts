import { applyLang } from '../ui/i18n'
import { initCitySelect } from '../ui/view-control'
import { initBasemapSelect } from '../ui/basemap-control'
import { mountMapOverlayStack } from '../ui/map-overlay-stack'
import { mountLogPanel } from '../ui/log-panel'
import { mountLayerPanel, syncLayerPanelLang } from '../ui/layer-panel'
import { initCustomCmdSelect } from '../ui/custom-cmd-control'
import { refreshLayers } from '../ui/layers'

/** 挂载地图浮层与侧栏控件（需在 DOM 就绪后、Viewer 初始化前调用） */
export function initUi(): void {
  mountMapOverlayStack()
  mountLogPanel()
  mountLayerPanel()
  applyLang()
  syncLayerPanelLang()
  initCitySelect()
  initBasemapSelect()
  initCustomCmdSelect()
  refreshLayers()
}
