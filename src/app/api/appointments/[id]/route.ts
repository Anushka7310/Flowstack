import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AppointmentService } from '@/services/appointment.service'
import { updateAppointmentSchema } from '@/validators/appointment.validator'
import { authenticate } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const appointmentService = new AppointmentService()
    const { id } = await params

    const appointment = await appointmentService.getAppointmentById(
      id,
      user.userId,
      user.role
    )

    const response: ApiResponse = {
      success: true,
      data: appointment,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('GET /api/appointments/[id] error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const body = await request.json() as Record<string, unknown>
    const validatedData = updateAppointmentSchema.parse(body)
    const { id } = await params

    const appointmentService = new AppointmentService()
    const appointment = await appointmentService.updateAppointment(
      id,
      user.userId,
      user.role,
      validatedData
    )

    const response: ApiResponse = {
      success: true,
      data: appointment,
      message: 'Appointment updated successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('PATCH /api/appointments/[id] error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const appointmentService = new AppointmentService()
    const { id } = await params

    await appointmentService.cancelAppointment(id, user.userId, user.role)

    const response: ApiResponse = {
      success: true,
      message: 'Appointment cancelled successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('DELETE /api/appointments/[id] error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
