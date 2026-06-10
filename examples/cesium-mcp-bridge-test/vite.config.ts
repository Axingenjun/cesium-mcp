import { defineConfig } from 'vite'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getCesiumPaths, bridgeRoot, repoRoot } from './scripts/resolve-deps'
import { cesiumAssetsPlugin } from './scripts/vite-plugin-cesium-assets'

const root = dirname(fileURLToPath(import.meta.url))
const cesiumPaths = getCesiumPaths()
const cesiumBuild = join(cesiumPaths.root, 'Build', 'Cesium')
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
    cesiumAssetsPlugin({ cesiumBuildPath: cesiumBuild }),
  ],
  optimizeDeps: {
    include: ['cesium-source', topojsonShim, ...CESIUM_CJS_DEPS],
    needsInterop: CESIUM_CJS_DEPS,
  },
  resolve: {
    alias: {
      'cesium-source': cesiumPaths.source,
      cesium: resolve(root, 'src/cesium/entry.ts'),
      'cesium-mcp-bridge': resolve(bridgeRoot, 'src/index.ts'),
      'topojson-client': topojsonShim,
      '@cesium/engine': cesiumPaths.engine,
      '@cesium/widgets': cesiumPaths.widgets,
    },
    dedupe: ['cesium', '@cesium/engine', '@cesium/widgets', 'heatmap.js'],
  },
  server: {
    port: 5173,
    open: true,
    fs: { allow: [repoRoot] },
  },
})
