import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { ProviderRepository } from '@/repositories/provider.repository'
import { authenticate, authorize } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { updateProviderAvailabilitySchema } from '@/validators/provider.validator'
import { ApiResponse, UserRole } from '@/types'

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()

    // Authenticate and authorize
    const user = await authenticate(request)
    authorize([UserRole.PROVIDER])(user)

    const body = await request.json()
    const validatedData = updateProviderAvailabilitySchema.parse(body)

    const providerRepo = new ProviderRepository()
    const updated = await providerRepo.update(user.userId, {
      availability: validatedData.availability,
    })

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update availability',
        },
        { status: 400 }
      )
    }

    const response: ApiResponse = {
      success: true,
      data: updated,
      message: 'Availability updated successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('Update availability error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
