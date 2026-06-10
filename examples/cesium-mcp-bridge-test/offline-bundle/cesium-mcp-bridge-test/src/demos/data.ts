export const CITIES = [
  { name: '北京', lon: 116.39, lat: 39.91, pop: 2189 },
  { name: '上海', lon: 121.47, lat: 31.23, pop: 2487 },
  { name: '广州', lon: 113.26, lat: 23.13, pop: 1868 },
  { name: '深圳', lon: 114.06, lat: 22.54, pop: 1756 },
  { name: '成都', lon: 104.07, lat: 30.67, pop: 2094 },
  { name: '重庆', lon: 106.55, lat: 29.56, pop: 3205 },
  { name: '杭州', lon: 120.15, lat: 30.28, pop: 1194 },
  { name: '武汉', lon: 114.30, lat: 30.59, pop: 1121 },
  { name: '西安', lon: 108.94, lat: 34.26, pop: 1295 },
  { name: '南京', lon: 118.80, lat: 32.06, pop: 942 },
] as const

/** 视图控制 flyTo 目的地（与原按钮参数一致） */
export const FLY_CITIES = [
  { id: 'beijing', i18n: 'city.beijing', lon: 116.39, lat: 39.91, height: 8000 },
  { id: 'shanghai', i18n: 'city.shanghai', lon: 121.47, lat: 31.23, height: 8000 },
  { id: 'guangzhou', i18n: 'city.guangzhou', lon: 113.26, lat: 23.13, height: 8000 },
  { id: 'chengdu', i18n: 'city.chengdu', lon: 104.07, lat: 30.67, height: 8000 },
  { id: 'shenzhen', i18n: 'city.shenzhen', lon: 114.06, lat: 22.54, height: 5000 },
  { id: 'chongqing', i18n: 'city.chongqing', lon: 106.55, lat: 29.56, height: 8000 },
  { id: 'hangzhou', i18n: 'city.hangzhou', lon: 120.15, lat: 30.28, height: 8000 },
  { id: 'xian', i18n: 'city.xian', lon: 108.94, lat: 34.26, height: 8000 },
] as const

export function cityGeoJson() {
  return {
    type: 'FeatureCollection',
    features: CITIES.map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [c.lon, c.lat] },
      properties: { name: c.name, population: c.pop },
    })),
  }
}
