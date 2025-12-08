import { loginRequest, registerRequest, api } from './auth'

describe('api auth wrappers', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('loginRequest returns token on success', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({ data: { token: 'abc123' } })
    const res = await loginRequest('a@a.com', 'password')
    expect(res).toEqual({ token: 'abc123' })
  })

  it('registerRequest returns ok on success', async () => {
    jest.spyOn(api, 'post').mockResolvedValue({ data: { ok: true } })
    const res = await registerRequest('b@b.com', 'password')
    expect(res).toEqual({ ok: true })
  })

  it('loginRequest throws on failure', async () => {
    jest.spyOn(api, 'post').mockRejectedValue(new Error('bad request'))
    await expect(loginRequest('a@a.com', 'x')).rejects.toBeDefined()
  })
})
