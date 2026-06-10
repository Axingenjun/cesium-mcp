import '../styles/app.css'
import './app/window-api'
import { initUi } from './app/init-ui'
import { exposeCesiumGlobal, mount, reportInitError } from './bootstrap'

initUi()
exposeCesiumGlobal()
void mount().catch(reportInitError)

if (import.meta.hot) {
  import.meta.hot.accept('cesium-mcp-bridge', async () => {
    try {
      await mount()
      console.log('[HMR] cesium-mcp-bridge reloaded')
    } catch (err) {
      console.error('[HMR] reload failed:', err)
    }
  })
}
