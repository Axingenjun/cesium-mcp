import { cmd } from '../app/bridge'
import { BASEMAPS } from '../demos/basemaps'
import { t } from './i18n'

const SELECT_ID = 'basemapSelect'

function getBasemapSelect(): HTMLSelectElement | null {
  return document.getElementById(SELECT_ID) as HTMLSelectElement | null
}

export function initBasemapSelect(): void {
  const select = getBasemapSelect()
  if (!select) return

  const current = select.value
  select.replaceChildren()

  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = t('basemap.placeholder')
  select.appendChild(placeholder)

  for (const item of BASEMAPS) {
    const option = document.createElement('option')
    option.value = item.id
    option.textContent = t(item.i18n)
    select.appendChild(option)
  }

  if (current && select.querySelector(`option[value="${current}"]`)) {
    select.value = current
  }
}

export function applySelectedBasemap(): void {
  const select = getBasemapSelect()
  if (!select?.value) return

  const item = BASEMAPS.find((b) => b.id === select.value)
  if (!item) return

  void cmd('setBasemap', { ...item.params })
}
