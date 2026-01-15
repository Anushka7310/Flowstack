'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Provider {
  _id: string
  firstName: string
  lastName: string
  specialty: string
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    providerId: '',
    startTime: '',
    duration: 30,
    reason: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'patient') {
      router.push('/auth/login')
      return
    }

    fetchProviders(token)
  }, [router])

  const fetchProviders = async (token: string) => {
    try {
      const response = await fetch('/api/providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch providers: ${response.status}`)
      }

      const data = await response.json()
      console.log('Providers data:', data)
      
      if (data.success && data.data) {
        setProviders(data.data)
      } else {
        setError('No providers available. Please register a provider first.')
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err)
      setError('Failed to load providers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      // Validate form data
      if (!formData.providerId) {
        setError('Please select a provider')
        setSubmitting(false)
        return
      }

      if (!formData.startTime) {
        setError('Please select a date and time')
        setSubmitting(false)
        return
      }

      if (!formData.reason || formData.reason.length < 5) {
        setError('Please enter a reason (at least 5 characters)')
        setSubmitting(false)
        return
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to book appointment')
        setSubmitting(false)
        return
      }

      // Success - redirect to appointments list
      router.push('/appointments')
    } catch (err) {
      console.error('Booking error:', err)
      setError('An error occurred. Please try again.')
      setSubmitting(false)
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
                <Link href="/appointments" className="text-gray-700 hover:text-gray-900">
                  Appointments
                </Link>
                <Link href="/providers" className="text-gray-700 hover:text-gray-900">
                  Providers
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
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">Schedule a new appointment with a healthcare provider</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          {loading ? (
            <p className="text-gray-600">Loading providers...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Provider *
                </label>
                {providers.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm mb-2">
                      No providers available. Please register a provider account first.
                    </p>
                    <Link
                      href="/auth/register"
                      className="text-yellow-700 hover:text-yellow-900 font-medium text-sm"
                    >
                      Register a Provider →
                    </Link>
                  </div>
                ) : (
                  <select
                    value={formData.providerId}
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Choose a provider...</option>
                    {providers.map((provider) => (
                      <option key={provider._id} value={provider._id}>
                        Dr. {provider.firstName} {provider.lastName} - {provider.specialty}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 2 hours from now
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  minLength={5}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe the reason for your appointment..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.reason.length}/500 characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting || !formData.providerId || !formData.startTime || !formData.reason}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {submitting ? 'Booking...' : 'Book Appointment'}
                </button>
                <Link
                  href="/appointments"
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
