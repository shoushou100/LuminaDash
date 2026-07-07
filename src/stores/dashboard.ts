import { defineStore } from 'pinia'
import { dataSource } from '@/services/datasource'
import { createLogger } from '@/core/logger'
import type {
  CategoryItem,
  Kpi,
  RealtimeItem,
  ShareItem,
  TrendPoint,
} from '@/services/datasource/types'

const logger = createLogger('store:dashboard')

interface DashboardState {
  kpis: Kpi[]
  trend: TrendPoint[]
  category: CategoryItem[]
  share: ShareItem[]
  realtime: RealtimeItem[]
  loading: boolean
  lastUpdated: string
}

function nowTime(): string {
  return new Date().toLocaleTimeString('zh-CN')
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    kpis: [],
    trend: [],
    category: [],
    share: [],
    realtime: [],
    loading: false,
    lastUpdated: '',
  }),
  actions: {
    async loadAll(): Promise<void> {
      this.loading = true
      logger.info('loading dashboard data')
      try {
        const [kpis, trend, category, share, realtime] = await Promise.all([
          dataSource.getKpis(),
          dataSource.getTrend(),
          dataSource.getCategory(),
          dataSource.getShare(),
          dataSource.getRealtime(),
        ])
        this.kpis = kpis
        this.trend = trend
        this.category = category
        this.share = share
        this.realtime = realtime
        this.lastUpdated = nowTime()
        logger.info('dashboard data loaded')
      } catch (error) {
        logger.error('failed to load dashboard', error)
      } finally {
        this.loading = false
      }
    },
    async refreshRealtime(): Promise<void> {
      this.realtime = await dataSource.getRealtime()
      this.lastUpdated = nowTime()
    },
  },
})
