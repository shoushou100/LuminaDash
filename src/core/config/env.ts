export interface AppEnv {
  dataSource: string
  apiBaseUrl: string
  isDev: boolean
}

export const env: AppEnv = {
  dataSource: import.meta.env.VITE_DATA_SOURCE || 'mock',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  isDev: import.meta.env.DEV,
}
