import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAxiosInstance = {
  // Mock any methods your client might use
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
}

vi.mock('axios', () => {
  return {
    default: {
      // Mock the `create` method to return our mock instance
      create: vi.fn(() => mockAxiosInstance),
    },
  }
})

describe('api client', () => {
  let requestInterceptorFn: (arg0: { headers: Record<string, string>; url: string }) => any

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()

    // Capture the interceptor callback
    const [fulfilled] = mockAxiosInstance.interceptors.request.use.mock.calls[0]
    requestInterceptorFn = fulfilled
  })

  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token')

    const config = { headers: {} as Record<string, string>, url: '/api/v1/test' }
    const result = await requestInterceptorFn(config)

    expect(result.headers.Authorization).toBe('Bearer mock-token')
  })

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token')

    const config = { headers: {} as Record<string, string>, url: '/api/v1/auth/login' }
    const result = await requestInterceptorFn(config)

    expect(result.headers.Authorization).toBeUndefined()
  })
})
