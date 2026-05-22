import { expect, test } from '@playwright/test'

const SAMPLE_MD = `---
title: "E2E sample"
---

# Hello E2E

Paragraph text with **bold**.

- one
- two
`

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    window.localStorage.setItem('md-bridge:locale', 'en')
  })
})

test('Markdown → PDF end-to-end', async ({ page }) => {
  await page.goto('/convert/md-to-pdf')

  await page.getByLabel(/pasted markdown/i).fill(SAMPLE_MD)

  await page.getByRole('button', { name: /^convert$/i }).click()

  const iframe = page.locator('iframe.pdf-preview')
  await expect(iframe).toBeVisible({ timeout: 60_000 })
  await expect(iframe).toHaveAttribute('src', /^blob:/)
})

test('Toast stays visible while hovered and dismisses after hover ends', async ({ page }) => {
  await page.goto('/convert/md-to-pdf')

  await page.getByLabel(/pasted markdown/i).fill(SAMPLE_MD)
  await page.getByRole('button', { name: /^convert$/i }).click()

  const toast = page.locator('.toast', { hasText: /pdf ready/i })
  await expect(toast).toBeVisible({ timeout: 10_000 })

  await toast.hover()
  await page.waitForTimeout(4000)
  await expect(toast).toBeVisible()

  await page.mouse.move(0, 0)
  await expect(toast).toBeHidden({ timeout: 5000 })
})
