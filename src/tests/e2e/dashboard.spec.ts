import { test, expect } from '@playwright/test'

test('dashboard opens with title and at least one chart canvas', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('流光大屏')).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('实时监控预警')).toBeVisible()
})
