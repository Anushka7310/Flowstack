'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ role: string; userId: string } | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const userId = localStorage.getItem('userId')

    if (!token || !role || !userId) {
      router.push('/auth/login')
      return
    }

    setUser({ role, userId })
    fetchAppointments(token)
  }, [router])

  const fetchAppointments = async (token: string) => {
    try {
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAppointments(data.data.appointments || [])
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                HealthCare+
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 capitalize">
                {user.role} Dashboard
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'patient' 
              ? 'Manage your appointments and health records'
              : 'Manage your schedule and patient appointments'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user.role === 'patient' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Book Appointment
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Schedule a new appointment with a provider
                </p>
                <Link
                  href="/appointments/new"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Book Now
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  My Appointments
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View and manage your appointments
                </p>
                <Link
                  href="/appointments"
                  className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  View All
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Find Providers
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Browse available healthcare providers
                </p>
                <Link
                  href="/providers"
                  className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Browse
                </Link>
              </div>
            </>
          )}

          {user.role === 'provider' && (
            <>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Today's Schedule
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View your appointments for today
                </p>
                <Link
                  href="/appointments"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Schedule
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Availability
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage your availability schedule
                </p>
                <Link
                  href="/settings/availability"
                  className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Manage
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Patients
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View your patient list
                </p>
                <Link
                  href="/patients"
                  className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  View All
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Appointments
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading appointments...</p>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No appointments yet</p>
                {user.role === 'patient' && (
                  <Link
                    href="/appointments/new"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Book Your First Appointment
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment: any) => (
                  <div
                    key={appointment._id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.role === 'patient' 
                            ? `Dr. ${appointment.providerId?.firstName} ${appointment.providerId?.lastName}`
                            : `${appointment.patientSnapshot?.firstName} ${appointment.patientSnapshot?.lastName}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(appointment.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.reason}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
