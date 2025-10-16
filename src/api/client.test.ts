import api from './client'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('adds Authorization header if token exists', async () => {
    localStorage.setItem('token', 'mock-token')

    const spy = vi.spyOn(axios, 'request').mockResolvedValue({ data: {} })

    await api.get('/api/v1/test')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
        }),
      })
    )
  })

  it('skips Authorization for /auth/login', async () => {
    localStorage.setItem('token', 'mock-token')

    const spy = vi.spyOn(axios, 'request').mockResolvedValue({ data: {} })

    await api.post('/api/v1/auth/login')

    expect(spy).toHaveBeenCalledWith(
      expect.not.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token',
        }),
      })
    )
  })
})
