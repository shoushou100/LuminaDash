import {
  getMockCategory,
  getMockKpis,
  getMockRealtime,
  getMockShare,
  getMockTrend,
} from '@/mock/dashboard.data'
import type { CategoryItem, Kpi, RealtimeItem, ShareItem, TrendPoint } from './types'
import type { DataSource } from './types'

export class MockDataSource implements DataSource {
  getKpis(): Promise<Kpi[]> {
    return getMockKpis()
  }

  getTrend(): Promise<TrendPoint[]> {
    return getMockTrend()
  }

  getCategory(): Promise<CategoryItem[]> {
    return getMockCategory()
  }

  getShare(): Promise<ShareItem[]> {
    return getMockShare()
  }

  getRealtime(): Promise<RealtimeItem[]> {
    return getMockRealtime()
  }
}
