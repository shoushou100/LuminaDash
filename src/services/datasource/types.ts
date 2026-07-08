export type MetricStatus = 'normal' | 'warning' | 'danger'

export interface CoreMetric {
  id?: string
  name: string
  value: number
  unit?: string
  delta?: number
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

export type ChartType = 'metric' | 'line' | 'bar' | 'pie' | 'alert'

export interface ManifestBlock {
  file: string
  title: string
  chart: ChartType
}

export interface DashboardBlock extends ManifestBlock {
  data: unknown
}

export interface TrendBlock extends DashboardBlock {
  data: TrendPoint[]
}

export interface AlertBlock extends DashboardBlock {
  data: AlertItem[]
}

export interface DashboardData {
  blocks: DashboardBlock[]
}

export interface DataSource {
  getManifest(): Promise<ManifestBlock[]>
  getBlockData(file: string): Promise<unknown>
  tick(): Promise<DashboardData>
}
