import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('cesium', () => {
  class Event {
    listeners: Array<() => void> = []
    addEventListener(fn: () => void) { this.listeners.push(fn) }
  }
  class JulianDate {
    static now(_scratch?: JulianDate) { return new JulianDate() }
  }
  class Color {
    constructor(
      public r: number,
      public g: number,
      public b: number,
      public a: number,
    ) {}
    static clone(src: Color, result?: Color) {
      if (result) {
        result.r = src.r
        result.g = src.g
        result.b = src.b
        result.a = src.a
        return result
      }
      return new Color(src.r, src.g, src.b, src.a)
    }
    static equals(a: Color, b: Color) {
      return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a
    }
  }
  return {
    Event,
    JulianDate,
    Color,
    defined: (v: unknown) => v !== undefined && v !== null,
    Material: { _materialCache: { addMaterial: vi.fn() } },
  }
})

import {
  YellowHeightGradientMaterialProperty,
  createYellowHeightGradientMaterialProperty,
} from './yellow-height-gradient.js'

describe('YellowHeightGradientMaterialProperty', () => {
  let color: InstanceType<typeof import('cesium').Color>

  beforeEach(async () => {
    const Cesium = await import('cesium')
    color = new Cesium.Color(1, 0.56, 0, 1)
  })

  it('should construct without calling MaterialProperty super', () => {
    expect(() => createYellowHeightGradientMaterialProperty(50, 95, color, 0.85)).not.toThrow()
  })

  it('should return fabric type and uniforms via getType/getValue', () => {
    const prop = createYellowHeightGradientMaterialProperty(50, 95, color, 0.85)
    expect(prop.getType()).toBe('BridgeYellowHeightGradient')
    const uniforms = prop.getValue()
    expect(uniforms.minHeight).toBe(50)
    expect(uniforms.maxHeight).toBe(95)
    expect(uniforms.color).toEqual(color)
    expect(uniforms.opacity).toBe(0.85)
  })

  it('should clone color into existing uniform object', () => {
    const prop = createYellowHeightGradientMaterialProperty(10, 20, color, 0.5)
    const existing = { color: new (color.constructor as typeof color)(0, 0, 0, 0) }
    prop.getValue(undefined, existing as never)
    expect(existing.color.r).toBe(1)
  })

  it('equals should compare min/max, color and opacity', () => {
    const a = createYellowHeightGradientMaterialProperty(50, 95, color, 0.85)
    const b = createYellowHeightGradientMaterialProperty(50, 95, color, 0.85)
    const c = createYellowHeightGradientMaterialProperty(30, 70, color, 0.5)
    expect(a.equals(b)).toBe(true)
    expect(a.equals(c)).toBe(false)
  })

  it('should expose MaterialProperty interface fields', () => {
    const prop = new YellowHeightGradientMaterialProperty(0, 100, color, 0.85)
    expect(prop.isConstant).toBe(true)
    expect(prop.definitionChanged).toBeDefined()
  })
})
