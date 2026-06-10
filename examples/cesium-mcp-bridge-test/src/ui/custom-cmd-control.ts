import { BRIDGE_COMMANDS } from '../demos/bridge-commands'
import { t } from './i18n'

const SELECT_ID = 'customCmdSelect'

const GROUP_I18N: Record<string, string> = {
  view: 'custom.group.view',
  layer: 'custom.group.layer',
  entity: 'custom.group.entity',
  scene: 'custom.group.scene',
  animation: 'custom.group.animation',
  interaction: 'custom.group.interaction',
}

function getSelect(): HTMLSelectElement | null {
  return document.getElementById(SELECT_ID) as HTMLSelectElement | null
}

export function initCustomCmdSelect(): void {
  const select = getSelect()
  if (!select) return

  const current = select.value
  select.replaceChildren()

  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = t('custom.cmdPlaceholder')
  select.appendChild(placeholder)

  const groups = new Map<string, HTMLOptGroupElement>()
  for (const preset of BRIDGE_COMMANDS) {
    let group = groups.get(preset.group)
    if (!group) {
      group = document.createElement('optgroup')
      group.label = t(GROUP_I18N[preset.group])
      groups.set(preset.group, group)
      select.appendChild(group)
    }
    const option = document.createElement('option')
    option.value = preset.action
    option.textContent = preset.action
    group.appendChild(option)
  }

  if (current && select.querySelector(`option[value="${current}"]`)) {
    select.value = current
  }
}

export function applySelectedCommand(): void {
  const select = getSelect()
  const textarea = document.getElementById('customCmd') as HTMLTextAreaElement | null
  if (!select?.value || !textarea) return

  const preset = BRIDGE_COMMANDS.find((c) => c.action === select.value)
  if (!preset) return

  textarea.value = JSON.stringify({ action: preset.action, params: preset.params }, null, 2)
}
