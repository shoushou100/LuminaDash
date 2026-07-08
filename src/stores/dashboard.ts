import { defineStore } from 'pinia'
import { dataSource } from '@/services/datasource'
import { createLogger } from '@/core/logger'
import type {
  AlertItem,
  CategoryItem,
  CoreMetric,
  DashboardData,
  ShareItem,
  TrendPoint,
} from '@/services/datasource/types'

const logger = createLogger('store:dashboard')

interface DashboardState {
  core: CoreMetric[]
  trend: TrendPoint[]
  category: CategoryItem[]
  share: ShareItem[]
  alerts: AlertItem[]
  loading: boolean
  lastUpdated: string
}

function nowTime(): string {
  return new Date().toLocaleTimeString('zh-CN')
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    core: [],
    trend: [],
    category: [],
    share: [],
    alerts: [],
    loading: false,
    lastUpdated: '',
  }),
  actions: {
    async loadAll(): Promise<void> {
      this.loading = true
      logger.info('loading dashboard data')
      try {
        const [core, trend, category, share, alerts] = await Promise.all([
          dataSource.getCore(),
          dataSource.getTrend(),
          dataSource.getCategory(),
          dataSource.getShare(),
          dataSource.getAlerts(),
        ])
        this.core = core
        this.trend = trend
        this.category = category
        this.share = share
        this.alerts = alerts
        this.lastUpdated = nowTime()
        logger.info('dashboard data loaded')
      } catch (error) {
        logger.error('failed to load dashboard', error)
      } finally {
        this.loading = false
      }
    },
    async tick(): Promise<void> {
      const data: DashboardData = await dataSource.tick()
      this.core = data.core
      this.trend = data.trend
      this.category = data.category
      this.share = data.share
      this.alerts = data.alerts
      this.lastUpdated = nowTime()
    },
  },
})
