import * as Cesium from 'cesium'
import { CESIUM_CONTAINER_ID, NATURAL_EARTH_TILE, NATURAL_EARTH_TMS } from '../config'

let coordHandler: Cesium.ScreenSpaceEventHandler | undefined

function waitForContainerSize(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const tryResolve = () => {
      if (el.clientWidth > 0 && el.clientHeight > 0) {
        resolve()
        return
      }
      requestAnimationFrame(tryResolve)
    }
    tryResolve()
  })
}

function clearContainer(el: HTMLElement): void {
  el.innerHTML = ''
}

function applyFallbackGlobe(viewer: Cesium.Viewer): void {
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1a3a52')
  viewer.scene.globe.showGroundAtmosphere = true
  console.warn('[viewer] 离线影像加载失败，已回退为纯色地球')
}

function createNaturalEarthProvider(): Cesium.UrlTemplateImageryProvider {
  return new Cesium.UrlTemplateImageryProvider({
    url: NATURAL_EARTH_TMS,
    tilingScheme: new Cesium.GeographicTilingScheme(),
    maximumLevel: 2,
    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
    credit: 'Natural Earth II',
  })
}

async function attachOfflineImagery(viewer: Cesium.Viewer): Promise<void> {
  try {
    viewer.imageryLayers.addImageryProvider(createNaturalEarthProvider())
    console.info('[viewer] 已加载 Natural Earth II TMS（cesium 包 /cesium/Assets/Textures）')
    return
  } catch (err) {
    console.warn('[viewer] TMS 影像加载失败，尝试单张贴图', err)
  }

  try {
    const tileProvider = await Cesium.SingleTileImageryProvider.fromUrl(NATURAL_EARTH_TILE, {
      rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
    })
    viewer.imageryLayers.addImageryProvider(tileProvider)
    console.info('[viewer] 已加载离线单张影像:', NATURAL_EARTH_TILE)
    return
  } catch (err) {
    console.warn('[viewer] 单张影像加载失败', err)
  }

  applyFallbackGlobe(viewer)
}

export async function createViewer(containerId = CESIUM_CONTAINER_ID): Promise<Cesium.Viewer> {
  const containerEl = document.getElementById(containerId)
  if (!containerEl) {
    throw new Error(`Container #${containerId} not found`)
  }

  await waitForContainerSize(containerEl)
  clearContainer(containerEl)

  const viewer = new Cesium.Viewer(containerEl, {
    baseLayer: false,
    terrainProvider: new Cesium.EllipsoidTerrainProvider(),
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    timeline: false,
    animation: false,
  })

  viewer.resize()
  await attachOfflineImagery(viewer)
  viewer.resize()
  viewer.scene.requestRender()

  return viewer
}

export function bindCoordBar(viewer: Cesium.Viewer): void {
  if (coordHandler && !coordHandler.isDestroyed()) {
    coordHandler.destroy()
  }

  const coordBar = document.getElementById('coordBar')
  if (!coordBar) return

  coordHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  coordHandler.setInputAction((movement: { endPosition: Cesium.Cartesian2 }) => {
    const ray = viewer.camera.getPickRay(movement.endPosition)
    if (!ray) return
    const pos = viewer.scene.globe.pick(ray, viewer.scene)
    if (!pos) return
    const carto = Cesium.Cartographic.fromCartesian(pos)
    coordBar.textContent = `${Cesium.Math.toDegrees(carto.longitude).toFixed(5)}, ${Cesium.Math.toDegrees(carto.latitude).toFixed(5)}, ${carto.height.toFixed(1)}m`
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

export function destroyViewer(viewer: Cesium.Viewer | undefined): void {
  if (coordHandler && !coordHandler.isDestroyed()) {
    coordHandler.destroy()
    coordHandler = undefined
  }

  if (viewer && !viewer.isDestroyed()) {
    viewer.destroy()
  }

  const containerEl = document.getElementById(CESIUM_CONTAINER_ID)
  if (containerEl) clearContainer(containerEl)
}
