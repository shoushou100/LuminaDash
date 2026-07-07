import { env } from '@/core/config/env'
import { createLogger } from '@/core/logger'
import type {
  CategoryItem,
  DashboardData,
  Kpi,
  RealtimeItem,
  ShareItem,
  TrendPoint,
} from './types'
import type { DataSource } from './types'

const logger = createLogger('datasource:api')

async function request<T>(path: string): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`
  logger.debug(`GET ${url}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

export class ApiDataSource implements DataSource {
  getKpis(): Promise<Kpi[]> {
    return request<Kpi[]>('/kpis')
  }

  getTrend(): Promise<TrendPoint[]> {
    return request<TrendPoint[]>('/trend')
  }

  getCategory(): Promise<CategoryItem[]> {
    return request<CategoryItem[]>('/category')
  }

  getShare(): Promise<ShareItem[]> {
    return request<ShareItem[]>('/share')
  }

  getRealtime(): Promise<RealtimeItem[]> {
    return request<RealtimeItem[]>('/realtime')
  }

  async tick(): Promise<DashboardData> {
    const [kpis, trend, category, share, realtime] = await Promise.all([
      this.getKpis(),
      this.getTrend(),
      this.getCategory(),
      this.getShare(),
      this.getRealtime(),
    ])
    return { kpis, trend, category, share, realtime }
  }
}
