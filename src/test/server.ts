import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

interface LoginRequestBody {
  username?: string;
  password?: string;
}

export const handlers = [
  http.post<never, LoginRequestBody>(
    'http://localhost:9080/api/v1/auth/login',
    async ({ request }) => {
      const body = await request.json()
      if (body?.username === 'test' && body?.password === 'pass') {
        return HttpResponse.json({ token: 'mock-token' })
      }
      return new HttpResponse(null, { status: 401 })
    }
  ),

  http.post('http://localhost:9080/api/v1/auth/register', () =>
    HttpResponse.json({ message: 'Registered successfully' })
  ),

  http.get('http://localhost:9080/api/v1/reservations/available-rooms', () =>
    HttpResponse.json([
      { id: 1, roomNumber: 101, roomType: 'Deluxe' },
      { id: 2, roomNumber: 202, roomType: 'Standard' },
    ])
  ),

  http.get('http://localhost:9080/api/v1/user', () =>
    HttpResponse.json({ id: 'user-123', username: 'test' })
  ),
]

export const server = setupServer(...handlers)
