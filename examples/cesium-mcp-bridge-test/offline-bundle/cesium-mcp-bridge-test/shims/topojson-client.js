/**
 * topojson-client ESM 入口无 default export，但 Cesium / Vite needsInterop 会按 default 解析。
 * 从 monorepo 根 node_modules 加载（由 cesium-mcp-bridge 的 cesium 依赖提供）。
 */
import * as topojson from '../../../node_modules/topojson-client/src/index.js'

export default topojson
export {
  bbox,
  feature,
  merge,
  mergeArcs,
  mesh,
  meshArcs,
  neighbors,
  quantize,
  transform,
  untransform,
} from '../../../node_modules/topojson-client/src/index.js'
