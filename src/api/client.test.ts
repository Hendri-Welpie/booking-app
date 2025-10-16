import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './client';

vi.mock('axios', () => {
  const mockAxiosInstance = {
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
    create: vi.fn(() => mockAxiosInstance),
  };
  return {
    default: mockAxiosInstance,
    ...mockAxiosInstance,
  };
});

describe('api client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token');

    await import('./client');

    const fulfilledHandler = api.interceptors.request.use.mock.calls[0][0];

    const mockConfig = { headers: {} };
    const cfg = await fulfilledHandler(mockConfig);

    expect(cfg.headers.Authorization).toBe('Bearer mock-token');
  });

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token');
    await import('./client');

    const fulfilledHandler = api.interceptors.request.use.mock.calls[0][0];

    const mockConfig = { url: '/api/v1/auth/login', headers: {} };
    const cfg = await fulfilledHandler(mockConfig);

    expect(cfg.headers.Authorization).toBeUndefined();
  });
});