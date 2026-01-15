import { z } from 'zod'

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  isActive: z.boolean().default(true),
})

export const updateProviderAvailabilitySchema = z.object({
  availability: z.array(availabilitySchema),
})

export const updateProviderSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  maxDailyAppointments: z.number().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
})

export type AvailabilityInput = z.infer<typeof availabilitySchema>
export type UpdateProviderAvailabilityInput = z.infer<typeof updateProviderAvailabilitySchema>
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>
