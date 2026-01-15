import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AppointmentService } from '@/services/appointment.service'
import { updateAppointmentSchema } from '@/validators/appointment.validator'
import { authenticate } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const appointmentService = new AppointmentService()

    const appointment = await appointmentService.getAppointmentById(
      params.id,
      user.userId,
      user.role
    )

    const response: ApiResponse = {
      success: true,
      data: appointment,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const body = await request.json()
    const validatedData = updateAppointmentSchema.parse(body)

    const appointmentService = new AppointmentService()
    const appointment = await appointmentService.updateAppointment(
      params.id,
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
  } catch (error: any) {
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const appointmentService = new AppointmentService()

    await appointmentService.cancelAppointment(params.id, user.userId, user.role)

    const response: ApiResponse = {
      success: true,
      message: 'Appointment cancelled successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('DELETE /api/appointments/[id] error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
