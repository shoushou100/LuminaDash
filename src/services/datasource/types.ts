export type MetricStatus = 'normal' | 'warning' | 'danger'

export interface CoreMetric {
  id: string
  name: string
  value: number
  unit: string
  delta: number
  threshold?: number
  status?: MetricStatus
}

export interface TrendPoint {
  time: string
  value: number
}

export interface CategoryItem {
  name: string
  value: number
}

export interface ShareItem {
  name: string
  value: number
}

export type AlertLevel = 'normal' | 'warning' | 'danger'

export interface AlertItem {
  id: string
  level: AlertLevel
  title: string
  metric: string
  value: number
  threshold: number
  time: string
  status?: 'active' | 'resolved'
}

export interface DashboardData {
  core: CoreMetric[]
  trend: TrendPoint[]
  category: CategoryItem[]
  share: ShareItem[]
  alerts: AlertItem[]
}

export interface DataSource {
  getCore(): Promise<CoreMetric[]>
  getTrend(): Promise<TrendPoint[]>
  getCategory(): Promise<CategoryItem[]>
  getShare(): Promise<ShareItem[]>
  getAlerts(): Promise<AlertItem[]>
  tick(): Promise<DashboardData>
}
