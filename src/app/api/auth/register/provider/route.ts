import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AuthService } from '@/services/auth.service'
import { registerProviderSchema } from '@/validators/auth.validator'
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

    const body = await request.json()
    const validatedData = registerProviderSchema.parse(body)

    const authService = new AuthService()
    const result = await authService.registerProvider(validatedData)

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Provider registered successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: unknown) {
    console.error('Registration error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
