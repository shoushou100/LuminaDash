import { describe, it, expect } from 'vitest'
import { clamp, formatNumber, isPositive, randomBetween } from '@/core/utils'

describe('utils', () => {
  it('formatNumber adds thousands separators', () => {
    expect(formatNumber(18452)).toBe('18,452')
    expect(formatNumber(0)).toBe('0')
  })

  it('clamp keeps value within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(99, 0, 10)).toBe(10)
  })

  it('randomBetween returns a value inside [min, max]', () => {
    const v = randomBetween(2, 8)
    expect(v).toBeGreaterThanOrEqual(2)
    expect(v).toBeLessThanOrEqual(8)
  })

  it('isPositive reflects sign', () => {
    expect(isPositive(1)).toBe(true)
    expect(isPositive(-1)).toBe(false)
    expect(isPositive(0)).toBe(true)
  })
})
