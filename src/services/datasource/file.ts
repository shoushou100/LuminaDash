import core from '@/data/core.json'
import trend from '@/data/trend.json'
import category from '@/data/category.json'
import share from '@/data/share.json'
import alerts from '@/data/alerts.json'
import type {
  AlertItem,
  CategoryItem,
  CoreMetric,
  DashboardData,
  DataSource,
  ShareItem,
  TrendPoint,
} from './types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class FileDataSource implements DataSource {
  getCore(): Promise<CoreMetric[]> {
    return Promise.resolve(clone(core as CoreMetric[]))
  }

  getTrend(): Promise<TrendPoint[]> {
    return Promise.resolve(clone(trend as TrendPoint[]))
  }

  getCategory(): Promise<CategoryItem[]> {
    return Promise.resolve(clone(category as CategoryItem[]))
  }

  getShare(): Promise<ShareItem[]> {
    return Promise.resolve(clone(share as ShareItem[]))
  }

  getAlerts(): Promise<AlertItem[]> {
    return Promise.resolve(clone(alerts as AlertItem[]))
  }

  async tick(): Promise<DashboardData> {
    return {
      core: clone(core as CoreMetric[]),
      trend: clone(trend as TrendPoint[]),
      category: clone(category as CategoryItem[]),
      share: clone(share as ShareItem[]),
      alerts: clone(alerts as AlertItem[]),
    }
  }
}
