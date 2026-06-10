import { cmd, log } from '../app/bridge'

export function runCustomCmd(): void {
  try {
    const raw = (document.getElementById('customCmd') as HTMLTextAreaElement).value
    const data = JSON.parse(raw) as { action: string; params?: Record<string, unknown> }
    void cmd(data.action, data.params || {})
  } catch (e) {
    log('JSON parse error: ' + (e as Error).message, 'err')
  }
}
