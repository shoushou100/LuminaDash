export interface AppEnv {
  dataSource: string
  apiBaseUrl: string
  isDev: boolean
  refreshInterval: number
}

export const env: AppEnv = {
  dataSource: import.meta.env.VITE_DATA_SOURCE || 'mock',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  isDev: import.meta.env.DEV,
  refreshInterval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 3000,
}
