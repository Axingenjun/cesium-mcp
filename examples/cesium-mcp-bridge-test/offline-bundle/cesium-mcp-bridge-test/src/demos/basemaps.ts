/** 底图 setBasemap 选项（与原按钮参数一致） */
export const BASEMAPS = [
  { id: 'osm', i18n: 'basemap.osm', params: { basemap: 'osm' } },
  { id: 'arcgis', i18n: 'basemap.arcgis', params: { basemap: 'arcgis' } },
  { id: 'light', i18n: 'basemap.light', params: { basemap: 'light' } },
  { id: 'dark', i18n: 'basemap.dark', params: { basemap: 'dark' } },
  { id: 'satellite', i18n: 'basemap.satellite', params: { basemap: 'satellite' } },
  { id: 'tianditu_vec', i18n: 'btn.tdtVec', params: { basemap: 'tianditu_vec', token: 'your_token' } },
  { id: 'tianditu_img', i18n: 'btn.tdtImg', params: { basemap: 'tianditu_img', token: 'your_token' } },
  { id: 'amap', i18n: 'btn.amap', params: { basemap: 'amap' } },
  { id: 'amap_satellite', i18n: 'btn.amapSat', params: { basemap: 'amap_satellite' } },
] as const
