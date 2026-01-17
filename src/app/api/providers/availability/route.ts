import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import { ProviderRepository } from '@/repositories/provider.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { authenticate } from '@/lib/middleware/auth.middleware'
import { handleError } from '@/lib/utils/errors'
import { ApiResponse, AppointmentStatus } from '@/types'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    await authenticate(request)

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get('providerId')
    const date = searchParams.get('date')
    const duration = parseInt(searchParams.get('duration') || '30')

    if (!providerId || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing providerId or date' },
        { status: 400 }
      )
    }

    const providerRepo = new ProviderRepository()
    const appointmentRepo = new AppointmentRepository()

    // Get provider
    const provider = await providerRepo.findById(providerId)
    if (!provider || !provider.isActive) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Parse date
    const selectedDate = new Date(date)
    const dayOfWeek = selectedDate.getDay()

    // Get provider's availability for this day
    const dayAvailability = provider.availability?.find(
      (avail) => avail.dayOfWeek === dayOfWeek && avail.isActive
    )

    if (!dayAvailability) {
      const response: ApiResponse = {
        success: true,
        data: [],
        message: 'Provider not available on this day',
      }
      return NextResponse.json(response)
    }

    // Generate time slots (30-minute intervals)
    const slots: Array<{ time: string; available: boolean }> = []
    const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number)
    const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    // Get existing appointments for this provider on this date
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingAppointments = await appointmentRepo.findByProvider(
      providerId,
      startOfDay,
      endOfDay
    )

    // Generate slots
    for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += 30) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

      // Check if slot conflicts with existing appointments
      const slotStart = new Date(selectedDate)
      slotStart.setHours(hours, mins, 0, 0)
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + duration)

      const hasConflict = existingAppointments.some((apt: any) => {
        const aptStart = new Date(apt.startTime)
        const aptEnd = new Date(apt.endTime)
        return (
          apt.status !== AppointmentStatus.CANCELLED &&
          apt.status !== AppointmentStatus.NO_SHOW &&
          ((slotStart >= aptStart && slotStart < aptEnd) ||
            (slotEnd > aptStart && slotEnd <= aptEnd) ||
            (slotStart <= aptStart && slotEnd >= aptEnd))
        )
      })

      slots.push({
        time: timeString,
        available: !hasConflict,
      })
    }

    const response: ApiResponse = {
      success: true,
      data: slots,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('GET /api/providers/availability error:', error)
    const { message, statusCode } = handleError(error)

    const response: ApiResponse = {
      success: false,
      error: message,
    }

    return NextResponse.json(response, { status: statusCode })
  }
}
