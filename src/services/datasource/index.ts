import { createLogger } from '@/core/logger'
import { ApiDataSource } from './api'
import { FileDataSource } from './file'
import type { DataSource } from './types'

const logger = createLogger('datasource')

export function createDataSource(): DataSource {
  const mode = import.meta.env.VITE_DATA_SOURCE
  logger.info(`create datasource with mode=${mode}`)
  if (mode === 'api') {
    return new ApiDataSource()
  }
  return new FileDataSource()
}

export const dataSource: DataSource = createDataSource()
