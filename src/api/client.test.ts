import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the axios module to have a functional interceptor chain
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  
  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token');
    
    // Simulate the interceptor being registered
    const requestInterceptorFn = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];

    // Create a dummy config to simulate interceptor input
    const config = { url: '/api/v1/test', headers: {} };
    
    const result = requestInterceptorFn(config);

    expect(result.headers.Authorization).toBe('Bearer mock-token');
  });

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token');
    
    const requestInterceptorFn = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    const config = { url: '/api/v1/auth/login', headers: {} };
    
    const result = requestInterceptorFn(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});
