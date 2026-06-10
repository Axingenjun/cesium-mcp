import bridgeSource from '../../../../../packages/cesium-mcp-bridge/src/bridge.ts?raw'
import typesSource from '../../../../../packages/cesium-mcp-bridge/src/types.ts?raw'
import { parseTypesSource } from './parse-types'
import { parseActionsSource, getInlineParams, type CommandGroup } from './parse-actions'
import { buildSampleParams } from './sample-params'
import { COMMAND_PARAM_PRESETS } from './command-presets'

export interface BridgeCommandPreset {
  action: string
  params: Record<string, unknown>
  group: CommandGroup
}

function buildPresets(): BridgeCommandPreset[] {
  const types = parseTypesSource(typesSource)
  const actions = parseActionsSource(bridgeSource)

  return actions.map(({ action, paramsType, group, noParams }) => {
    let params: Record<string, unknown> = {}
    if (!noParams) {
      const inline = getInlineParams(action)
      const preset = COMMAND_PARAM_PRESETS[action]
      params = inline ?? preset ?? buildSampleParams(paramsType, types)
    }
    return { action, params, group }
  })
}

export const BRIDGE_COMMANDS: BridgeCommandPreset[] = buildPresets()

export function getCommandPreset(action: string): BridgeCommandPreset | undefined {
  return BRIDGE_COMMANDS.find((c) => c.action === action)
}
