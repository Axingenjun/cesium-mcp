import type * as Cesium from 'cesium'
import { RUNTIME_WS_URL, SESSION_ID } from '../config'
import { getBridge, log } from './bridge'
import { t } from '../ui/i18n'

let ws: WebSocket | null = null
let wsConnected = false

export function isRuntimeConnected(): boolean {
  return wsConnected
}

export function connectRuntime(): void {
  const el = document.getElementById('wsStatus')
  if (!el) return
  try {
    ws = new WebSocket(`${RUNTIME_WS_URL}?session=${SESSION_ID}`)
  } catch {
    el.textContent = t('ws.failed')
    el.className = 'badge err'
    el.setAttribute('data-i18n', 'ws.failed')
    return
  }
  ws.onopen = () => {
    wsConnected = true
    el.textContent = t('ws.online')
    el.className = 'badge ok'
    el.setAttribute('data-i18n', 'ws.online')
    log('Runtime connected', 'ok')
  }
  ws.onmessage = async (event) => {
    const msg = JSON.parse(event.data) as { id?: string; method: string; params?: Record<string, unknown> }
    log(`remote: ${msg.method}`, 'cmd')
    const result = await getBridge().execute({ action: msg.method, params: msg.params || {} })
    if (msg.id && ws) ws.send(JSON.stringify({ id: msg.id, result: result || { success: true } }))
  }
  ws.onclose = () => {
    wsConnected = false
    el.textContent = t('ws.offline')
    el.className = 'badge err'
    el.setAttribute('data-i18n', 'ws.offline')
    log('disconnected, reconnect in 5s...', 'err')
    setTimeout(connectRuntime, 5000)
  }
  ws.onerror = () => {
    el.textContent = t('ws.error')
    el.className = 'badge err'
    el.setAttribute('data-i18n', 'ws.error')
  }
}

export function disconnectRuntime(): void {
  if (ws) {
    ws.onclose = null
    ws.close()
    ws = null
    wsConnected = false
  }
}

export function teardownRuntime(_viewer: Cesium.Viewer): void {
  disconnectRuntime()
}
