import { createLogger } from '@/core/logger'
import { ApiDataSource } from './api'
import { MockDataSource } from './mock'
import type { DataSource } from './types'

const logger = createLogger('datasource')

export function createDataSource(): DataSource {
  const mode = import.meta.env.VITE_DATA_SOURCE
  logger.info(`create datasource with mode=${mode}`)
  if (mode === 'api') {
    return new ApiDataSource()
  }
  return new MockDataSource()
}

export const dataSource: DataSource = createDataSource()
