import * as Cesium from 'cesium'

const MATERIAL_TYPE = 'BridgeYellowHeightGradient'

let registered = false

/**
 * 根据片段椭球高度在 [minHeight, maxHeight] 插值不透明度：底部为 opacity，至顶部渐隐为 0。
 * materialInput.height 仅 globe 可用；挤压多边形需从 eye 坐标反算世界坐标再求高度。
 */
const FABRIC_SOURCE = `
// WGS84；Fabric 材质着色器无 czm_scaleToGeodeticSurface，需内联迭代求地心面投影点
float bridgeEllipsoidHeight(vec3 positionWC) {
  vec3 oneOverRadii = vec3(
    1.0 / 6378137.0,
    1.0 / 6378137.0,
    1.0 / 6356752.3142451793
  );
  vec3 oneOverRadiiSquared = oneOverRadii * oneOverRadii;

  float px = positionWC.x;
  float py = positionWC.y;
  float pz = positionWC.z;
  float ox = oneOverRadii.x;
  float oy = oneOverRadii.y;
  float oz = oneOverRadii.z;

  float x2 = px * px * ox * ox;
  float y2 = py * py * oy * oy;
  float z2 = pz * pz * oz * oz;
  float squaredNorm = x2 + y2 + z2;
  float ratio = sqrt(1.0 / squaredNorm);
  vec3 intersection = positionWC * ratio;

  if (squaredNorm < czm_epsilon7) {
    vec3 nearCenter = positionWC - intersection;
    return sign(dot(nearCenter, positionWC)) * length(nearCenter);
  }

  float oxs = oneOverRadiiSquared.x;
  float oys = oneOverRadiiSquared.y;
  float ozs = oneOverRadiiSquared.z;
  vec3 gradient = vec3(
    intersection.x * oxs * 2.0,
    intersection.y * oys * 2.0,
    intersection.z * ozs * 2.0
  );
  float lambda = ((1.0 - ratio) * length(positionWC)) / (0.5 * length(gradient));

  for (int i = 0; i < 4; i++) {
    float xm = 1.0 / (1.0 + lambda * oxs);
    float ym = 1.0 / (1.0 + lambda * oys);
    float zm = 1.0 / (1.0 + lambda * ozs);
    float func = x2 * xm * xm + y2 * ym * ym + z2 * zm * zm - 1.0;
    float denom = x2 * xm * xm * xm * oxs + y2 * ym * ym * ym * oys + z2 * zm * zm * zm * ozs;
    lambda -= func / (-2.0 * denom);
  }

  float xM = 1.0 / (1.0 + lambda * oxs);
  float yM = 1.0 / (1.0 + lambda * oys);
  float zM = 1.0 / (1.0 + lambda * ozs);
  vec3 surface = vec3(px * xM, py * yM, pz * zM);
  vec3 h = positionWC - surface;
  return sign(dot(h, positionWC)) * length(h);
}

czm_material czm_getMaterial(czm_materialInput materialInput)
{
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec3 positionEC = -materialInput.positionToEyeEC;
  vec3 positionWC = (czm_inverseModelView * vec4(positionEC, 1.0)).xyz;
  float height = bridgeEllipsoidHeight(positionWC);
  float t = clamp((height - minHeight) / max(maxHeight - minHeight, 0.001), 0.0, 1.0);
  vec4 base = czm_gammaCorrect(color);
  material.diffuse = base.rgb;
  material.alpha = opacity * (1.0 - t);
  return material;
}
`

function ensureFabricRegistered(): void {
  if (registered) return
  registered = true
  ;(Cesium.Material as unknown as { _materialCache: { addMaterial: (t: string, m: object) => void } })
    ._materialCache.addMaterial(MATERIAL_TYPE, {
      fabric: {
        type: MATERIAL_TYPE,
        uniforms: {
          minHeight: 0.0,
          maxHeight: 100.0,
          color: new Cesium.Color(1.0, 0.56, 0.0, 1.0),
          opacity: 0.85,
        },
        source: FABRIC_SOURCE,
      },
      translucent: true,
    })
}

const timeScratch = new Cesium.JulianDate()

/**
 * Entity 可用的自定义高度渐变材质 Property。
 * 不继承 MaterialProperty（其构造函数会抛错），仅实现相同接口。
 */
export class YellowHeightGradientMaterialProperty {
  readonly definitionChanged = new Cesium.Event()
  private readonly _minHeight: number
  private readonly _maxHeight: number
  private readonly _color: Cesium.Color
  private readonly _opacity: number

  constructor(
    minHeight: number,
    maxHeight: number,
    color: Cesium.Color,
    opacity: number,
  ) {
    ensureFabricRegistered()
    this._minHeight = minHeight
    this._maxHeight = maxHeight
    this._color = color
    this._opacity = opacity
  }

  get isConstant(): boolean {
    return true
  }

  getType(_time?: Cesium.JulianDate): string {
    return MATERIAL_TYPE
  }

  getValue(
    time?: Cesium.JulianDate,
    result?: {
      minHeight?: number
      maxHeight?: number
      color?: Cesium.Color
      opacity?: number
    },
  ): {
    minHeight: number
    maxHeight: number
    color: Cesium.Color
    opacity: number
  } {
    if (!Cesium.defined(time)) {
      time = Cesium.JulianDate.now(timeScratch)
    }
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.minHeight = this._minHeight
    result.maxHeight = this._maxHeight
    result.color = Cesium.Color.clone(this._color, result.color)
    result.opacity = this._opacity
    return result as {
      minHeight: number
      maxHeight: number
      color: Cesium.Color
      opacity: number
    }
  }

  equals(other?: Cesium.Property): boolean {
    return (
      this === other
      || (other instanceof YellowHeightGradientMaterialProperty
        && this._minHeight === other._minHeight
        && this._maxHeight === other._maxHeight
        && this._opacity === other._opacity
        && Cesium.Color.equals(this._color, other._color))
    )
  }
}

export function createYellowHeightGradientMaterialProperty(
  minHeight: number,
  maxHeight: number,
  color: Cesium.Color,
  opacity: number,
): YellowHeightGradientMaterialProperty {
  return new YellowHeightGradientMaterialProperty(minHeight, maxHeight, color, opacity)
}

