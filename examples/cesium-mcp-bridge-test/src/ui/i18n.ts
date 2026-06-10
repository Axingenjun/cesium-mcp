export type Lang = 'zh' | 'en'

const I18N = {
  zh: {
    'ws.online': '已连接', 'ws.offline': '离线', 'ws.failed': '连接失败', 'ws.error': '错误',
    'sec.view': '视图控制', 'sec.geojson': 'GeoJSON 图层', 'sec.markers': '标注与实体',
    'sec.basemap': '底图切换', 'sec.trajectory': '轨迹回放', 'sec.heatmap': '热力图',
    'sec.3d': '3D Tiles / 地形 / 影像', 'sec.style': '样式与高亮', 'sec.layers': '图层管理',
    'sec.custom': '自定义 JSON 命令', 'sec.log': '运行日志',
    'custom.cmdLabel': '选择命令', 'custom.cmdPlaceholder': '请选择命令…',
    'custom.group.view': '视图控制', 'custom.group.layer': '图层管理',
    'custom.group.entity': '实体', 'custom.group.scene': '三维场景',
    'custom.group.animation': '动画', 'custom.group.interaction': '交互',
    'city.beijing': '北京', 'city.shanghai': '上海', 'city.guangzhou': '广州',
    'city.chengdu': '成都', 'city.shenzhen': '深圳', 'city.chongqing': '重庆',
    'city.hangzhou': '杭州', 'city.xian': '西安',
    'btn.getView': '获取视角', 'btn.screenshot': '截图',
    'view.cityLabel': '选择城市', 'view.cityPlaceholder': '请选择城市…',
    'basemap.label': '选择底图', 'basemap.placeholder': '请选择底图…',
    'basemap.osm': 'OSM', 'basemap.arcgis': 'ArcGIS', 'basemap.light': 'Light',
    'basemap.dark': 'Dark', 'basemap.satellite': 'Satellite',
    'hint.basemap': '在线底图需外网；默认使用 Cesium 内置 Natural Earth II',
    'btn.chinaCities': '中国主要城市', 'btn.randomPoly': '随机多边形', 'btn.yellowModel': '黄色挤压面', 'btn.airline': '航线图层',
    'btn.rmCities': '- 城市', 'btn.rmPoly': '- 多边形', 'btn.rmYellowModel': '- 挤压面', 'btn.rmAirline': '- 航线',
    'btn.cityLabels': '城市标注', 'btn.tiananmen': '天安门', 'btn.bund': '外滩',
    'btn.tdtVec': '天地图矢量', 'btn.tdtImg': '天地图影像',
    'btn.amap': '高德地图', 'btn.amapSat': '高德卫星',
    'btn.bjsh': '北京-上海轨迹', 'btn.circle': '环形轨迹',
    'btn.popHeat': '城市人口热力图', 'btn.randHeat': '随机 200 点', 'btn.rmHeat': '- 热力图',
    'btn.3dBuildings': '3D 建筑', 'btn.terrain': '世界地形',
    'hint.3d': '使用 Cesium Ion 示例数据 (96188, 1, 3954)，需外网',
    'btn.redStyle': '红色样式', 'btn.greenStyle': '绿色样式',
    'btn.hlFirst': '高亮 #0', 'btn.clearHl': '清除高亮',
    'hint.style': '需先添加城市图层',
    'layer.empty': '暂无图层', 'btn.refresh': '刷新',
    'btn.execute': '执行', 'log.ready': '就绪',
  },
  en: {
    'ws.online': 'Connected', 'ws.offline': 'Offline', 'ws.failed': 'Failed', 'ws.error': 'Error',
    'sec.view': 'View Control', 'sec.geojson': 'GeoJSON Layers', 'sec.markers': 'Markers & Labels',
    'sec.basemap': 'Basemap', 'sec.trajectory': 'Trajectory Playback', 'sec.heatmap': 'Heatmap',
    'sec.3d': '3D Tiles / Terrain / Imagery', 'sec.style': 'Style & Highlight', 'sec.layers': 'Layer Manager',
    'sec.custom': 'Custom JSON Command', 'sec.log': 'Activity Log',
    'custom.cmdLabel': 'Select Command', 'custom.cmdPlaceholder': 'Choose a command…',
    'custom.group.view': 'View Control', 'custom.group.layer': 'Layer Management',
    'custom.group.entity': 'Entities', 'custom.group.scene': '3D Scene',
    'custom.group.animation': 'Animation', 'custom.group.interaction': 'Interaction',
    'city.beijing': 'Beijing', 'city.shanghai': 'Shanghai', 'city.guangzhou': 'Guangzhou',
    'city.chengdu': 'Chengdu', 'city.shenzhen': 'Shenzhen', 'city.chongqing': 'Chongqing',
    'city.hangzhou': 'Hangzhou', 'city.xian': "Xi'an",
    'btn.getView': 'Get View', 'btn.screenshot': 'Screenshot',
    'view.cityLabel': 'Select City', 'view.cityPlaceholder': 'Choose a city…',
    'basemap.label': 'Select Basemap', 'basemap.placeholder': 'Choose a basemap…',
    'basemap.osm': 'OSM', 'basemap.arcgis': 'ArcGIS', 'basemap.light': 'Light',
    'basemap.dark': 'Dark', 'basemap.satellite': 'Satellite',
    'hint.basemap': 'Online basemaps require network; default is Natural Earth II',
    'btn.chinaCities': 'China Cities', 'btn.randomPoly': 'Random Polygon', 'btn.yellowModel': 'Yellow Extruded', 'btn.airline': 'Airline Route',
    'btn.rmCities': '- cities', 'btn.rmPoly': '- polygon', 'btn.rmYellowModel': '- yellow model', 'btn.rmAirline': '- airline',
    'btn.cityLabels': 'City Labels', 'btn.tiananmen': 'Tiananmen', 'btn.bund': 'The Bund',
    'btn.tdtVec': 'Tianditu Vec', 'btn.tdtImg': 'Tianditu Img', 'btn.amap': 'Amap', 'btn.amapSat': 'Amap Satellite',
    'btn.bjsh': 'BJ - SH Route', 'btn.circle': 'Circular Path',
    'btn.popHeat': 'Population Heatmap', 'btn.randHeat': 'Random 200pts', 'btn.rmHeat': '- heatmap',
    'btn.3dBuildings': '3D Buildings', 'btn.terrain': 'World Terrain',
    'hint.3d': 'Uses Cesium Ion sample assets (96188, 1, 3954), requires network',
    'btn.redStyle': 'Red Style', 'btn.greenStyle': 'Green Style',
    'btn.hlFirst': 'Highlight #0', 'btn.clearHl': 'Clear Highlight',
    'hint.style': 'Add cities layer first',
    'layer.empty': 'No layers', 'btn.refresh': 'Refresh',
    'btn.execute': 'Execute', 'log.ready': 'Ready',
  },
} as const

let currentLang: Lang = 'zh'

export function t(key: string): string {
  const dict = I18N[currentLang] as Record<string, string>
  return dict[key] ?? key
}

export function applyLang(): void {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (key && I18N[currentLang][key as keyof typeof I18N.zh]) {
      el.textContent = t(key)
    }
  })
  const langBtn = document.getElementById('langBtn')
  if (langBtn) langBtn.textContent = currentLang === 'zh' ? '文' : 'EN'
}

export function toggleLang(): void {
  currentLang = currentLang === 'zh' ? 'en' : 'zh'
  applyLang()
}
