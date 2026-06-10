import { getBridge } from '../app/bridge'
import { t } from './i18n'
import { updateLayerPanelChrome } from './layer-panel'

const TYPE_COLORS: Record<string, string> = {
  GeoJSON: '#3b82f6', 标注点: '#ef4444', 标注: '#f59e0b', 轨迹: '#a855f7',
  影像服务: '#10b981', 热力图: '#ec4899', '3D Tiles': '#06b6d4', 折线: '#3b82f6',
  多边形: '#8b5cf6', 模型: '#f97316',
}

export function refreshLayers(): void {
  const el = document.getElementById('layerList')
  if (!el) return

  let layers: ReturnType<ReturnType<typeof getBridge>['listLayers']> = []
  try {
    layers = getBridge().listLayers()
  } catch {
    el.innerHTML = `<span class="layer-empty" data-i18n="layer.empty">${t('layer.empty')}</span>`
    updateLayerPanelChrome(0)
    return
  }

  updateLayerPanelChrome(layers.length)

  if (layers.length === 0) {
    el.innerHTML = `<span class="layer-empty" data-i18n="layer.empty">${t('layer.empty')}</span>`
    return
  }

  el.innerHTML = layers.map((l) => `
    <div class="layer-item">
      <span class="dot" style="background:${TYPE_COLORS[l.type] || '#6b7280'}"></span>
      <span class="layer-item-name">${l.name || l.id}</span>
      <span class="layer-type">${l.type}</span>
      <button type="button" class="btn destructive layer-item-remove" onclick="cmd('removeLayer',{id:'${l.id}'})">×</button>
    </div>
  `).join('')
}
