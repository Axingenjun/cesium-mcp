let currentTheme = 'dark'

export function toggleSection(el: HTMLElement): void {
  el.parentElement?.classList.toggle('collapsed')
}

export function toggleTheme(): void {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', currentTheme)
  const themeBtn = document.getElementById('themeBtn')
  if (themeBtn) themeBtn.innerHTML = currentTheme === 'dark' ? '&#9789;' : '&#9788;'
}

export function togglePanel(): void {
  document.body.classList.toggle('panel-hidden')
  const panelToggle = document.getElementById('panelToggle')
  if (panelToggle) {
    panelToggle.innerHTML = document.body.classList.contains('panel-hidden') ? '&#9654;' : '&#9664;'
  }
  setTimeout(() => {
    if (window.viewer) window.viewer.resize()
  }, 300)
}
