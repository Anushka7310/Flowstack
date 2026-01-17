import '../setup'
import { AppointmentService } from '@/services/appointment.service'
import { PatientRepository } from '@/repositories/patient.repository'
import { ProviderRepository } from '@/repositories/provider.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { hashPassword } from '@/lib/auth/password'
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '@/lib/utils/errors'
import { UserRole, ProviderSpecialty, AppointmentStatus } from '@/types'
import type { CreateAppointmentInput } from '@/validators/appointment.validator'

describe('AppointmentService', () => {
  let appointmentService: AppointmentService
  let patientRepo: PatientRepository
  let providerRepo: ProviderRepository
  let appointmentRepo: AppointmentRepository

  let testPatientId: string
  let testProviderId: string

  beforeEach(async () => {
    appointmentService = new AppointmentService()
    patientRepo = new PatientRepository()
    providerRepo = new ProviderRepository()
    appointmentRepo = new AppointmentRepository()

    // Create test patient
    const patient = await patientRepo.create({
      email: 'patient@test.com',
      password: await hashPassword('Password123'),
      role: UserRole.PATIENT,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      address: '123 Main St',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+1234567891',
        relationship: 'Spouse',
      },
      isActive: true,
    })
    testPatientId = patient._id.toString()

    // Create test provider with availability
    const provider = await providerRepo.create({
      email: 'provider@test.com',
      password: await hashPassword('Password123'),
      role: UserRole.PROVIDER,
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      phone: '+1234567890',
      specialty: ProviderSpecialty.CARDIOLOGY,
      licenseNumber: 'LIC123456',
      maxDailyAppointments: 8,
      availability: [
        {
          dayOfWeek: 1, // Monday
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        },
        {
          dayOfWeek: 2, // Tuesday
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        },
      ],
      isActive: true,
    })
    testProviderId = provider._id.toString()
  })

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      // Get next Monday at 10:00 AM (within provider availability)
      const nextMonday = getNextDayOfWeek(1)
      nextMonday.setHours(10, 0, 0, 0)

      const input: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: nextMonday.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      const appointment = await appointmentService.createAppointment(
        testPatientId,
        input
      )

      expect(appointment).toBeTruthy()
      expect(appointment.patientId.toString()).toBe(testPatientId)
      expect(appointment.providerId.toString()).toBe(testProviderId)
      expect(appointment.status).toBe(AppointmentStatus.SCHEDULED)
      expect(appointment.patientSnapshot).toHaveProperty('firstName', 'John')
    })

    it('should throw NotFoundError for invalid provider', async () => {
      const nextMonday = getNextDayOfWeek(1)
      nextMonday.setHours(10, 0, 0, 0)

      const input: CreateAppointmentInput = {
        providerId: '507f1f77bcf86cd799439011', // Non-existent ID
        startTime: nextMonday.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      await expect(
        appointmentService.createAppointment(testPatientId, input)
      ).rejects.toThrow(NotFoundError)
    })

    it('should throw ValidationError for time outside provider availability', async () => {
      // Wednesday (not in provider availability)
      const nextWednesday = getNextDayOfWeek(3)
      nextWednesday.setHours(10, 0, 0, 0)

      const input: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: nextWednesday.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      await expect(
        appointmentService.createAppointment(testPatientId, input)
      ).rejects.toThrow('Appointment time is outside provider availability')
    })

    it('should throw ConflictError for overlapping appointments', async () => {
      const nextMonday = getNextDayOfWeek(1)
      nextMonday.setHours(10, 0, 0, 0)

      const input: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: nextMonday.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      // Create first appointment
      await appointmentService.createAppointment(testPatientId, input)

      // Try to create overlapping appointment
      await expect(
        appointmentService.createAppointment(testPatientId, input)
      ).rejects.toThrow(ConflictError)
      await expect(
        appointmentService.createAppointment(testPatientId, input)
      ).rejects.toThrow('Time slot is not available')
    })

    it('should throw ConflictError when daily appointment limit reached', async () => {
      // Update provider to have max 1 appointment per day
      await providerRepo.update(testProviderId, { maxDailyAppointments: 1 })

      const nextMonday = getNextDayOfWeek(1)
      nextMonday.setHours(10, 0, 0, 0)

      const input1: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: nextMonday.toISOString(),
        duration: 30,
        reason: 'First appointment',
      }

      await appointmentService.createAppointment(testPatientId, input1)

      // Try to create second appointment on same day
      const laterTime = new Date(nextMonday)
      laterTime.setHours(14, 0, 0, 0)

      const input2: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: laterTime.toISOString(),
        duration: 30,
        reason: 'Second appointment',
      }

      await expect(
        appointmentService.createAppointment(testPatientId, input2)
      ).rejects.toThrow('Provider has reached maximum appointments for this day')
    })
  })

  describe('cancelAppointment', () => {
    it('should cancel appointment successfully', async () => {
      // Create appointment far in future (more than 24 hours)
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      futureDate.setHours(10, 0, 0, 0)

      // Ensure it's a Monday
      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1)
      }

      const input: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: futureDate.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      const appointment = await appointmentService.createAppointment(
        testPatientId,
        input
      )

      await appointmentService.cancelAppointment(
        appointment._id.toString(),
        testPatientId,
        'patient'
      )

      const updated = await appointmentRepo.findById(appointment._id.toString())
      expect(updated?.status).toBe(AppointmentStatus.CANCELLED)
    })

    it('should throw ForbiddenError when patient tries to cancel another patient appointment', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      futureDate.setHours(10, 0, 0, 0)

      while (futureDate.getDay() !== 1) {
        futureDate.setDate(futureDate.getDate() + 1)
      }

      const input: CreateAppointmentInput = {
        providerId: testProviderId,
        startTime: futureDate.toISOString(),
        duration: 30,
        reason: 'Regular checkup',
      }

      const appointment = await appointmentService.createAppointment(
        testPatientId,
        input
      )

      await expect(
        appointmentService.cancelAppointment(
          appointment._id.toString(),
          '507f1f77bcf86cd799439011', // Different patient ID
          'patient'
        )
      ).rejects.toThrow(ForbiddenError)
    })
  })
})

// Helper function to get next occurrence of a day of week
function getNextDayOfWeek(dayOfWeek: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7 || 7))
  return date
}
