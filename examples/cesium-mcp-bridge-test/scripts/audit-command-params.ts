/** 审计全部自定义 JSON 命令的示例参数生成结果 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseActionsSource, getInlineParams } from '../src/demos/bridge-schema/parse-actions'
import { parseTypesSource } from '../src/demos/bridge-schema/parse-types'
import { buildSampleParams } from '../src/demos/bridge-schema/sample-params'
import { COMMAND_PARAM_PRESETS } from '../src/demos/bridge-schema/command-presets'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bridge = readFileSync(join(root, '../../packages/cesium-mcp-bridge/src/bridge.ts'), 'utf8')
const typesSrc = readFileSync(join(root, '../../packages/cesium-mcp-bridge/src/types.ts'), 'utf8')
const types = parseTypesSource(typesSrc)
const actions = parseActionsSource(bridge)

function resolveParams(action: string, paramsType: string | undefined, noParams?: boolean) {
  if (noParams) return { source: 'empty', params: {} }
  const inline = getInlineParams(action)
  if (inline) return { source: 'inline', params: inline }
  const preset = COMMAND_PARAM_PRESETS[action]
  if (preset) return { source: 'preset', params: preset }
  return { source: 'autogen', params: buildSampleParams(paramsType, types) }
}

let missingPreset = 0
for (const a of actions) {
  const { source, params } = resolveParams(a.action, a.paramsType, a.noParams)
  if (source === 'autogen') missingPreset++
  const keys = Object.keys(params)
  console.log(`[${source.padEnd(7)}] ${a.action.padEnd(22)} ${keys.length ? keys.join(', ') : '(empty)'}`)
}
console.log(`\nTotal: ${actions.length}, preset: ${actions.length - missingPreset}, autogen fallback: ${missingPreset}`)
