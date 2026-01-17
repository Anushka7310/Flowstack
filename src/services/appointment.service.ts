import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ProviderRepository } from '@/repositories/provider.repository'
import { PatientRepository } from '@/repositories/patient.repository'
import { addDuration, isWithinCancellationWindow } from '@/lib/utils/date'
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '@/lib/utils/errors'
import { AppointmentStatus } from '@/types'
import type { CreateAppointmentInput, UpdateAppointmentInput } from '@/validators/appointment.validator'

export class AppointmentService {
  private appointmentRepo: AppointmentRepository
  private providerRepo: ProviderRepository
  private patientRepo: PatientRepository

  constructor() {
    this.appointmentRepo = new AppointmentRepository()
    this.providerRepo = new ProviderRepository()
    this.patientRepo = new PatientRepository()
  }

  async createAppointment(
    patientId: string,
    input: CreateAppointmentInput
  ): Promise<any> {
    // Validate provider exists and is active
    const provider = await this.providerRepo.findById(input.providerId)
    if (!provider || !provider.isActive) {
      throw new NotFoundError('Provider not found or inactive')
    }

    // Validate patient exists
    const patient = await this.patientRepo.findById(patientId)
    if (!patient) {
      throw new NotFoundError('Patient not found')
    }

    const startTime = new Date(input.startTime)
    const endTime = addDuration(startTime, input.duration)

    // Check if provider has reached daily appointment limit
    const appointmentCount = await this.appointmentRepo.countByProviderAndDate(
      input.providerId,
      startTime
    )
    if (appointmentCount >= provider.maxDailyAppointments) {
      throw new ConflictError('Provider has reached maximum appointments for this day')
    }

    // Check for conflicting appointments
    const conflicts = await this.appointmentRepo.findConflictingAppointments(
      input.providerId,
      startTime,
      endTime
    )

    if (conflicts.length > 0) {
      throw new ConflictError('Time slot is not available')
    }

    // Check if appointment is within provider's availability
    const dayOfWeek = startTime.getDay()
    const timeString = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`

    if (!provider.availability || provider.availability.length === 0) {
      throw new ValidationError('Provider has not set their availability yet. Please choose another provider.')
    }

    const isWithinAvailability = provider.availability.some((avail) => {
      return (
        avail.dayOfWeek === dayOfWeek &&
        avail.isActive &&
        timeString >= avail.startTime &&
        timeString < avail.endTime
      )
    })

    if (!isWithinAvailability) {
      throw new ValidationError('Appointment time is outside provider availability. Please choose a different time.')
    }

    // Create appointment with patient snapshot
    const appointment = await this.appointmentRepo.create({
      patientId: patient._id,
      providerId: provider._id,
      startTime,
      endTime,
      reason: input.reason,
      status: AppointmentStatus.SCHEDULED,
      patientSnapshot: {
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
      },
    })

    return appointment
  }

  async getAppointmentById(id: string, userId: string, userRole: string): Promise<any> {
    const appointment = await this.appointmentRepo.findByIdWithReferences(id)
    if (!appointment) {
      throw new NotFoundError('Appointment not found')
    }

    // Authorization check - handle both ObjectId and string comparisons
    const patientIdStr = appointment.patientId?._id?.toString() || appointment.patientId?.toString()
    const providerIdStr = appointment.providerId?._id?.toString() || appointment.providerId?.toString()

    if (userRole === 'patient' && patientIdStr !== userId) {
      throw new ForbiddenError('Access denied')
    }

    if (userRole === 'provider' && providerIdStr !== userId) {
      throw new ForbiddenError('Access denied')
    }

    return appointment
  }

  async getPatientAppointments(
    patientId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ appointments: any[]; total: number }> {
    const skip = (page - 1) * limit
    const appointments = await this.appointmentRepo.findByPatient(patientId, {
      skip,
      limit,
    })
    const total = await this.appointmentRepo.countByPatient(patientId)

    return { appointments, total }
  }

  async getProviderAppointments(
    providerId: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    return this.appointmentRepo.findByProvider(providerId, startDate, endDate)
  }

  async updateAppointment(
    id: string,
    userId: string,
    userRole: string,
    input: UpdateAppointmentInput
  ): Promise<any> {
    const appointment = await this.appointmentRepo.findById(id)
    if (!appointment) {
      throw new NotFoundError('Appointment not found')
    }

    // Authorization check - handle both ObjectId and string comparisons
    const patientIdStr = appointment.patientId?._id?.toString() || appointment.patientId?.toString()
    const providerIdStr = appointment.providerId?._id?.toString() || appointment.providerId?.toString()

    if (userRole === 'patient' && patientIdStr !== userId) {
      throw new ForbiddenError('Access denied')
    }

    if (userRole === 'provider' && providerIdStr !== userId) {
      throw new ForbiddenError('Access denied')
    }

    // Patients can only update notes, providers can update status and notes
    if (userRole === 'patient' && input.status) {
      throw new ForbiddenError('Patients cannot update appointment status')
    }

    const updated = await this.appointmentRepo.update(id, {
      ...input,
      startTime: input.startTime ? new Date(input.startTime) : undefined,
    })
    if (!updated) {
      throw new NotFoundError('Failed to update appointment')
    }

    return updated
  }

  async cancelAppointment(
    id: string,
    userId: string,
    userRole: string
  ): Promise<void> {
    const appointment = await this.appointmentRepo.findById(id)
    if (!appointment) {
      throw new NotFoundError('Appointment not found')
    }

    // Authorization check - handle both ObjectId and string comparisons
    const patientIdStr = appointment.patientId?._id?.toString() || appointment.patientId?.toString()

    if (userRole === 'patient' && patientIdStr !== userId) {
      throw new ForbiddenError('Access denied')
    }

    // Check cancellation window (24 hours for patients)
    if (userRole === 'patient' && !isWithinCancellationWindow(appointment.startTime)) {
      throw new ValidationError(
        'Appointments can only be cancelled at least 24 hours in advance'
      )
    }

    await this.appointmentRepo.update(id, {
      status: AppointmentStatus.CANCELLED,
    })
  }
}
