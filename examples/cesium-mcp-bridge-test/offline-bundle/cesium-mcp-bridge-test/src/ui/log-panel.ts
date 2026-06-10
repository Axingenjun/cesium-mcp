import { getMapOverlayStack } from './map-overlay-stack'

const PANEL_ID = 'logPanel'

export function mountLogPanel(): void {
  const parent = getMapOverlayStack() ?? document.querySelector('.map-wrap')
  if (!parent || document.getElementById(PANEL_ID)) return

  const panel = document.createElement('div')
  panel.id = PANEL_ID
  panel.className = 'log-panel map-overlay-panel'
  panel.innerHTML = `
    <div class="map-overlay-panel-header" onclick="toggleLogPanel()">
      <span class="map-overlay-panel-title" data-i18n="sec.log">运行日志</span>
      <span class="map-overlay-panel-arrow">&#9660;</span>
    </div>
    <div class="map-overlay-panel-body">
      <div id="log"><span class="log-info" data-i18n="log.ready">就绪</span></div>
    </div>
  `
  parent.appendChild(panel)
}

export function toggleLogPanel(): void {
  document.getElementById(PANEL_ID)?.classList.toggle('collapsed')
}
