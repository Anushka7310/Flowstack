import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AppointmentService } from '@/services/appointment.service'
import { createAppointmentSchema } from '@/validators/appointment.validator'
import { authenticate } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse, UserRole } from '@/types'

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

    // Authenticate user
    let user
    try {
      user = await authenticate(request)
    } catch (authError) {
      console.error('Authentication error:', authError)
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication failed. Please login again.',
        },
        { status: 401 }
      )
    }

    // Only patients can create appointments
    if (user.role !== UserRole.PATIENT) {
      return NextResponse.json(
        { success: false, error: 'Only patients can book appointments' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    let validatedData
    try {
      validatedData = createAppointmentSchema.parse(body)
    } catch (validationError: any) {
      console.error('Validation error:', validationError)
      return NextResponse.json(
        {
          success: false,
          error: validationError.errors?.[0]?.message || 'Invalid input data',
        },
        { status: 400 }
      )
    }

    const appointmentService = new AppointmentService()
    const appointment = await appointmentService.createAppointment(
      user.userId,
      validatedData
    )

    const response: ApiResponse = {
      success: true,
      data: appointment,
      message: 'Appointment created successfully',
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Appointment creation error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const user = await authenticate(request)
    const appointmentService = new AppointmentService()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let result

    if (user.role === UserRole.PATIENT) {
      result = await appointmentService.getPatientAppointments(
        user.userId,
        page,
        limit
      )
    } else if (user.role === UserRole.PROVIDER) {
      const startDate = searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : new Date()
      const endDate = searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      const appointments = await appointmentService.getProviderAppointments(
        user.userId,
        startDate,
        endDate
      )
      result = { appointments, total: appointments.length }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid user role' },
        { status: 403 }
      )
    }

    const response: ApiResponse = {
      success: true,
      data: result,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('GET /api/appointments error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
