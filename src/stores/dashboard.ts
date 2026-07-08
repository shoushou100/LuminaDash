import { defineStore } from 'pinia'
import { dataSource } from '@/services/datasource'
import { createLogger } from '@/core/logger'
import type { DashboardBlock, DashboardData } from '@/services/datasource/types'

const logger = createLogger('store:dashboard')

interface DashboardState {
  blocks: DashboardBlock[]
  loading: boolean
  lastUpdated: string
}

function nowTime(): string {
  return new Date().toLocaleTimeString('zh-CN')
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    blocks: [],
    loading: false,
    lastUpdated: '',
  }),
  actions: {
    async loadAll(): Promise<void> {
      this.loading = true
      logger.info('loading dashboard data')
      try {
        const data: DashboardData = await dataSource.tick()
        this.blocks = data.blocks
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
      this.blocks = data.blocks
      this.lastUpdated = nowTime()
    },
  },
})
