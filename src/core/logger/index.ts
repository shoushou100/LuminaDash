export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: '#7f8c9b',
  info: '#36cfc9',
  warn: '#faad14',
  error: '#ff4d4f',
}

export interface Logger {
  debug(...args: unknown[]): void
  info(...args: unknown[]): void
  warn(...args: unknown[]): void
  error(...args: unknown[]): void
  report(payload: unknown): void
}

function now(): string {
  return new Date().toISOString()
}

export function createLogger(namespace: string): Logger {
  const minLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'debug'

  function print(level: LogLevel, args: unknown[]): void {
    if (LEVEL_ORDER[level] < LEVEL_ORDER[minLevel]) return
    const color = LEVEL_COLOR[level]
    const prefix = `%c[${now()}] [${level.toUpperCase()}] [${namespace}]`
    // eslint-disable-next-line no-console
    console.log(prefix, `color:${color};font-weight:bold`, ...args)
  }

  return {
    debug: (...args: unknown[]) => print('debug', args),
    info: (...args: unknown[]) => print('info', args),
    warn: (...args: unknown[]) => print('warn', args),
    error: (...args: unknown[]) => print('error', args),
    report: (payload: unknown) => {
      // 预留：后期可上报到远程日志服务
      void payload
    },
  }
}

export const logger = createLogger('app')
