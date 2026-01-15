'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ValidationProgressBar from '@/components/ValidationProgressBar'

type UserType = 'patient' | 'provider'

interface ValidationErrors {
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  emergencyName?: string
  emergencyPhone?: string
  emergencyRelationship?: string
  specialty?: string
  licenseNumber?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>('patient')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  // Common fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  // Patient-specific fields
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelationship, setEmergencyRelationship] = useState('')

  // Provider-specific fields
  const [specialty, setSpecialty] = useState('general_practice')
  const [licenseNumber, setLicenseNumber] = useState('')

  // Validation functions
  const validateEmail = (value: string): string | undefined => {
    if (!value) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
    return undefined
  }

  const validatePassword = (value: string): string | undefined => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
    if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
    return undefined
  }

  const validatePhone = (value: string): string | undefined => {
    if (!value) return 'Phone is required'
    if (!/^\+?[1-9]\d{1,14}$/.test(value)) return 'Invalid phone number format'
    return undefined
  }

  const validateName = (value: string, fieldName: string): string | undefined => {
    if (!value) return `${fieldName} is required`
    if (value.length < 1) return `${fieldName} is required`
    if (value.length > 50) return `${fieldName} must be less than 50 characters`
    return undefined
  }

  const validateDateOfBirth = (value: string): string | undefined => {
    if (!value) return 'Date of birth is required'
    const dob = new Date(value)
    const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    if (age < 0 || age > 120) return 'Invalid date of birth'
    return undefined
  }

  const validateAddress = (value: string): string | undefined => {
    if (!value) return 'Address is required'
    if (value.length < 5) return 'Address must be at least 5 characters'
    return undefined
  }

  const validateLicenseNumber = (value: string): string | undefined => {
    if (!value) return 'License number is required'
    if (value.length < 5) return 'License number must be at least 5 characters'
    return undefined
  }

  // Handle field changes with validation
  const handleEmailChange = (value: string) => {
    setEmail(value)
    const error = validateEmail(value)
    setValidationErrors((prev) => ({
      ...prev,
      email: error,
    }))
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    const error = validatePassword(value)
    setValidationErrors((prev) => ({
      ...prev,
      password: error,
    }))
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value)
    const error = validatePhone(value)
    setValidationErrors((prev) => ({
      ...prev,
      phone: error,
    }))
  }

  const handleFirstNameChange = (value: string) => {
    setFirstName(value)
    const error = validateName(value, 'First name')
    setValidationErrors((prev) => ({
      ...prev,
      firstName: error,
    }))
  }

  const handleLastNameChange = (value: string) => {
    setLastName(value)
    const error = validateName(value, 'Last name')
    setValidationErrors((prev) => ({
      ...prev,
      lastName: error,
    }))
  }

  const handleDateOfBirthChange = (value: string) => {
    setDateOfBirth(value)
    const error = validateDateOfBirth(value)
    setValidationErrors((prev) => ({
      ...prev,
      dateOfBirth: error,
    }))
  }

  const handleAddressChange = (value: string) => {
    setAddress(value)
    const error = validateAddress(value)
    setValidationErrors((prev) => ({
      ...prev,
      address: error,
    }))
  }

  const handleLicenseNumberChange = (value: string) => {
    setLicenseNumber(value)
    const error = validateLicenseNumber(value)
    setValidationErrors((prev) => ({
      ...prev,
      licenseNumber: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = userType === 'patient' 
        ? '/api/auth/register/patient'
        : '/api/auth/register/provider'

      const body = userType === 'patient'
        ? {
            email,
            password,
            firstName,
            lastName,
            phone,
            dateOfBirth,
            address,
            emergencyContact: {
              name: emergencyName,
              phone: emergencyPhone,
              relationship: emergencyRelationship,
            },
          }
        : {
            email,
            password,
            firstName,
            lastName,
            phone,
            specialty,
            licenseNumber,
            maxDailyAppointments: 8,
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      // Store token
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('userId', data.data.userId)
      localStorage.setItem('role', userType)

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              HealthCare+
            </Link>
            <p className="text-gray-600 mt-2">Create your account</p>
          </div>

          {/* User Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 rounded-md font-medium transition-colors ${
                userType === 'patient'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register as Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('provider')}
              className={`flex-1 py-3 rounded-md font-medium transition-colors ${
                userType === 'provider'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register as Provider
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Progress Bar */}
            <ValidationProgressBar
              validFields={
                userType === 'patient'
                  ? [
                      firstName,
                      lastName,
                      email,
                      password,
                      phone,
                      dateOfBirth,
                      address,
                      emergencyName,
                      emergencyPhone,
                      emergencyRelationship,
                    ].filter((f) => f).length
                  : [firstName, lastName, email, password, phone, specialty, licenseNumber].filter(
                      (f) => f
                    ).length
              }
              totalFields={userType === 'patient' ? 10 : 7}
            />

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                    validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                minLength={8}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
              {!validationErrors.password && password && (
                <p className="text-green-500 text-xs mt-1">✓ Password is valid</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                required
                placeholder="+1234567890"
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => handleDateOfBirthChange(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      validationErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Emergency Contact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={emergencyPhone}
                          onChange={(e) => setEmergencyPhone(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={emergencyRelationship}
                          onChange={(e) => setEmergencyRelationship(e.target.value)}
                          required
                          placeholder="e.g., Spouse"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Provider-specific fields */}
            {userType === 'provider' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="general_practice">General Practice</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="psychiatry">Psychiatry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => handleLicenseNumberChange(e.target.value)}
                    required
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                      validationErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.licenseNumber && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.licenseNumber}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || Object.values(validationErrors).some((err) => err !== undefined)}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
