import { cmd } from './bridge'
import {
  addCitiesLayer,
  addCityMarkers,
  addHeatmap,
  addPolylineLayer,
  addRandomHeatmap,
  addRandomPolygon,
  load3dTilesDemo,
  loadImageryDemo,
  loadTerrainDemo,
  playBeijingToShanghai,
  playCircleTrajectory,
} from '../demos/commands'
import { toggleLang as applyToggleLang } from '../ui/i18n'
import { togglePanel, toggleSection, toggleTheme } from '../ui/chrome'
import { closeScreenshot, downloadScreenshot, showScreenshot } from '../ui/screenshot'
import { runCustomCmd } from '../ui/custom-cmd'
import { refreshLayers } from '../ui/layers'
import { flyToSelectedCity, initCitySelect } from '../ui/view-control'
import { applySelectedBasemap, initBasemapSelect } from '../ui/basemap-control'
import { applySelectedCommand, initCustomCmdSelect } from '../ui/custom-cmd-control'
import { syncLayerPanelLang, toggleLayerPanel } from '../ui/layer-panel'
import { toggleLogPanel } from '../ui/log-panel'

function toggleLang(): void {
  applyToggleLang()
  initCitySelect()
  initBasemapSelect()
  initCustomCmdSelect()
  syncLayerPanelLang()
  refreshLayers()
}

/** 将 HTML onclick 依赖的函数挂到 window（模块加载时即生效，不等待 Viewer） */
export function bindWindowApi(): void {
  Object.assign(window, {
    cmd,
    addCitiesLayer,
    addCityMarkers,
    addRandomPolygon,
    addPolylineLayer,
    playBeijingToShanghai,
    playCircleTrajectory,
    addHeatmap,
    addRandomHeatmap,
    load3dTilesDemo,
    loadTerrainDemo,
    loadImageryDemo,
    refreshLayers,
    runCustomCmd,
    showScreenshot,
    closeScreenshot,
    downloadScreenshot,
    toggleSection,
    toggleTheme,
    togglePanel,
    toggleLang,
    flyToSelectedCity,
    applySelectedBasemap,
    applySelectedCommand,
    toggleLayerPanel,
    toggleLogPanel,
  })
}

bindWindowApi()
