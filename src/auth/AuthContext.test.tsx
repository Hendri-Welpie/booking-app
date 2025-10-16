import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import { describe, it, expect } from 'vitest'

const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  it('logs in and stores token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test', 'pass')
    })

    expect(localStorage.getItem('token')).toBe('mock-token')
    expect(result.current.user.username).toBe('test')
  })
})
