import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { startCapture, stopCapture, captureStatus } from './scripts/screenshot-core.mjs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'screenshot-control',
      configureServer(server) {
        server.middlewares.use('/api/screenshot', (req, res) => {
          const port = server.config.server.port || 5173
          const url = `http://localhost:${port}`

          const json = (data) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          }

          if (req.method === 'POST' && req.url === '/start') {
            startCapture({ url }).catch((err) =>
              console.error('[screenshot] start failed', err),
            )
            json({ running: true })
            return
          }
          if (req.method === 'POST' && req.url === '/stop') {
            stopCapture().then(() => json({ running: false }))
            return
          }
          if (req.method === 'GET' && req.url === '/status') {
            json(captureStatus())
            return
          }
          res.statusCode = 404
          res.end('Not found')
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/tests/unit/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      thresholds: {
        lines: 60,
        branches: 60,
        functions: 60,
        statements: 60,
      },
    },
  },
})
