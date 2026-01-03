const mockAuthApiPost = jest.fn()
const mockAxiosPost = jest.fn()

// Mock axios module
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: mockAuthApiPost,
    get: jest.fn(),
  }

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      post: mockAxiosPost,
      get: jest.fn(),
    },
    create: jest.fn(() => mockAxiosInstance),
    post: mockAxiosPost,
    get: jest.fn(),
  }
})

import { loginRequest, registerRequest } from './auth.ts'
import axios from 'axios'

describe('api auth wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('loginRequest returns access_token on success', async () => {
    mockAxiosPost.mockResolvedValue({
      data: { access_token: 'abc123', token_type: 'bearer' }
    })

    const res = await loginRequest('username', 'password')

    expect(res).toEqual({ access_token: 'abc123', token_type: 'bearer' })
    expect(mockAxiosPost).toHaveBeenCalled()
  })

  it('registerRequest returns user data on success', async () => {
    mockAuthApiPost.mockResolvedValue({
      data: {
        user_id: 'user-123',
        loging: 'testuser',
        email: 'test@example.com',
        created_at: 1234567890
      }
    })

    const res = await registerRequest('testuser', 'test@example.com', 'password')

    expect(res).toEqual({
      user_id: 'user-123',
      loging: 'testuser',
      email: 'test@example.com',
      created_at: 1234567890
    })
    expect(mockAuthApiPost).toHaveBeenCalled()
  })

  it('loginRequest throws on failure', async () => {
    mockAxiosPost.mockRejectedValue(new Error('bad request'))
    await expect(loginRequest('username', 'x')).rejects.toBeDefined()
  })
})
