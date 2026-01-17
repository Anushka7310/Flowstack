import { SignJWT, jwtVerify } from 'jose'
import { JWTPayload } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || ''
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
  throw new Error('JWT_SECRET environment variable is not set')
}

const secret = new TextEncoder().encode(JWT_SECRET)

export async function signToken(payload: JWTPayload): Promise<string> {
  const expiresIn = JWT_EXPIRES_IN.endsWith('d')
    ? parseInt(JWT_EXPIRES_IN) * 24 * 60 * 60
    : parseInt(JWT_EXPIRES_IN)

  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret)
  return {
    userId: payload.userId as string,
    email: payload.email as string,
    role: payload.role as string,
  } as JWTPayload
}
