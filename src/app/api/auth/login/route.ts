import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AuthService } from '@/services/auth.service'
import { loginSchema } from '@/validators/auth.validator'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed. Please check your MONGODB_URI environment variable.',
        },
        { status: 500 }
      )
    }

    const body = await request.json() as Record<string, unknown>
    const validatedData = loginSchema.parse(body)

    const authService = new AuthService()
    const result = await authService.login(validatedData)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Login error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
