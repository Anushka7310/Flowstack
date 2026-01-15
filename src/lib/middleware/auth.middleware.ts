import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/jwt'
import { UnauthorizedError, ForbiddenError } from '@/lib/utils/errors'
import { JWTPayload, UserRole } from '@/types'

export async function authenticate(request: NextRequest): Promise<JWTPayload> {
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided')
  }

  const token = authHeader.substring(7)

  try {
    const payload = await verifyToken(token)
    return payload
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

export function authorize(allowedRoles: UserRole[]) {
  return (user: JWTPayload) => {
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError('Insufficient permissions')
    }
  }
}
