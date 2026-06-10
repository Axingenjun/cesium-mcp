import { t } from './i18n'
import { getMapOverlayStack } from './map-overlay-stack'

const PANEL_ID = 'layerPanel'

export function mountLayerPanel(): void {
  const parent = getMapOverlayStack() ?? document.querySelector('.map-wrap')
  if (!parent || document.getElementById(PANEL_ID)) return

  const panel = document.createElement('div')
  panel.id = PANEL_ID
  panel.className = 'layer-panel map-overlay-panel'
  panel.innerHTML = `
    <div class="map-overlay-panel-header" onclick="toggleLayerPanel()">
      <span class="map-overlay-panel-title" data-i18n="sec.layers">图层管理</span>
      <span id="layerCount" class="layer-count">0</span>
      <span class="map-overlay-panel-arrow">&#9660;</span>
    </div>
    <div class="map-overlay-panel-body">
      <div id="layerList" class="layer-panel-list">
        <span class="layer-empty" data-i18n="layer.empty">暂无图层</span>
      </div>
      <button type="button" class="btn layer-panel-refresh" onclick="refreshLayers()" data-i18n="btn.refresh">刷新</button>
    </div>
  `
  parent.appendChild(panel)
}

export function toggleLayerPanel(): void {
  document.getElementById(PANEL_ID)?.classList.toggle('collapsed')
}

export function updateLayerPanelChrome(count: number): void {
  const badge = document.getElementById('layerCount')
  if (badge) badge.textContent = String(count)
}

/** 挂载后更新标题等 i18n 文案 */
export function syncLayerPanelLang(): void {
  const panel = document.getElementById(PANEL_ID)
  if (!panel) return
  panel.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (key) el.textContent = t(key)
  })
}
