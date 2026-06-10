import { defineConfig, type PluginOption } from 'vite'
import cesium from 'vite-plugin-cesium'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getCesiumPaths, getBridgeEntry, getFsAllowRoots } from './scripts/resolve-deps'

const root = dirname(fileURLToPath(import.meta.url))
const cesiumPaths = getCesiumPaths()
const cesiumBuildRoot = join(cesiumPaths.root, 'Build')
const cesiumBuild = join(cesiumBuildRoot, 'Cesium')
const topojsonShim = resolve(root, 'shims/topojson-client.js')

const CESIUM_CJS_DEPS = [
  'mersenne-twister',
  'urijs',
  'bitmap-sdf',
  'grapheme-splitter',
  'pako',
  'rbush',
  'earcut',
  'lerc',
  'autolinker',
  'dompurify',
  'draco3d',
  'ktx-parse',
  'kdbush',
  '@tweenjs/tween.js',
  '@zip.js/zip.js',
]

export default defineConfig({
  plugins: [
    cesium({
      cesiumBuildRootPath: cesiumBuildRoot,
      cesiumBuildPath: cesiumBuild,
    }) as PluginOption,
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium/'),
  },
  optimizeDeps: {
    include: ['cesium-source', topojsonShim, ...CESIUM_CJS_DEPS],
    needsInterop: CESIUM_CJS_DEPS,
  },
  resolve: {
    alias: {
      'cesium-source': cesiumPaths.source,
      cesium: resolve(root, 'src/cesium/entry.ts'),
      'cesium-mcp-bridge': getBridgeEntry(),
      'topojson-client': topojsonShim,
      '@cesium/engine': cesiumPaths.engine,
      '@cesium/widgets': cesiumPaths.widgets,
    },
    dedupe: ['cesium', '@cesium/engine', '@cesium/widgets', 'heatmap.js'],
  },
  server: {
    port: 5173,
    open: true,
    fs: { allow: getFsAllowRoots() },
  },
})
