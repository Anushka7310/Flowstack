'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

interface AvailabilitySlot {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

export default function AvailabilityPage() {
  const router = useRouter()
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 0, startTime: '', endTime: '', isActive: false },
    { dayOfWeek: 6, startTime: '', endTime: '', isActive: false },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'provider') {
      router.push('/auth/login')
      return
    }
  }, [router])

  const handleSlotChange = (index: number, field: string, value: any) => {
    const newAvailability = [...availability]
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    }
    setAvailability(newAvailability)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      // Filter out inactive slots with no times
      const activeSlots = availability.filter(
        (slot) => slot.isActive && slot.startTime && slot.endTime
      )

      const response = await fetch('/api/providers/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ availability: activeSlots }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update availability')
        return
      }

      setSuccess('Availability updated successfully!')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                HealthCare+
              </Link>
              <div className="flex gap-4">
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/settings/availability" className="text-blue-600 font-medium">
                  Availability
                </Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Your Availability</h1>
          <p className="text-gray-600 mt-2">Set your working hours for each day of the week</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Availability Slots */}
            <div className="space-y-4">
              {availability.map((slot, index) => {
                const dayLabel = DAYS_OF_WEEK.find((d) => d.value === slot.dayOfWeek)?.label
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {/* Day */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{dayLabel}</p>
                      </div>

                      {/* Active Toggle */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={slot.isActive}
                          onChange={(e) =>
                            handleSlotChange(index, 'isActive', e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-600">Available</label>
                      </div>

                      {/* Start Time */}
                      {slot.isActive && (
                        <>
                          <div>
                            <input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                handleSlotChange(index, 'startTime', e.target.value)
                              }
                              required={slot.isActive}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>

                          {/* End Time */}
                          <div>
                            <input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                handleSlotChange(index, 'endTime', e.target.value)
                              }
                              required={slot.isActive}
                              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Patients can only book appointments during your available hours.
                Make sure to set your availability before patients try to book.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Availability'}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
