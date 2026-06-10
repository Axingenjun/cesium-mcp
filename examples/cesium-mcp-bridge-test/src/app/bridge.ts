import type { CesiumBridge } from 'cesium-mcp-bridge'
import { showScreenshot } from '../ui/screenshot'

export function getBridge(): CesiumBridge {
  if (!window.bridge) {
    throw new Error('Cesium 尚未初始化，请稍候再试')
  }
  return window.bridge
}

export function log(msg: string, type: 'cmd' | 'ok' | 'err' | 'info' = 'info'): void {
  const el = document.getElementById('log')
  if (!el) return
  const ts = new Date().toLocaleTimeString()
  const cls = { cmd: 'log-cmd', ok: 'log-ok', err: 'log-err', info: 'log-info' }[type] || 'log-info'
  const line = document.createElement('div')
  line.innerHTML = `<span class="log-time">[${ts}]</span> <span class="${cls}">${msg}</span>`
  el.insertBefore(line, el.firstChild)
  while (el.children.length > 100) el.removeChild(el.lastChild!)
}

export async function cmd(action: string, params: Record<string, unknown> = {}): Promise<unknown> {
  log(`exec: ${action}`, 'cmd')
  let result: unknown
  try {
    result = await getBridge().execute({ action, params })
  } catch (err) {
    log(String(err), 'err')
    throw err
  }
  if (action === 'screenshot' && result && typeof result === 'object' && 'data' in result) {
    const data = (result as { data?: { dataUrl?: string } }).data
    if (data?.dataUrl) showScreenshot(data.dataUrl)
  }
  return result
}
