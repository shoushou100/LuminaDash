import { mkdirSync, copyFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
export const PROJECT_ROOT = resolve(__dirname, '..')

let browser = null
let timer = null
let running = false
let pageRef = null
let config = {
  outDir: resolve(PROJECT_ROOT, 'pic'),
  interval: 60000,
  scale: 2,
  url: 'http://localhost:5173',
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function timestamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

async function captureOnce() {
  if (!pageRef) return
  mkdirSync(config.outDir, { recursive: true })
  const file = join(config.outDir, `luminadash-${timestamp()}.png`)
  await pageRef.screenshot({ path: file, fullPage: true })
  copyFileSync(file, join(config.outDir, 'latest.png'))

  const docsDir = join(PROJECT_ROOT, 'docs')
  mkdirSync(docsDir, { recursive: true })
  copyFileSync(file, join(docsDir, 'preview.png'))

  console.log(`[screenshot] saved ${file}`)
}

export async function startCapture(userOpts = {}) {
  if (running) return { running: true }
  config = { ...config, ...userOpts }
  config.outDir = resolve(PROJECT_ROOT, config.outDir || 'pic')

  const { chromium } = await import('playwright')
  browser = await chromium.launch()
  pageRef = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: config.scale,
  })
  pageRef.on('pageerror', (err) => console.error('[screenshot pageerror]', err.message))

  await pageRef.goto(`${config.url}/`, { waitUntil: 'domcontentloaded' })
  await pageRef.getByText('流光大屏').waitFor({ timeout: 15000 })
  await pageRef.locator('canvas').first().waitFor({ timeout: 15000 })
  await sleep(2000)

  await captureOnce()
  running = true
  timer = setInterval(captureOnce, config.interval)
  return { running: true }
}

export async function stopCapture() {
  if (timer) clearInterval(timer)
  timer = null
  if (browser) {
    await browser.close()
    browser = null
  }
  pageRef = null
  running = false
  return { running: false }
}

export function captureStatus() {
  return { running }
}
