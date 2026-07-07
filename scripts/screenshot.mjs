import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { startCapture, stopCapture, PROJECT_ROOT } from './screenshot-core.mjs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')

const args = process.argv.slice(2)
const once = args.includes('--once')
const dirArg = args.find((a) => a.startsWith('--dir='))?.split('=')[1]
const interval = Number(args.find((a) => a.startsWith('--interval='))?.split('=')[1]) || 60000
const scale = Number(args.find((a) => a.startsWith('--scale='))?.split('=')[1]) || 2
const devUrl = 'http://localhost:5173'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function isDevUp() {
  try {
    const res = await fetch(devUrl)
    return res.ok
  } catch {
    return false
  }
}

let devProcess = null

async function ensureDev() {
  if (await isDevUp()) {
    console.log('[screenshot] reuse existing dev server')
    return
  }
  console.log('[screenshot] starting dev server...')
  devProcess = spawn('npm', ['run', 'dev'], { cwd: ROOT, shell: true, stdio: 'ignore' })
  for (let i = 0; i < 120; i++) {
    if (await isDevUp()) {
      console.log('[screenshot] dev server is up')
      return
    }
    await sleep(1000)
  }
  throw new Error('[screenshot] dev server did not start in time')
}

const opts = {
  outDir: dirArg ? resolve(PROJECT_ROOT, dirArg) : 'pic',
  interval,
  scale,
  url: devUrl,
}

await ensureDev()

if (once) {
  await startCapture(opts)
  await stopCapture()
} else {
  await startCapture(opts)
  console.log(`[screenshot] looping every ${interval}ms (Ctrl+C to stop)`)
  const shutdown = async () => {
    await stopCapture()
    if (devProcess) devProcess.kill('SIGTERM')
    process.exit(0)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}
