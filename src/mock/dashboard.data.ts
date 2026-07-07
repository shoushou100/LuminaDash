import { createLogger } from '@/core/logger'
import type {
  CategoryItem,
  DashboardData,
  Kpi,
  RealtimeItem,
  ShareItem,
  TrendPoint,
} from '@/services/datasource/types'

const logger = createLogger('mock:data')

export const mockDashboard: DashboardData = {
  kpis: [
    { id: 'uv', label: '今日访客', value: 18452, unit: '人', delta: 12.4 },
    { id: 'order', label: '成交订单', value: 3271, unit: '单', delta: 8.1 },
    { id: 'gmv', label: '销售额', value: 928400, unit: '元', delta: 15.7 },
    { id: 'rate', label: '转化率', value: 17.7, unit: '%', delta: -2.3 },
  ],
  trend: [
    { time: '00:00', value: 320 },
    { time: '04:00', value: 210 },
    { time: '08:00', value: 680 },
    { time: '12:00', value: 1240 },
    { time: '16:00', value: 980 },
    { time: '20:00', value: 1560 },
    { time: '24:00', value: 1320 },
  ],
  category: [
    { name: '华东', value: 4200 },
    { name: '华南', value: 3100 },
    { name: '华北', value: 2600 },
    { name: '西南', value: 1800 },
    { name: '东北', value: 1200 },
  ],
  share: [
    { name: '移动端', value: 58 },
    { name: 'PC端', value: 27 },
    { name: '小程序', value: 15 },
  ],
  realtime: [
    { region: '上海', value: 920 },
    { region: '深圳', value: 760 },
    { region: '北京', value: 880 },
    { region: '成都', value: 540 },
    { region: '广州', value: 700 },
    { region: '杭州', value: 620 },
  ],
}

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export function getMockKpis(): Promise<Kpi[]> {
  logger.debug('getKpis')
  return delay(mockDashboard.kpis)
}

export function getMockTrend(): Promise<TrendPoint[]> {
  logger.debug('getTrend')
  return delay(mockDashboard.trend)
}

export function getMockCategory(): Promise<CategoryItem[]> {
  logger.debug('getCategory')
  return delay(mockDashboard.category)
}

export function getMockShare(): Promise<ShareItem[]> {
  logger.debug('getShare')
  return delay(mockDashboard.share)
}

export function getMockRealtime(): Promise<RealtimeItem[]> {
  logger.debug('getRealtime')
  return delay(mockDashboard.realtime)
}
