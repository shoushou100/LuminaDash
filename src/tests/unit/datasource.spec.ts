import { describe, it, expect, vi } from 'vitest'
import coreData from '@/data/core.json'
import { FileDataSource } from '@/services/datasource/file'
import { ApiDataSource } from '@/services/datasource/api'

describe('datasource (file/api switch)', () => {
  it('FileDataSource returns data loaded from src/data', async () => {
    const ds = new FileDataSource()
    const [core, trend, category, share, alerts] = await Promise.all([
      ds.getCore(),
      ds.getTrend(),
      ds.getCategory(),
      ds.getShare(),
      ds.getAlerts(),
    ])
    expect(core.length).toBe(coreData.length)
    expect(trend.length).toBeGreaterThan(0)
    expect(category.length).toBeGreaterThan(0)
    expect(share.length).toBeGreaterThan(0)
    expect(alerts.length).toBeGreaterThan(0)
  })

  it('FileDataSource.tick returns a full DashboardData snapshot', async () => {
    const data = await new FileDataSource().tick()
    expect(Object.keys(data).sort()).toEqual(
      ['alerts', 'category', 'core', 'share', 'trend'].sort(),
    )
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
