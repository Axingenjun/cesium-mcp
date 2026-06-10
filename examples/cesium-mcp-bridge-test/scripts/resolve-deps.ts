/**
 * 从 cesium-mcp-bridge / monorepo 根目录解析 Cesium 相关包，避免 example 重复安装。
 */
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const exampleRoot = join(here, '..')
export const repoRoot = join(exampleRoot, '../..')
export const bridgeRoot = join(repoRoot, 'packages/cesium-mcp-bridge')

const require = createRequire(join(exampleRoot, 'package.json'))
const searchPaths = [bridgeRoot, repoRoot, exampleRoot]

export function resolvePkgRoot(name: string): string {
  return dirname(require.resolve(`${name}/package.json`, { paths: searchPaths }))
}

export interface CesiumPaths {
  root: string
  source: string
  engine: string
  widgets: string
}

export function getCesiumPaths(): CesiumPaths {
  const root = resolvePkgRoot('cesium')
  return {
    root,
    source: join(root, 'Source/Cesium.js'),
    engine: resolvePkgRoot('@cesium/engine'),
    widgets: resolvePkgRoot('@cesium/widgets'),
  }
}

/** patch-package 仅修补 repo 根 node_modules，示例子目录副本未打补丁 */
export function getHeatmapEntry(): string {
  return join(repoRoot, 'node_modules/heatmap.js/build/heatmap.js')
}
