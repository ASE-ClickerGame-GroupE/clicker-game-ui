import { test, expect } from '@playwright/test'

const APP_URL = 'http://localhost:5173/'

test('user clicks play and hits exactly one target (game continues)', async ({
  page,
}) => {
  await page.goto(APP_URL)

  // Select single player mode first
  await expect(page.getByText('SINGLE PLAYER')).toBeVisible()
  await page.getByText('SINGLE PLAYER').click()

  // Wait for and click the play button
  await page.getByTestId('play-button').click()

  await expect(page.getByTestId('game-area')).toBeVisible()
  await expect(page.getByTestId('score')).toHaveText('Score: 0')

  const target = page.getByTestId('target')
  await expect(target).toBeVisible()
  await target.click()

  await expect(page.getByTestId('score')).toHaveText('Score: 1')

  await expect(page.getByTestId('game-over')).toHaveCount(0)
})

test.skip('user plays one round, game ends with score 1 and result is persisted', async ({
  page,
}) => {
  // In-memory mock backend results for this test
  const backendResults: unknown[] = []

  await page.route('**/game?user_id', async (route) => {
    const request = route.request()

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(backendResults),
      })
      return
    }

    if (request.method() === 'POST') {
      const body = await request.postDataJSON()

      backendResults.unshift({
        id: 'new-id',
        finished_at: Date.now(),
        scores: body.score,
      })

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
      return
    }

    await route.continue()
  })

  await page.goto(APP_URL)

  await page.evaluate(() => localStorage.clear())

  // Select single player mode first
  await expect(page.getByText('SINGLE PLAYER')).toBeVisible()
  await page.getByText('SINGLE PLAYER').click()

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
