import { mockDashboard } from '@/mock/dashboard.data'
import type {
  CategoryItem,
  DashboardData,
  Kpi,
  RealtimeItem,
  ShareItem,
  TrendPoint,
} from './types'
import type { DataSource } from './types'

const TREND_WINDOW = 12
const JITTER = {
  kpi: 0.015,
  trend: 0.06,
  category: 0.05,
  share: 0.05,
  realtime: 0.08,
}

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function jitter(value: number, ratio: number): number {
  return value * (1 + (Math.random() * 2 - 1) * ratio)
}

function nowLabel(): string {
  return new Date().toLocaleTimeString('zh-CN')
}

export class MockDataSource implements DataSource {
  private data: DashboardData = clone(mockDashboard)

  getKpis(): Promise<Kpi[]> {
    return delay(clone(this.data.kpis))
  }

  getTrend(): Promise<TrendPoint[]> {
    return delay(clone(this.data.trend))
  }

  getCategory(): Promise<CategoryItem[]> {
    return delay(clone(this.data.category))
  }

  getShare(): Promise<ShareItem[]> {
    return delay(clone(this.data.share))
  }

  getRealtime(): Promise<RealtimeItem[]> {
    return delay(clone(this.data.realtime))
  }

  async tick(): Promise<DashboardData> {
    this.data.kpis = this.data.kpis.map((kpi) => ({
      ...kpi,
      value: Math.max(0, jitter(kpi.value, JITTER.kpi)),
      delta: Number(((Math.random() * 2 - 1) * 3).toFixed(1)),
    }))

    const lastTrend = this.data.trend[this.data.trend.length - 1]
    const nextTrendValue = Math.max(0, Math.round(jitter(lastTrend.value, JITTER.trend)))
    this.data.trend = [
      ...this.data.trend,
      { time: nowLabel(), value: nextTrendValue },
    ].slice(-TREND_WINDOW)

    this.data.category = this.data.category.map((item) => ({
      ...item,
      value: Math.max(0, Math.round(jitter(item.value, JITTER.category))),
    }))

    const jitteredShare = this.data.share.map((item) => ({
      ...item,
      value: Math.max(1, jitter(item.value, JITTER.share)),
    }))
    const shareSum = jitteredShare.reduce((sum, item) => sum + item.value, 0)
    this.data.share = jitteredShare.map((item) => ({
      ...item,
      value: Math.round((item.value / shareSum) * 100),
    }))

    this.data.realtime = this.data.realtime.map((item) => ({
      ...item,
      value: Math.max(0, Math.round(jitter(item.value, JITTER.realtime))),
    }))

    return delay(clone(this.data))
  }
}
