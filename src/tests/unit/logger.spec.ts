import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLogger } from '@/core/logger'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('createLogger returns an object with level methods', () => {
    const log = createLogger('test')
    expect(typeof log.debug).toBe('function')
    expect(typeof log.info).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.error).toBe('function')
    expect(typeof log.report).toBe('function')
  })

  it('level methods write to console', () => {
    const log = createLogger('test')
    log.info('hello')
    log.error('boom')
    expect(console.log).toHaveBeenCalledTimes(2)
  })

  it('report does not throw', () => {
    const log = createLogger('test')
    expect(() => log.report({ event: 'x' })).not.toThrow()
  })
})
