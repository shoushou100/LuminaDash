import { env } from '@/core/config/env'
import { createLogger } from '@/core/logger'
import type {
  AlertItem,
  CategoryItem,
  CoreMetric,
  DashboardData,
  DataSource,
  ShareItem,
  TrendPoint,
} from './types'

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
  getCore(): Promise<CoreMetric[]> {
    return request<CoreMetric[]>('/core')
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

  getAlerts(): Promise<AlertItem[]> {
    return request<AlertItem[]>('/alerts')
  }

  async tick(): Promise<DashboardData> {
    const [core, trend, category, share, alerts] = await Promise.all([
      this.getCore(),
      this.getTrend(),
      this.getCategory(),
      this.getShare(),
      this.getAlerts(),
    ])
    return { core, trend, category, share, alerts }
  }
}
