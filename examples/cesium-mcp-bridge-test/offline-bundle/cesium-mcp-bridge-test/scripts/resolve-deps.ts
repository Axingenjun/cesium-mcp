/**
 * 解析 cesium-mcp-bridge / Cesium 路径。
 * 支持 monorepo 开发、示例目录独立 npm install、内网拷贝部署。
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const exampleRoot = join(here, '..')

/** 向上查找 monorepo 根（含 packages/cesium-mcp-bridge） */
function findRepoRoot(): string {
  let dir = exampleRoot
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(dir, 'packages', 'cesium-mcp-bridge', 'package.json'))) {
      return dir
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return join(exampleRoot, '../..')
}

export const repoRoot = findRepoRoot()

const require = createRequire(join(exampleRoot, 'package.json'))

function resolvePkgRoot(name: string, searchPaths: string[]): string {
  return dirname(require.resolve(`${name}/package.json`, { paths: searchPaths }))
}

/** bridge 包根目录（源码 HMR 或 node_modules 已发布包） */
export function findBridgeRoot(): string {
  const candidates = [
    join(repoRoot, 'packages/cesium-mcp-bridge'),
    join(exampleRoot, '../cesium-mcp-bridge'),
    join(exampleRoot, '../../packages/cesium-mcp-bridge'),
  ]
  for (const p of candidates) {
    if (existsSync(join(p, 'package.json'))) return p
  }
  return resolvePkgRoot('cesium-mcp-bridge', [exampleRoot, repoRoot])
}

export const bridgeRoot = findBridgeRoot()

/** Vite alias：优先 bridge 源码，否则 dist */
export function getBridgeEntry(): string {
  const src = join(bridgeRoot, 'src/index.ts')
  if (existsSync(src)) return src
  const dist = join(bridgeRoot, 'dist/index.js')
  if (existsSync(dist)) return dist
  return require.resolve('cesium-mcp-bridge', { paths: [exampleRoot, repoRoot] })
}

const searchPaths = [bridgeRoot, repoRoot, exampleRoot]

export function resolvePkgRootFromDeps(name: string): string {
  return resolvePkgRoot(name, searchPaths)
}

export interface CesiumPaths {
  root: string
  source: string
  engine: string
  widgets: string
}

export function getCesiumPaths(): CesiumPaths {
  const root = resolvePkgRootFromDeps('cesium')
  return {
    root,
    source: join(root, 'Source/Cesium.js'),
    engine: resolvePkgRootFromDeps('@cesium/engine'),
    widgets: resolvePkgRootFromDeps('@cesium/widgets'),
  }
}

/** Vite server.fs.allow 白名单 */
export function getFsAllowRoots(): string[] {
  const roots = [exampleRoot, bridgeRoot, repoRoot, dirname(getBridgeEntry())]
  return [...new Set(roots.filter((p) => existsSync(p)))]
}
