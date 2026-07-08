import { env } from '@/core/config/env'
import { createLogger } from '@/core/logger'
import type {
  DashboardData,
  DataSource,
  ManifestBlock,
  DashboardBlock,
} from './types'

const logger = createLogger('datasource:api')

async function request<T>(path: string): Promise<T> {
  const url = `${env.apiBaseUrl}${path}`
  logger.debug(`GET ${url}`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

export class ApiDataSource implements DataSource {
  getManifest(): Promise<ManifestBlock[]> {
    return request<ManifestBlock[]>('/manifest')
  }

  getBlockData(file: string): Promise<unknown> {
    return request<unknown>(`/data/${file}`)
  }

  async tick(): Promise<DashboardData> {
    const manifest = await this.getManifest()
    const blocks: DashboardBlock[] = await Promise.all(
      manifest.map(async (block) => ({
        ...block,
        data: await this.getBlockData(block.file),
      })),
    )
    return { blocks }
  }
}
