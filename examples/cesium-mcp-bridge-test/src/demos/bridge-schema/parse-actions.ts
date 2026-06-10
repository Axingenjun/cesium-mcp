/** 从 cesium-mcp-bridge bridge.ts execute() 源码解析 action 与参数类型映射 */

export type CommandGroup = 'view' | 'layer' | 'entity' | 'scene' | 'animation' | 'interaction'

export interface ParsedAction {
  action: string
  paramsType?: string
  group: CommandGroup
  noParams?: boolean
}

const SECTION_GROUP: [RegExp, CommandGroup][] = [
  [/Camera/i, 'view'],
  [/Entity Types/i, 'entity'],
  [/Animation/i, 'animation'],
  [/Scene\s*&\s*Post/i, 'scene'],
  [/Batch\s*&\s*Query/i, 'entity'],
  [/Viewpoint/i, 'view'],
]

const LAYER_ACTIONS = new Set([
  'addGeoJsonLayer', 'addGeoJsonPrimitive', 'addHeatmap', 'listLayers', 'getLayerSchema',
  'removeLayer', 'setLayerVisibility', 'updateLayerStyle', 'setBasemap', 'clearAll',
])

const INTERACTION_ACTIONS = new Set(['screenshot', 'highlight', 'measure'])

const SCENE_ACTIONS = new Set([
  'load3dTiles', 'load3dGaussianSplat', 'loadTerrain', 'loadImageryService',
  'loadCzml', 'loadKml', 'setSceneOptions', 'setPostProcess', 'setEdgeDisplayMode',
  'setGlobeLighting', 'setIonToken', 'exportScene',
])

const ANIMATION_ACTIONS = new Set([
  'playTrajectory', 'createAnimation', 'controlAnimation', 'removeAnimation',
  'listAnimations', 'updateAnimationPath', 'trackEntity', 'controlClock',
])

const VIEW_ACTIONS = new Set([
  'flyTo', 'setView', 'getView', 'zoomToExtent', 'lookAtTransform',
  'startOrbit', 'stopOrbit', 'setCameraOptions', 'saveViewpoint', 'loadViewpoint', 'listViewpoints',
])

const NO_PARAMS_ACTIONS = new Set([
  'getView', 'stopOrbit', 'screenshot', 'clearAll', 'listLayers',
  'listAnimations', 'listViewpoints', 'exportScene', 'queryEntities',
])

/** 无独立 Params 接口、由 execute 内联解构的特殊命令 */
const INLINE_PARAMS: Record<string, Record<string, unknown>> = {
  removeLayer: { id: 'demo-layer' },
  setLayerVisibility: { id: 'cities', visible: true },
  setIonToken: { token: 'YOUR_ION_TOKEN' },
}

/** 根据 Params 类型名推断分组（新增 action 时比静态白名单更可靠） */
function inferGroupFromParamsType(paramsType?: string): CommandGroup | undefined {
  if (!paramsType) return undefined
  if (/FlyTo|SetView|ViewState|ZoomTo|LookAt|Orbit|Camera|Viewpoint/i.test(paramsType)) return 'view'
  if (/Layer|Basemap|GeoJson|Heatmap/i.test(paramsType)) return 'layer'
  if (/Screenshot|Highlight|Measure/i.test(paramsType)) return 'interaction'
  if (/Animation|Trajectory|Clock|TrackEntity/i.test(paramsType)) return 'animation'
  if (/Tiles|Terrain|Imagery|Czml|Kml|Scene|PostProcess|Globe|Gaussian|EdgeDisplay/i.test(paramsType)) return 'scene'
  if (/Entity|Marker|Label|Polyline|Polygon|Model|Billboard|Box|Corridor|Cylinder|Ellipse|Rectangle|Wall|Batch|Query/i.test(paramsType)) {
    return 'entity'
  }
  return undefined
}

/** 根据 action 命名前缀推断（覆盖 flyToABC 等自定义视图命令） */
function inferGroupFromActionName(action: string): CommandGroup | undefined {
  if (/^flyTo/i.test(action)) return 'view'
  if (/^(setView|getView|zoomTo|lookAt|startOrbit|stopOrbit|setCamera|saveViewpoint|loadViewpoint|listViewpoints)/.test(action)) return 'view'
  if (/^(addGeoJson|addHeatmap|listLayers|getLayerSchema|removeLayer|setLayer|updateLayer|setBasemap|clearAll)/.test(action)) return 'layer'
  if (/^(screenshot|highlight|measure)/.test(action)) return 'interaction'
  if (/^(load3d|loadTerrain|loadImagery|loadCzml|loadKml|setScene|setPost|setEdge|setGlobe|setIon|exportScene)/.test(action)) return 'scene'
  if (/^(playTrajectory|createAnimation|controlAnimation|removeAnimation|listAnimations|updateAnimation|trackEntity|controlClock)/.test(action)) return 'animation'
  if (/^add/.test(action) || /Entity/i.test(action)) return 'entity'
  return undefined
}

function inferGroup(action: string, sectionGroup?: CommandGroup, paramsType?: string): CommandGroup {
  if (sectionGroup) return sectionGroup
  if (VIEW_ACTIONS.has(action)) return 'view'
  if (LAYER_ACTIONS.has(action)) return 'layer'
  if (INTERACTION_ACTIONS.has(action)) return 'interaction'
  if (SCENE_ACTIONS.has(action)) return 'scene'
  if (ANIMATION_ACTIONS.has(action)) return 'animation'
  const fromType = inferGroupFromParamsType(paramsType)
  if (fromType) return fromType
  const fromName = inferGroupFromActionName(action)
  if (fromName) return fromName
  return 'view'
}

function extractParamsType(caseBlock: string): string | undefined {
  const m = caseBlock.match(/p\s+as\s+([\w&]+)/)
  if (!m) return undefined
  return m[1].split('&')[0].trim()
}

export function parseActionsSource(source: string): ParsedAction[] {
  const executeMatch = source.match(/async execute\(cmd[\s\S]*?switch\s*\(cmd\.action\)\s*\{([\s\S]*?)\n\s*default:/)
  if (!executeMatch) return []

  const body = executeMatch[1]
  const actions: ParsedAction[] = []
  let currentSection: CommandGroup | undefined

  const caseRe = /\/\/\s*=+\s*(.+?)\s*=+[\r\n]+|case\s+'([^']+)':([\s\S]*?)(?=case\s+'|\/\/\s*=+\s*[^=]|$)/g
  let m: RegExpExecArray | null
  while ((m = caseRe.exec(body)) !== null) {
    if (m[1]) {
      for (const [re, group] of SECTION_GROUP) {
        if (re.test(m[1])) {
          currentSection = group
          break
        }
      }
      continue
    }
    const action = m[2]
    const caseBlock = m[3]
    const paramsType = extractParamsType(caseBlock)
    actions.push({
      action,
      paramsType,
      group: inferGroup(action, currentSection, paramsType),
      noParams: NO_PARAMS_ACTIONS.has(action),
    })
  }
  return actions
}

export function getInlineParams(action: string): Record<string, unknown> | undefined {
  return INLINE_PARAMS[action]
}
