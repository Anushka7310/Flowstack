import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { ProviderRepository } from '@/repositories/provider.repository'
import { authenticate } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Authenticate user
    await authenticate(request)

    const providerRepo = new ProviderRepository()
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')

    const skip = (page - 1) * limit
    const providers = await providerRepo.findAll({ skip, limit })

    const response: ApiResponse = {
      success: true,
      data: providers,
      message: 'Providers retrieved successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Get providers error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
