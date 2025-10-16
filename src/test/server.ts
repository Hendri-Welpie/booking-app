import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock login
  http.post('http://localhost:9080/api/v1/auth/login', async ({ request }) => {
    const body = await request.json()
    if (body?.username === 'test' && body?.password === 'pass') {
      return HttpResponse.json({ token: 'mock-token' })
    }
    return new HttpResponse(null, { status: 401 })
  }),

  // Mock register
  http.post('http://localhost:9080/api/v1/auth/register', () =>
    HttpResponse.json({ message: 'Registered successfully' })
  ),

  // Mock available rooms
  http.get('http://localhost:9080/api/v1/reservations/available-rooms', () =>
    HttpResponse.json([
      { id: 1, roomNumber: 101, roomType: 'Deluxe' },
      { id: 2, roomNumber: 202, roomType: 'Standard' },
    ])
  ),

  // Mock user
  http.get('http://localhost:9080/api/v1/user', () =>
    HttpResponse.json({ id: 'user-123', username: 'test' })
  ),
]

export const server = setupServer(...handlers)
