import { describe, it, expect, vi } from 'vitest'
import { mockDashboard } from '@/mock/dashboard.data'

describe('datasource (mock/api switch)', () => {
  it('MockDataSource returns mock dashboard data', async () => {
    const { MockDataSource } = await import('@/services/datasource/mock')
    const ds = new MockDataSource()
    const [kpis, trend, category, share, realtime] = await Promise.all([
      ds.getKpis(),
      ds.getTrend(),
      ds.getCategory(),
      ds.getShare(),
      ds.getRealtime(),
    ])
    expect(kpis).toEqual(mockDashboard.kpis)
    expect(trend.length).toBeGreaterThan(0)
    expect(category.length).toBe(mockDashboard.category.length)
    expect(share.length).toBe(mockDashboard.share.length)
    expect(realtime.length).toBe(mockDashboard.realtime.length)
  })

  it('createDataSource returns MockDataSource by default', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock')
    const mod = await import('@/services/datasource/index')
    const ds = mod.createDataSource()
    const { MockDataSource } = await import('@/services/datasource/mock')
    expect(ds).toBeInstanceOf(MockDataSource)
  })

  it('createDataSource returns ApiDataSource when VITE_DATA_SOURCE=api', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'api')
    const mod = await import('@/services/datasource/index')
    const ds = mod.createDataSource()
    const { ApiDataSource } = await import('@/services/datasource/api')
    expect(ds).toBeInstanceOf(ApiDataSource)
  })
})
