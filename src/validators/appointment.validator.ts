import { z } from 'zod'
import { AppointmentStatus } from '@/types'

export const createAppointmentSchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid provider ID'),
  startTime: z.string().refine((date) => {
    const appointmentDate = new Date(date)
    const now = new Date()
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    return appointmentDate >= twoHoursFromNow
  }, 'Appointments must be booked at least 2 hours in advance'),
  duration: z.number().min(15).max(120).default(30), // minutes
  reason: z.string().min(5, 'Reason is required').max(500),
})

export const updateAppointmentSchema = z.object({
  startTime: z.string().optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  notes: z.string().max(1000).optional(),
  prescription: z.string().max(2000).optional(),
  rating: z.number().min(1).max(5).optional(),
  patientFeedback: z.string().max(1000).optional(),
})

export const cancelAppointmentSchema = z.object({
  reason: z.string().min(5, 'Cancellation reason is required').max(500),
})

export const getAppointmentsQuerySchema = z.object({
  providerId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  patientId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>
export type GetAppointmentsQuery = z.infer<typeof getAppointmentsQuerySchema>
