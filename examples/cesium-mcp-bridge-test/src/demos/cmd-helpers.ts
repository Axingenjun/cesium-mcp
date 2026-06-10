/** zoomToExtent 参数：bbox = [west, south, east, north] */
export function extent(
  west: number,
  south: number,
  east: number,
  north: number,
  duration = 1.5,
): { bbox: [number, number, number, number]; duration: number } {
  return { bbox: [west, south, east, north], duration }
}
