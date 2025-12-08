import { test, expect } from '@playwright/test'

const APP_URL = 'http://localhost:5173/'

test('user clicks play and hits exactly one target (game continues)', async ({
   page,
 }) => {
  await page.goto(APP_URL)

  await expect(page.getByTestId('play-button')).toBeVisible()

  await page.getByTestId('play-button').click()

  await expect(page.getByTestId('game-area')).toBeVisible()
  await expect(page.getByTestId('score')).toHaveText('Score: 0')

  const target = page.getByTestId('target')
  await expect(target).toBeVisible()
  await target.click()

  await expect(page.getByTestId('score')).toHaveText('Score: 1')

  await expect(page.getByTestId('game-over')).toHaveCount(0)
})

test('user plays one round, game ends with score 1 and result is persisted', async ({
  page,
}) => {
  await page.goto(APP_URL)

  await page.evaluate(() => localStorage.clear())

  await page.getByTestId('play-button').click()

  const target = page.getByTestId('target')
  await expect(target).toBeVisible()
  await target.click()

  await expect(page.getByTestId('score')).toHaveText('Score: 1')

  await page.waitForTimeout(6000)

  await expect(page.getByTestId('game-over')).toBeVisible()
  await expect(page.getByTestId('game-over')).toContainText('Score: 1')

  await expect(page.getByTestId('target')).toHaveCount(0)

  await page.reload()

  const firstRow = page.getByTestId('result-row').first()
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toContainText('Hits: 1')
})
