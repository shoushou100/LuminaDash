export interface Kpi {
  id: string
  label: string
  value: number
  unit: string
  delta: number
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

export interface RealtimeItem {
  region: string
  value: number
}

export interface DashboardData {
  kpis: Kpi[]
  trend: TrendPoint[]
  category: CategoryItem[]
  share: ShareItem[]
  realtime: RealtimeItem[]
}

export interface DataSource {
  getKpis(): Promise<Kpi[]>
  getTrend(): Promise<TrendPoint[]>
  getCategory(): Promise<CategoryItem[]>
  getShare(): Promise<ShareItem[]>
  getRealtime(): Promise<RealtimeItem[]>
  tick(): Promise<DashboardData>
}
