import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider } from '../auth/AuthContext'
import HomePage from './HomePage'
import { SnackbarProvider } from 'notistack'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'

describe('HomePage', () => {
  it('renders available rooms', async () => {
    render(
      <MemoryRouter>
        <SnackbarProvider>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </SnackbarProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Room 101/i)).toBeInTheDocument()
      expect(screen.getByText(/Room 202/i)).toBeInTheDocument()
    })
  })
})
