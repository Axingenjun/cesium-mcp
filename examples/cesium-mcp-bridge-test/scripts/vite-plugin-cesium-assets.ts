/**
 * 替代 vite-plugin-cesium：托管 /cesium/ 静态资源（Workers、Assets 等），无额外 npm 依赖。
 */
import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, posix } from 'node:path'
import type { Plugin } from 'vite'

const MIME: Record<string, string> = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
  '.ktx2': 'application/octet-stream',
  '.glb': 'model/gltf-binary',
}

const COPY_DIRS = ['Assets', 'ThirdParty', 'Workers', 'Widgets'] as const

export interface CesiumAssetsPluginOptions {
  /** cesium/Build/Cesium 绝对路径 */
  cesiumBuildPath: string
  /** URL 前缀，默认 cesium/ */
  cesiumBaseUrl?: string
}

export function cesiumAssetsPlugin(options: CesiumAssetsPluginOptions): Plugin {
  const { cesiumBuildPath } = options
  let baseUrl = options.cesiumBaseUrl ?? 'cesium/'
  if (!baseUrl.endsWith('/')) baseUrl += '/'

  let outDir = 'dist'
  let publicBase = '/'
  let isBuild = false

  return {
    name: 'cesium-assets',

    config(config, { command }) {
      isBuild = command === 'build'
      if (config.base !== undefined) {
        publicBase = config.base === '' ? './' : config.base
      }
      if (config.build?.outDir) {
        outDir = config.root ? join(config.root, config.build.outDir) : config.build.outDir
      }
      const resolvedBase = posix.join(publicBase.replace(/\\/g, '/'), baseUrl)
      return {
        define: {
          CESIUM_BASE_URL: JSON.stringify(resolvedBase),
        },
      }
    },

    configureServer({ middlewares }) {
      const mount = `/${baseUrl.replace(/\/$/, '')}`
      middlewares.use(mount, (req, res, next) => {
        if (!req.url) return next()
        const rel = decodeURIComponent(req.url.split('?')[0].replace(/^\//, ''))
        const file = normalize(join(cesiumBuildPath, rel))
        const root = normalize(cesiumBuildPath)
        if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
          return next()
        }
        const mime = MIME[extname(file).toLowerCase()]
        if (mime) res.setHeader('Content-Type', mime)
        res.setHeader('Access-Control-Allow-Origin', '*')
        createReadStream(file).pipe(res)
      })
    },

    transformIndexHtml() {
      const href = posix.join(publicBase.replace(/\\/g, '/'), baseUrl, 'Widgets/widgets.css')
      return [
        {
          tag: 'link',
          attrs: { rel: 'stylesheet', href },
        },
      ]
    },

    closeBundle() {
      if (!isBuild) return
      const destRoot = join(outDir, baseUrl)
      for (const dir of COPY_DIRS) {
        const src = join(cesiumBuildPath, dir)
        if (!existsSync(src)) continue
        cpSync(src, join(destRoot, dir), { recursive: true })
      }
    },
  }
}
