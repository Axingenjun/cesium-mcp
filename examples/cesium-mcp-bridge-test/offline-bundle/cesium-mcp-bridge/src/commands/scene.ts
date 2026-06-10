import * as Cesium from 'cesium'
import type { SetSceneOptionsParams, SetPostProcessParams, SetEdgeDisplayModeParams, SetEdgeDisplayModeResult } from '../types'
import { parseColor } from '../utils'
import type { LayerManager } from './layer'

export function setSceneOptions(viewer: Cesium.Viewer, params: SetSceneOptionsParams): void {
  const { scene } = viewer

  // Fog
  if (params.fogEnabled !== undefined) scene.fog.enabled = params.fogEnabled
  if (params.fogDensity !== undefined) scene.fog.density = params.fogDensity
  if (params.fogMinimumBrightness !== undefined) scene.fog.minimumBrightness = params.fogMinimumBrightness

  // Sky Atmosphere
  if (scene.skyAtmosphere) {
    if (params.skyAtmosphereShow !== undefined) scene.skyAtmosphere.show = params.skyAtmosphereShow
    if (params.skyAtmosphereHueShift !== undefined) scene.skyAtmosphere.hueShift = params.skyAtmosphereHueShift
    if (params.skyAtmosphereSaturationShift !== undefined) scene.skyAtmosphere.saturationShift = params.skyAtmosphereSaturationShift
    if (params.skyAtmosphereBrightnessShift !== undefined) scene.skyAtmosphere.brightnessShift = params.skyAtmosphereBrightnessShift
  }

  // Ground Atmosphere
  if (params.groundAtmosphereShow !== undefined) scene.globe.showGroundAtmosphere = params.groundAtmosphereShow

  // Shadows
  if (params.shadowsEnabled !== undefined) viewer.shadows = params.shadowsEnabled
  if (params.shadowsSoftShadows !== undefined) scene.shadowMap.softShadows = params.shadowsSoftShadows
  if (params.shadowsDarkness !== undefined) scene.shadowMap.darkness = params.shadowsDarkness

  // Sun & Moon
  if (scene.sun && params.sunShow !== undefined) scene.sun.show = params.sunShow
  if (scene.sun && params.sunGlowFactor !== undefined) scene.sun.glowFactor = params.sunGlowFactor
  if (scene.moon && params.moonShow !== undefined) scene.moon.show = params.moonShow

  // Globe
  if (params.depthTestAgainstTerrain !== undefined) scene.globe.depthTestAgainstTerrain = params.depthTestAgainstTerrain

  // Background Color
  if (params.backgroundColor !== undefined) scene.backgroundColor = parseColor(params.backgroundColor)
}

export function setPostProcess(viewer: Cesium.Viewer, params: SetPostProcessParams): void {
  const stages = viewer.scene.postProcessStages

  // Bloom
  if (params.bloom !== undefined) stages.bloom.enabled = params.bloom
  if (params.bloom || stages.bloom.enabled) {
    const bloom = stages.bloom
    if (params.bloomContrast !== undefined) bloom.uniforms.contrast = params.bloomContrast
    if (params.bloomBrightness !== undefined) bloom.uniforms.brightness = params.bloomBrightness
    if (params.bloomDelta !== undefined) bloom.uniforms.delta = params.bloomDelta
    if (params.bloomSigma !== undefined) bloom.uniforms.sigma = params.bloomSigma
    if (params.bloomStepSize !== undefined) bloom.uniforms.stepSize = params.bloomStepSize
    if (params.bloomGlowOnly !== undefined) bloom.uniforms.glowOnly = params.bloomGlowOnly
  }

  // Ambient Occlusion (SSAO)
  if (params.ambientOcclusion !== undefined) stages.ambientOcclusion.enabled = params.ambientOcclusion
  if (params.ambientOcclusion || stages.ambientOcclusion.enabled) {
    const ao = stages.ambientOcclusion
    if (params.aoIntensity !== undefined) ao.uniforms.intensity = params.aoIntensity
    if (params.aoBias !== undefined) ao.uniforms.bias = params.aoBias
    if (params.aoLengthCap !== undefined) ao.uniforms.lengthCap = params.aoLengthCap
    if (params.aoStepSize !== undefined) ao.uniforms.stepSize = params.aoStepSize
  }

  // FXAA
  if (params.fxaa !== undefined) stages.fxaa.enabled = params.fxaa
}

type EdgeDisplayModeValue = number

function resolveEdgeMode(mode: string): EdgeDisplayModeValue | undefined {
  const enumObj = (Cesium as typeof Cesium & {
    EdgeDisplayMode?: {
      SURFACES_ONLY: EdgeDisplayModeValue
      SURFACES_AND_EDGES: EdgeDisplayModeValue
      EDGES_ONLY: EdgeDisplayModeValue
    }
  }).EdgeDisplayMode

  const map: Record<string, EdgeDisplayModeValue> = enumObj
    ? {
        surfaces_only: enumObj.SURFACES_ONLY,
        surfaces_and_edges: enumObj.SURFACES_AND_EDGES,
        edges_only: enumObj.EDGES_ONLY,
      }
    : {
        // Cesium < 1.142 has no EdgeDisplayMode export; keep numeric values aligned with the enum.
        surfaces_only: 0,
        surfaces_and_edges: 1,
        edges_only: 2,
      }

  return map[mode]
}

export function setEdgeDisplayMode(
  viewer: Cesium.Viewer,
  layerManager: LayerManager,
  params: SetEdgeDisplayModeParams,
): SetEdgeDisplayModeResult {
  if (!(Cesium as typeof Cesium & { EdgeDisplayMode?: unknown }).EdgeDisplayMode) {
    throw new Error('setEdgeDisplayMode requires Cesium >= 1.142 (EdgeDisplayMode)')
  }

  const mode = resolveEdgeMode(params.mode)
  if (mode === undefined) {
    throw new Error(`Invalid edge display mode: ${params.mode}`)
  }

  let applied = 0

  if (params.tilesetId) {
    // Apply to specific tileset by layer ID
    const refs = layerManager.getCesiumRefs(params.tilesetId)
    if (refs?.tileset) {
      refs.tileset.edgeDisplayMode = mode
      applied = 1
    }
  } else {
    // Apply to all 3D Tilesets in scene primitives
    const primitives = viewer.scene.primitives
    for (let i = 0; i < primitives.length; i++) {
      const p = primitives.get(i)
      if (p instanceof Cesium.Cesium3DTileset) {
        p.edgeDisplayMode = mode
        applied++
      }
    }
  }

  return { applied }
}
