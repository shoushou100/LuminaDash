import type {
  DashboardBlock,
  DashboardData,
  DataSource,
  ManifestBlock,
} from './types'

const modules = import.meta.glob('@/data/*.json', { eager: true }) as Record<
  string,
  { default: unknown }
>

function readFile(name: string): unknown | undefined {
  const key = Object.keys(modules).find((k) => k.endsWith(`/${name}.json`))
  return key ? modules[key].default : undefined
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class FileDataSource implements DataSource {
  getManifest(): Promise<ManifestBlock[]> {
    const manifest = readFile('manifest') as ManifestBlock[] | undefined
    return Promise.resolve(clone(manifest ?? []))
  }

  getBlockData(file: string): Promise<unknown> {
    const data = readFile(file)
    if (data === undefined) {
      return Promise.reject(new Error(`data file not found: ${file}`))
    }
    return Promise.resolve(clone(data))
  }

  async tick(): Promise<DashboardData> {
    const manifest = (readFile('manifest') as ManifestBlock[] | undefined) ?? []
    const blocks: DashboardBlock[] = []
    for (const block of manifest) {
      const data = readFile(block.file)
      if (data === undefined) continue
      blocks.push({ ...block, data })
    }
    return { blocks: clone(blocks) }
  }
}
