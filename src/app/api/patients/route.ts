import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { PatientRepository } from '@/repositories/patient.repository'
import { authenticate, authorize } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse, UserRole } from '@/types'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Authenticate and authorize (providers only)
    const user = await authenticate(request)
    authorize([UserRole.PROVIDER])(user)

    const appointmentRepo = new AppointmentRepository()
    const patientRepo = new PatientRepository()

    // Get all appointments for this provider
    const startOfDay = new Date()
    startOfDay.setFullYear(2000) // Get all appointments from beginning of time
    const endOfDay = new Date()
    endOfDay.setFullYear(2100) // Get all appointments to end of time

    const appointments = await appointmentRepo.findByProvider(
      user.userId,
      startOfDay,
      endOfDay
    )

    // Get unique patient IDs - handle both ObjectId and string formats
    const patientIds = [...new Set(appointments.map((apt) => {
      const record = apt as Record<string, unknown>
      const patientId = record.patientId
      if (typeof patientId === 'string') return patientId
      if (patientId && typeof patientId === 'object' && '_id' in patientId) {
        return (patientId as { _id: { toString: () => string } })._id.toString()
      }
      return null
    }).filter(Boolean))] as string[]

    // Fetch patient details
    const patients = await Promise.all(
      patientIds.map((patientId) => patientRepo.findById(patientId as string))
    )

    // Filter out null values and return
    const validPatients = patients.filter((p) => p !== null)

    const response: ApiResponse = {
      success: true,
      data: validPatients,
      message: 'Patients retrieved successfully',
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error: unknown) {
    console.error('Get patients error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
