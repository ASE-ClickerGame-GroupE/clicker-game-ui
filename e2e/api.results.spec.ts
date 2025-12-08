import { test, expect } from '@playwright/test'
/* eslint-disable @typescript-eslint/no-explicit-any */

const APP_URL = 'http://localhost:5173/'

test('authenticated user uses backend results and sends new score', async ({ page }) => {
  const fakeResults = [
    { id: '1', finishedAt: 1765124340664, score: 10 },
    { id: '2', finishedAt: 1765124340664, score: 2 },
  ]

  let postedBody: any = null

  await page.route('**/api/results', async route => {
    const req = route.request()

    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          fakeResults.map(r => ({
            id: r.id,
            finishedAt: r.finishedAt,
            scores: r.score,
          })),
        ),
      })
      return
    }

    if (req.method() === 'POST') {
      postedBody = req.postDataJSON()
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
      return
    }

    await route.continue()
  })


  await page.addInitScript(() => {
    window.localStorage.setItem('isAuth', 'true')
  })

  await page.goto(APP_URL)


  await expect(page.getByText('Hits: 10')).toBeVisible()
  await expect(page.getByText('Hits: 2')).toBeVisible()


  await page.getByTestId('play-button').click()
  const target = page.getByTestId('target')
  await target.click()

  await page.waitForTimeout(500)


  await expect.poll(() => postedBody).not.toBeNull()
  expect(postedBody).toMatchObject({ score: 1 })
})
