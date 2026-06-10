const STACK_ID = 'mapOverlayStack'

export function mountMapOverlayStack(): HTMLElement | null {
  const wrap = document.querySelector('.map-wrap')
  if (!wrap) return null

  let stack = document.getElementById(STACK_ID)
  if (!stack) {
    stack = document.createElement('div')
    stack.id = STACK_ID
    stack.className = 'map-overlay-stack'
    wrap.appendChild(stack)
  }
  return stack
}

export function getMapOverlayStack(): HTMLElement | null {
  return document.getElementById(STACK_ID)
}
