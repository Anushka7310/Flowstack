import { addMinutes, format } from 'date-fns'

export function addDuration(date: Date, minutes: number): Date {
  return addMinutes(date, minutes)
}

export function isTimeSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  existingAppointments: Array<{ startTime: Date; endTime: Date }>
): boolean {
  return !existingAppointments.some((appointment) => {
    // Check if there's any overlap
    return (
      (slotStart >= appointment.startTime && slotStart < appointment.endTime) ||
      (slotEnd > appointment.startTime && slotEnd <= appointment.endTime) ||
      (slotStart <= appointment.startTime && slotEnd >= appointment.endTime)
    )
  })
}

export function isWithinCancellationWindow(appointmentTime: Date): boolean {
  const now = new Date()
  const twentyFourHoursFromNow = addMinutes(now, 24 * 60)
  return appointmentTime > twentyFourHoursFromNow
}

export function formatAppointmentTime(date: Date): string {
  return format(date, 'MMM dd, yyyy h:mm a')
}
