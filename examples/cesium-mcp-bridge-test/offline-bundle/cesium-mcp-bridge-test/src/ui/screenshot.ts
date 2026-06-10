let lastScreenshotUrl = ''

export function showScreenshot(dataUrl: string): void {
  lastScreenshotUrl = dataUrl
  const img = document.getElementById('ssImg') as HTMLImageElement
  const time = document.getElementById('ssTime')
  const preview = document.getElementById('screenshotPreview')
  if (img) img.src = dataUrl
  if (time) time.textContent = new Date().toLocaleTimeString()
  if (preview) preview.style.display = 'block'
}

export function closeScreenshot(): void {
  const preview = document.getElementById('screenshotPreview')
  if (preview) preview.style.display = 'none'
}

export function downloadScreenshot(): void {
  const a = document.createElement('a')
  a.href = lastScreenshotUrl
  a.download = `cesium-screenshot-${Date.now()}.png`
  a.click()
}
