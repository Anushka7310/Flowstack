'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Provider {
  _id: string
  firstName: string
  lastName: string
  specialty: string
  phone: string
}

export default function ProvidersPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      router.push('/auth/login')
      return
    }

    setUserRole(role)
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
        throw new Error('Failed to fetch providers')
      }

      const data = await response.json()
      setProviders(data.data || [])
    } catch (err) {
      setError('Failed to load providers')
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

  const specialtyColors: Record<string, string> = {
    general_practice: 'bg-blue-100 text-blue-800',
    cardiology: 'bg-red-100 text-red-800',
    dermatology: 'bg-purple-100 text-purple-800',
    pediatrics: 'bg-green-100 text-green-800',
    orthopedics: 'bg-yellow-100 text-yellow-800',
    psychiatry: 'bg-pink-100 text-pink-800',
  }

  const specialtyLabels: Record<string, string> = {
    general_practice: 'General Practice',
    cardiology: 'Cardiology',
    dermatology: 'Dermatology',
    pediatrics: 'Pediatrics',
    orthopedics: 'Orthopedics',
    psychiatry: 'Psychiatry',
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
                <Link href="/providers" className="text-blue-600 font-medium">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Providers</h1>
          <p className="text-gray-600 mt-2">Browse and book appointments with our healthcare providers</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Loading providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No providers available</p>
            </div>
          ) : (
            providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Provider Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Dr. {provider.firstName} {provider.lastName}
                  </h3>

                  {/* Specialty Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        specialtyColors[provider.specialty] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {specialtyLabels[provider.specialty] || provider.specialty}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p>
                      <strong>Phone:</strong> {provider.phone}
                    </p>
                  </div>

                  {/* Action Button */}
                  {userRole === 'patient' ? (
                    <Link
                      href="/appointments/new"
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Appointment
                    </Link>
                  ) : (
                    <Link
                      href={`/providers/${provider._id}`}
                      className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
