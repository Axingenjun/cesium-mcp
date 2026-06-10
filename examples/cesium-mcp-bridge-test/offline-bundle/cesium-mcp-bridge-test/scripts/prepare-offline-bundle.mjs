/**
 * 外网机执行一次，生成可拷入内网、无需 npm install 的离线开发包。
 *
 * 用法:
 *   npm run prepare:offline --prefix examples/cesium-mcp-bridge-test
 *
 * 输出: offline-bundle/
 *   cesium-mcp-bridge/          bridge 源码
 *   cesium-mcp-bridge-test/     示例 + 完整 node_modules
 *     dev.cmd / dev.sh          内网直接启动（仅需 Node.js）
 */
import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const exampleRoot = join(here, '..')

function findRepoRoot() {
  let dir = exampleRoot
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(dir, 'packages', 'cesium-mcp-bridge', 'package.json'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return join(exampleRoot, '../..')
}

const repoRoot = findRepoRoot()
const bridgeSrc = join(repoRoot, 'packages/cesium-mcp-bridge')
const bundleRoot = join(exampleRoot, 'offline-bundle')
const bundleBridge = join(bundleRoot, 'cesium-mcp-bridge')
const bundleTest = join(bundleRoot, 'cesium-mcp-bridge-test')

const SKIP = new Set(['node_modules', 'dist', 'offline-bundle', '.vite', '.git'])

function copyDir(src, dest, filter) {
  mkdirSync(dest, { recursive: true })
  for (const name of readdirSync(src)) {
    if (filter && !filter(name)) continue
    cpSync(join(src, name), join(dest, name), { recursive: true, force: true })
  }
}

if (!existsSync(bridgeSrc)) {
  console.error('[prepare-offline] 未找到 packages/cesium-mcp-bridge，请在 monorepo 内执行')
  process.exit(1)
}

console.log('[prepare-offline] 清理输出目录...')
rmSync(bundleRoot, { recursive: true, force: true })
mkdirSync(bundleTest, { recursive: true })

console.log('[prepare-offline] 拷贝 cesium-mcp-bridge ...')
copyDir(bridgeSrc, bundleBridge, (name) => !['node_modules', 'dist', '.git'].includes(name))

console.log('[prepare-offline] 拷贝 cesium-mcp-bridge-test ...')
copyDir(exampleRoot, bundleTest, (name) => !SKIP.has(name))

const pkg = JSON.parse(readFileSync(join(exampleRoot, 'package.json'), 'utf8'))
pkg.dependencies = {
  'cesium-mcp-bridge': 'file:../cesium-mcp-bridge',
  cesium: pkg.dependencies?.cesium ?? '~1.142.0',
  'heatmap.js': pkg.dependencies?.['heatmap.js'] ?? '^2.0.5',
}
delete pkg.scripts.predev
delete pkg.scripts.prebuild
pkg.scripts.dev = 'node node_modules/vite/bin/vite.js'
writeFileSync(join(bundleTest, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)

writeFileSync(
  join(bundleTest, 'dev.cmd'),
  '@echo off\r\ncd /d "%~dp0"\r\nnode node_modules\\vite\\bin\\vite.js\r\n',
)
writeFileSync(
  join(bundleTest, 'dev.sh'),
  '#!/bin/sh\ncd "$(dirname "$0")"\nnode node_modules/vite/bin/vite.js\n',
)

writeFileSync(
  join(bundleRoot, 'README-内网使用.txt'),
  `cesium-mcp-bridge-test 离线开发包
================================

内网机要求：仅需安装 Node.js（无需 npm install，无需外网）。

启动：
  Windows: 进入 cesium-mcp-bridge-test 目录，双击 dev.cmd
  Linux/Mac: cd cesium-mcp-bridge-test && sh dev.sh

浏览器打开 http://localhost:5173/

目录结构：
  cesium-mcp-bridge/          bridge 源码（HMR）
  cesium-mcp-bridge-test/     示例 + node_modules（已预装）

本包由外网机 npm run prepare:offline 生成，请勿删除 node_modules。
`,
)

console.log('[prepare-offline] 安装依赖到离线包（install-strategy=nested）...')
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const install = spawnSync(
  npmCmd,
  ['install', '--install-strategy=nested', '--no-audit', '--no-fund'],
  { cwd: bundleTest, stdio: 'inherit', shell: process.platform === 'win32' },
)
if (install.status !== 0) {
  console.error('[prepare-offline] npm install 失败')
  process.exit(install.status ?? 1)
}

if (!existsSync(join(bundleTest, 'node_modules', 'vite-plugin-cesium'))) {
  console.error('[prepare-offline] 错误: node_modules 中缺少 vite-plugin-cesium')
  process.exit(1)
}

console.log('\n[prepare-offline] 完成!')
console.log(`  输出: ${bundleRoot}`)
console.log('  将 offline-bundle 整文件夹拷入内网，运行 cesium-mcp-bridge-test/dev.cmd\n')
