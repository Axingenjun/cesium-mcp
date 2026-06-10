/**
 * 启动前检查关键依赖是否已安装（monorepo hoist 与独立安装均支持）
 */
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const exampleRoot = join(here, '..')

function findSearchPaths() {
  const paths = []
  let dir = exampleRoot
  for (let i = 0; i < 6; i++) {
    paths.push(dir)
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return paths
}

const searchPaths = findSearchPaths()
const require = createRequire(join(exampleRoot, 'package.json'))

const REQUIRED = [
  'vite',
  'vite-plugin-cesium',
  'typescript',
  'cesium',
  'cesium-mcp-bridge',
  'heatmap.js',
]

const missing = []
for (const name of REQUIRED) {
  try {
    require.resolve(name, { paths: searchPaths })
  } catch {
    missing.push(name)
  }
}

if (missing.length > 0) {
  console.error('\n[cesium-mcp-bridge-test] 缺少依赖:', missing.join(', '))
  console.error('\n请在本目录或 monorepo 根目录执行:')
  console.error('  npm install')
  console.error('\n内网离线：外网机 npm install 后，连同 node_modules 整目录拷入内网；')
  console.error('monorepo 场景请拷贝整个仓库并在根目录 npm install。\n')
  process.exit(1)
}

/** 本目录 node_modules 不完整时给出提示（hoist 到根目录仍允许启动） */
const localPlugin = join(exampleRoot, 'node_modules', 'vite-plugin-cesium')
const hasLocal = existsSync(localPlugin)
const hasHoisted = searchPaths.some((p) => existsSync(join(p, 'node_modules', 'vite-plugin-cesium')))
if (!hasLocal && !hasHoisted) {
  console.error('\n[cesium-mcp-bridge-test] 未找到 vite-plugin-cesium，请执行 npm install。\n')
  process.exit(1)
}
