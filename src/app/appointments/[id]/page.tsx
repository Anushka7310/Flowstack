'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Appointment {
  _id: string
  startTime: string
  endTime: string
  status: string
  reason: string
  notes?: string
  prescription?: string
  rating?: number
  patientFeedback?: string
  patientSnapshot?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  providerId?: {
    firstName: string
    lastName: string
    specialty: string
  }
}

export default function AppointmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = params.id as string

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [patientFeedback, setPatientFeedback] = useState('')
  const [providerNotes, setProviderNotes] = useState('')
  const [prescription, setPrescription] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      router.push('/auth/login')
      return
    }

    setUserRole(role)
    if (appointmentId) {
      fetchAppointment(token, appointmentId)
    }
  }, [router, appointmentId])

  const fetchAppointment = async (token: string, id: string) => {
    try {
      console.log('Fetching appointment:', id)
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        throw new Error(errorData.error || 'Failed to fetch appointment')
      }

      const data = await response.json()
      console.log('Appointment data:', data)
      
      if (data.success && data.data) {
        setAppointment(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load appointment')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    setCancelling(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to cancel appointment')
        return
      }

      router.push('/appointments')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setCancelling(false)
    }
  }

  const handleRating = (rating: number) => {
    setSelectedRating(rating)
  }

  const handleSubmitRating = async () => {
    if (!selectedRating) return

    setSubmittingRating(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: selectedRating,
          patientFeedback,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to submit rating')
        return
      }

      const data = await response.json()
      setAppointment(data.data)
      setSelectedRating(null)
      setPatientFeedback('')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setSubmittingRating(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    setUpdatingStatus(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update appointment')
        return
      }

      const data = await response.json()
      setAppointment(data.data)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleCompleteAppointment = async () => {
    setUpdatingStatus(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'completed',
          notes: providerNotes,
          prescription: prescription || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to complete appointment')
        return
      }

      const data = await response.json()
      setAppointment(data.data)
      setProviderNotes('')
      setPrescription('')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                HealthCare+
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600">Loading appointment...</p>
        </main>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                HealthCare+
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 font-medium mb-4">{error || 'Appointment not found'}</p>
            <Link href="/appointments" className="text-blue-600 hover:text-blue-700">
              ← Back to Appointments
            </Link>
          </div>
        </main>
      </div>
    )
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
        <Link href="/appointments" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Appointments
        </Link>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Appointment Details</h1>
              <p className="text-gray-600 mt-2">
                {userRole === 'patient'
                  ? `Dr. ${appointment.providerId?.firstName} ${appointment.providerId?.lastName}`
                  : `${appointment.patientSnapshot?.firstName} ${appointment.patientSnapshot?.lastName}`}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                appointment.status === 'scheduled'
                  ? 'bg-blue-100 text-blue-800'
                  : appointment.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : appointment.status === 'completed'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="space-y-6">
            {/* Date and Time */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(appointment.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Time:</strong>{' '}
                  {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(appointment.endTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Provider/Patient Info */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {userRole === 'patient' ? 'Provider Information' : 'Patient Information'}
              </h2>
              <div className="space-y-2 text-gray-600">
                {userRole === 'patient' ? (
                  <>
                    <p>
                      <strong>Name:</strong> Dr. {appointment.providerId?.firstName}{' '}
                      {appointment.providerId?.lastName}
                    </p>
                    <p>
                      <strong>Specialty:</strong> {appointment.providerId?.specialty}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Name:</strong> {appointment.patientSnapshot?.firstName}{' '}
                      {appointment.patientSnapshot?.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {appointment.patientSnapshot?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {appointment.patientSnapshot?.phone}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Reason */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reason for Visit</h2>
              <p className="text-gray-600">{appointment.reason}</p>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-600">{appointment.notes}</p>
              </div>
            )}

            {/* Prescription */}
            {appointment.prescription && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescription</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{appointment.prescription}</p>
                </div>
              </div>
            )}

            {/* Rating */}
            {appointment.rating && (
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Rating</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{'⭐'.repeat(appointment.rating)}</span>
                  <span className="text-gray-600">{appointment.rating} out of 5 stars</span>
                </div>
                {appointment.patientFeedback && (
                  <p className="text-gray-600 mt-3">{appointment.patientFeedback}</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-6 flex flex-col gap-4">
              {userRole === 'patient' && appointment.status === 'scheduled' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              )}

              {userRole === 'patient' && appointment.status === 'completed' && !appointment.rating && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Rate Your Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating (1-5 stars)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            className={`text-2xl hover:scale-110 transition-transform ${
                              selectedRating === star ? 'scale-110' : ''
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback (Optional)
                      </label>
                      <textarea
                        value={patientFeedback}
                        onChange={(e) => setPatientFeedback(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Share your feedback about the appointment..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSubmitRating}
                      disabled={submittingRating || !selectedRating}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {submittingRating ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  </div>
                </div>
              )}

              {userRole === 'patient' && appointment.rating && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-medium">Your Rating: {'⭐'.repeat(appointment.rating)}</p>
                  {appointment.patientFeedback && (
                    <p className="text-green-800 text-sm mt-2">{appointment.patientFeedback}</p>
                  )}
                </div>
              )}

              {userRole === 'provider' && appointment.status === 'scheduled' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-yellow-900">Appointment Actions</h3>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('confirmed')}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {updatingStatus ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('cancelled')}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {updatingStatus ? 'Rejecting...' : 'Reject Appointment'}
                    </button>
                  </div>
                </div>
              )}

              {userRole === 'provider' && appointment.status === 'confirmed' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-purple-900">Complete Appointment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={providerNotes}
                        onChange={(e) => setProviderNotes(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Add notes about the appointment..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prescription (Optional)
                      </label>
                      <textarea
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        maxLength={2000}
                        rows={3}
                        placeholder="Add prescription details if needed..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCompleteAppointment}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {updatingStatus ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  </div>
                </div>
              )}

              <Link
                href="/appointments"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
              >
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
