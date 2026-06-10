import { defineConfig } from 'vite'

import { dirname, join, resolve } from 'node:path'

import { fileURLToPath } from 'node:url'

import { getCesiumPaths, getHeatmapEntry, bridgeRoot, repoRoot } from './scripts/resolve-deps'

import { cesiumAssetsPlugin } from './scripts/vite-plugin-cesium-assets'



const root = dirname(fileURLToPath(import.meta.url))

const cesiumPaths = getCesiumPaths()

const cesiumBuild = join(cesiumPaths.root, 'Build', 'Cesium')

const topojsonShim = resolve(root, 'shims/topojson-client.js')
/** patch-package 仅修补 repo 根 node_modules，直接 alias 到该路径并由 optimizeDeps 做 CJS 互操作 */
const heatmapPatched = getHeatmapEntry()



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

    include: ['cesium-source', '@cesium/engine', topojsonShim, heatmapPatched, ...CESIUM_CJS_DEPS],

    needsInterop: ['heatmap.js', heatmapPatched, ...CESIUM_CJS_DEPS],

  },

  resolve: {

    alias: {

      'cesium-source': cesiumPaths.source,

      cesium: resolve(root, 'src/cesium/entry.ts'),

      'cesium-mcp-bridge': resolve(bridgeRoot, 'src/index.ts'),

      'topojson-client': topojsonShim,
      'heatmap.js': heatmapPatched,

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


