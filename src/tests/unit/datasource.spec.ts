import { describe, it, expect, vi } from 'vitest'
import { FileDataSource } from '@/services/datasource/file'
import { ApiDataSource } from '@/services/datasource/api'
import manifest from '@/data/manifest.json'

describe('datasource (manifest/file driven)', () => {
  it('FileDataSource.tick returns blocks declared by manifest', async () => {
    const data = await new FileDataSource().tick()
    const files = manifest.map((m) => m.file)
    expect(data.blocks.map((b) => b.file).sort()).toEqual(files.sort())
    expect(data.blocks.every((b) => b.chart && b.title)).toBe(true)
  })

  it('unrecognized data files not in manifest are ignored', async () => {
    const data = await new FileDataSource().tick()
    const files = new Set(data.blocks.map((b) => b.file))
    expect(files.has('manifest')).toBe(false)
  })

  it('createDataSource returns FileDataSource by default', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock')
    const { createDataSource } = await import('@/services/datasource/index')
    expect(createDataSource()).toBeInstanceOf(FileDataSource)
    vi.unstubAllEnvs()
  })

  it('createDataSource returns ApiDataSource when VITE_DATA_SOURCE=api', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'api')
    const { createDataSource } = await import('@/services/datasource/index')
    expect(createDataSource()).toBeInstanceOf(ApiDataSource)
    vi.unstubAllEnvs()
  })
})
