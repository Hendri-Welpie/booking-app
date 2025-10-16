import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Set up a comprehensive mock for axios
vi.mock('axios', () => {
  const mockAxiosInstance = {
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

  return {
    // When axios.create() is called, return the mock instance
    create: vi.fn(() => mockAxiosInstance),
    // Fallback for direct axios calls
    ...mockAxiosInstance,
  }
})

// Now you can safely describe and test your API client
describe('api client', () => {
  // Mock the interceptor callback function.
  // This will let you verify if the interceptor is called with the right config.
  const mockInterceptor = vi.fn((config) => config);
  
  beforeEach(() => {
    localStorage.clear();
    // Reset all mocks before each test
    vi.clearAllMocks(); 
    // Re-implement the mock interceptor use method to capture the callback
    (axios.create() as any).interceptors.request.use.mockImplementation((callback) => {
      mockInterceptor.mockImplementation(callback);
    });
  });

  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token');

    // Manually run the interceptor with a dummy config.
    const config = { headers: {} as Record<string, string> };
    const result = mockInterceptor(config);
    
    expect(result.headers.Authorization).toBe('Bearer mock-token');
  });

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token');

    // Manually run the interceptor for the login URL.
    const config = { url: '/api/v1/auth/login', headers: {} as Record<string, string> };
    const result = mockInterceptor(config);
    
    expect(result.headers.Authorization).toBeUndefined();
  });
});
