import { test, expect } from '@playwright/test'

const APP_URL = 'http://localhost:5173/'
const mockUserId = 'test-user-id'

const backendResults = [
  { id: '1', finished_at: 1765124340664, scores: { [mockUserId]: 10 } },
  { id: '2', finished_at: 1765124340664, scores: { [mockUserId]: 2 } },
]

test.skip('authenticated user uses backend results and sends new score', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'token',
      value: 'fake-token',
      url: APP_URL,
    },
  ])

  await page.route('**/game?user_id*', async (route) => {
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
        scores: body.scores || { [mockUserId]: body.score },
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

  await expect(page.getByText('Hits: 10')).toBeVisible()
  await expect(page.getByText('Hits: 2')).toBeVisible()
})
