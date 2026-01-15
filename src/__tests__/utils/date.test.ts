import {
  addDuration,
  isTimeSlotAvailable,
  isWithinCancellationWindow,
} from '@/lib/utils/date'

describe('Date Utilities', () => {
  describe('addDuration', () => {
    it('should add minutes to a date', () => {
      const date = new Date('2024-01-15T10:00:00Z')
      const result = addDuration(date, 30)

      expect(result.getTime()).toBe(new Date('2024-01-15T10:30:00Z').getTime())
    })

    it('should handle hour boundaries', () => {
      const date = new Date('2024-01-15T10:45:00Z')
      const result = addDuration(date, 30)

      expect(result.getTime()).toBe(new Date('2024-01-15T11:15:00Z').getTime())
    })
  })

  describe('isTimeSlotAvailable', () => {
    it('should return true for non-overlapping slots', () => {
      const slotStart = new Date('2024-01-15T10:00:00Z')
      const slotEnd = new Date('2024-01-15T10:30:00Z')

      const existingAppointments = [
        {
          startTime: new Date('2024-01-15T09:00:00Z'),
          endTime: new Date('2024-01-15T09:30:00Z'),
        },
        {
          startTime: new Date('2024-01-15T11:00:00Z'),
          endTime: new Date('2024-01-15T11:30:00Z'),
        },
      ]

      const result = isTimeSlotAvailable(slotStart, slotEnd, existingAppointments)
      expect(result).toBe(true)
    })

    it('should return false for overlapping slots (start overlap)', () => {
      const slotStart = new Date('2024-01-15T10:15:00Z')
      const slotEnd = new Date('2024-01-15T10:45:00Z')

      const existingAppointments = [
        {
          startTime: new Date('2024-01-15T10:00:00Z'),
          endTime: new Date('2024-01-15T10:30:00Z'),
        },
      ]

      const result = isTimeSlotAvailable(slotStart, slotEnd, existingAppointments)
      expect(result).toBe(false)
    })

    it('should return false for overlapping slots (end overlap)', () => {
      const slotStart = new Date('2024-01-15T09:45:00Z')
      const slotEnd = new Date('2024-01-15T10:15:00Z')

      const existingAppointments = [
        {
          startTime: new Date('2024-01-15T10:00:00Z'),
          endTime: new Date('2024-01-15T10:30:00Z'),
        },
      ]

      const result = isTimeSlotAvailable(slotStart, slotEnd, existingAppointments)
      expect(result).toBe(false)
    })

    it('should return false for completely overlapping slots', () => {
      const slotStart = new Date('2024-01-15T09:30:00Z')
      const slotEnd = new Date('2024-01-15T11:00:00Z')

      const existingAppointments = [
        {
          startTime: new Date('2024-01-15T10:00:00Z'),
          endTime: new Date('2024-01-15T10:30:00Z'),
        },
      ]

      const result = isTimeSlotAvailable(slotStart, slotEnd, existingAppointments)
      expect(result).toBe(false)
    })

    it('should return false for exact match', () => {
      const slotStart = new Date('2024-01-15T10:00:00Z')
      const slotEnd = new Date('2024-01-15T10:30:00Z')

      const existingAppointments = [
        {
          startTime: new Date('2024-01-15T10:00:00Z'),
          endTime: new Date('2024-01-15T10:30:00Z'),
        },
      ]

      const result = isTimeSlotAvailable(slotStart, slotEnd, existingAppointments)
      expect(result).toBe(false)
    })
  })

  describe('isWithinCancellationWindow', () => {
    it('should return true for appointments more than 24 hours away', () => {
      const futureDate = new Date()
      futureDate.setHours(futureDate.getHours() + 48)

      const result = isWithinCancellationWindow(futureDate)
      expect(result).toBe(true)
    })

    it('should return false for appointments less than 24 hours away', () => {
      const nearFuture = new Date()
      nearFuture.setHours(nearFuture.getHours() + 12)

      const result = isWithinCancellationWindow(nearFuture)
      expect(result).toBe(false)
    })

    it('should return false for past appointments', () => {
      const pastDate = new Date()
      pastDate.setHours(pastDate.getHours() - 1)

      const result = isWithinCancellationWindow(pastDate)
      expect(result).toBe(false)
    })
  })
})
