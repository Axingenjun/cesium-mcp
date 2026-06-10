import { cmd } from '../app/bridge'
import { FLY_CITIES } from '../demos/data'
import { t } from './i18n'

const SELECT_ID = 'citySelect'

function getCitySelect(): HTMLSelectElement | null {
  return document.getElementById(SELECT_ID) as HTMLSelectElement | null
}

export function initCitySelect(): void {
  const select = getCitySelect()
  if (!select) return

  const current = select.value
  select.replaceChildren()

  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = t('view.cityPlaceholder')
  select.appendChild(placeholder)

  for (const city of FLY_CITIES) {
    const option = document.createElement('option')
    option.value = city.id
    option.dataset.i18nKey = city.i18n
    option.textContent = t(city.i18n)
    select.appendChild(option)
  }

  if (current && select.querySelector(`option[value="${current}"]`)) {
    select.value = current
  }
}

export function flyToSelectedCity(): void {
  const select = getCitySelect()
  if (!select?.value) return

  const city = FLY_CITIES.find((c) => c.id === select.value)
  if (!city) return

  void cmd('flyTo', {
    longitude: city.lon,
    latitude: city.lat,
    height: city.height,
    duration: 2,
  })
}

export function initViewControl(): void {
  initCitySelect()
}
