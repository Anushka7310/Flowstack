'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SelectChangeEvent } from '@mui/material'
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CheckCircle2 } from 'lucide-react'
import { ValidationProgressBar } from '@/components/ValidationProgressBar'

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'patient' | 'provider'>('patient')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    specialty: '',
    licenseNumber: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set())

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }
    const newValidated = new Set(validatedFields)

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'This field is required'
          newValidated.delete(name)
        } else if (value.length < 1) {
          newErrors[name] = 'Must be at least 1 character'
          newValidated.delete(name)
        } else {
          delete newErrors[name]
          newValidated.add(name)
        }
        break

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
          newValidated.delete(name)
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format'
          newValidated.delete(name)
        } else {
          delete newErrors.email
          newValidated.add(name)
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
          newValidated.delete(name)
        } else if (value.length < 8) {
          newErrors.password = 'Must be at least 8 characters'
          newValidated.delete(name)
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = 'Must contain uppercase letter'
          newValidated.delete(name)
        } else if (!/[a-z]/.test(value)) {
          newErrors.password = 'Must contain lowercase letter'
          newValidated.delete(name)
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = 'Must contain number'
          newValidated.delete(name)
        } else {
          delete newErrors.password
          newValidated.add(name)
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm password'
          newValidated.delete(name)
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match'
          newValidated.delete(name)
        } else {
          delete newErrors.confirmPassword
          newValidated.add(name)
        }
        break

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone is required'
          newValidated.delete(name)
        } else {
          const digitsOnly = value.replace(/\D/g, '')
          if (digitsOnly.length < 10) {
            newErrors.phone = 'Phone must be at least 10 digits'
            newValidated.delete(name)
          } else {
            delete newErrors.phone
            newValidated.add(name)
          }
        }
        break

      case 'dateOfBirth':
        if (userType === 'patient' && !value) {
          newErrors.dateOfBirth = 'Date of birth is required'
          newValidated.delete(name)
        } else if (userType === 'patient' && value) {
          const dob = new Date(value)
          const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
          if (age < 0 || age > 120) {
            newErrors.dateOfBirth = 'Invalid date of birth'
            newValidated.delete(name)
          } else {
            delete newErrors.dateOfBirth
            newValidated.add(name)
          }
        } else {
          delete newErrors.dateOfBirth
          if (value) newValidated.add(name)
        }
        break

      case 'specialty':
        if (userType === 'provider' && !value) {
          newErrors.specialty = 'Specialty is required'
          newValidated.delete(name)
        } else {
          delete newErrors.specialty
          if (value) newValidated.add(name)
        }
        break

      case 'licenseNumber':
        if (userType === 'provider' && !value.trim()) {
          newErrors.licenseNumber = 'License number is required'
          newValidated.delete(name)
        } else if (userType === 'provider' && value.length < 5) {
          newErrors.licenseNumber = 'License number must be at least 5 characters'
          newValidated.delete(name)
        } else {
          delete newErrors.licenseNumber
          if (value && userType === 'provider') newValidated.add(name)
        }
        break

      case 'address':
        if (userType === 'patient' && !value.trim()) {
          newErrors.address = 'Address is required'
          newValidated.delete(name)
        } else if (userType === 'patient' && value.length < 5) {
          newErrors.address = 'Address must be at least 5 characters'
          newValidated.delete(name)
        } else {
          delete newErrors.address
          if (value && userType === 'patient') newValidated.add(name)
        }
        break

      case 'emergencyContactName':
        if (userType === 'patient' && !value.trim()) {
          newErrors.emergencyContactName = 'Emergency contact name is required'
          newValidated.delete(name)
        } else {
          delete newErrors.emergencyContactName
          if (value && userType === 'patient') newValidated.add(name)
        }
        break

      case 'emergencyContactPhone':
        if (userType === 'patient' && !value.trim()) {
          newErrors.emergencyContactPhone = 'Emergency contact phone is required'
          newValidated.delete(name)
        } else if (userType === 'patient' && value) {
          const digitsOnly = value.replace(/\D/g, '')
          if (digitsOnly.length < 10) {
            newErrors.emergencyContactPhone = 'Phone must be at least 10 digits'
            newValidated.delete(name)
          } else {
            delete newErrors.emergencyContactPhone
            newValidated.add(name)
          }
        } else {
          delete newErrors.emergencyContactPhone
          if (value && userType === 'patient') newValidated.add(name)
        }
        break

      case 'emergencyContactRelationship':
        if (userType === 'patient' && !value.trim()) {
          newErrors.emergencyContactRelationship = 'Relationship is required'
          newValidated.delete(name)
        } else {
          delete newErrors.emergencyContactRelationship
          if (value && userType === 'patient') newValidated.add(name)
        }
        break
    }

    setErrors(newErrors)
    setValidatedFields(newValidated)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
    // Clear submit error when user edits a field
    if (errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.submit
        return newErrors
      })
    }
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target
    if (!name) return
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
    // Clear submit error when user edits a field
    if (errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.submit
        return newErrors
      })
    }
  }

  const handleUserTypeChange = (newType: 'patient' | 'provider') => {
    setUserType(newType)
    // Clear form data and errors when switching user type
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      specialty: '',
      licenseNumber: '',
      address: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
    })
    setErrors({})
    setValidatedFields(new Set())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all required fields based on user type
    const requiredFields = userType === 'patient'
      ? ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'dateOfBirth', 'address', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship']
      : ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'specialty', 'licenseNumber']

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      setErrors({ submit: `Please fill in all required fields: ${missingFields.join(', ')}` })
      return
    }

    if (Object.keys(errors).length > 0) {
      setErrors({ submit: 'Please fix all validation errors before submitting' })
      return
    }

    setLoading(true)

    try {
      const endpoint =
        userType === 'patient'
          ? '/api/auth/register/patient'
          : '/api/auth/register/provider'

      // Format data based on user type
      const submitData = userType === 'patient' 
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            emergencyContact: {
              name: formData.emergencyContactName,
              phone: formData.emergencyContactPhone,
              relationship: formData.emergencyContactRelationship,
            },
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            specialty: formData.specialty,
            licenseNumber: formData.licenseNumber,
            maxDailyAppointments: 8,
          }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Registration error:', data)
        const errorMessage = data?.error || data?.message || 'Registration failed'
        setErrors({ submit: errorMessage })
        return
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('role', data.data.role)
      localStorage.setItem('userId', data.data.userId)

      router.push('/dashboard')
    } catch (err) {
      console.error('Submit error:', err)
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const filledFields = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password,
    formData.confirmPassword,
    formData.phone,
    userType === 'patient' ? formData.dateOfBirth : formData.specialty,
    userType === 'patient' ? formData.address : null,
    userType === 'patient' ? formData.emergencyContactName : null,
    userType === 'patient' ? formData.emergencyContactPhone : null,
    userType === 'patient' ? formData.emergencyContactRelationship : null,
  ].filter(Boolean).length

  const totalFields = userType === 'patient' ? 11 : 7

  return (
    <Box
      suppressHydrationWarning
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E8F0F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(0, 102, 204, 0.05)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(0, 188, 212, 0.05)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: '1px solid rgba(0, 102, 204, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
                mb: 2,
                mx: 'auto',
              }}
            >
              <CheckCircle2 size={32} color="#FFFFFF" />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              Join HealthCare+ and start your journey
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 4 }}>
            <ValidationProgressBar filled={filledFields} total={totalFields} />
          </Box>

          {/* User Type Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={(_, newType) => {
                if (newType) handleUserTypeChange(newType)
              }}
              sx={{
                background: '#F5F7FA',
                borderRadius: 2,
                p: 0.5,
                '& .MuiToggleButton-root': {
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  border: 'none',
                  transition: 'all 0.3s ease',
                  color: '#5F6368',
                  '&.Mui-selected': {
                    background: '#FFFFFF',
                    color: '#0066CC',
                    boxShadow: '0 2px 8px rgba(0, 102, 204, 0.15)',
                  },
                },
              }}
            >
              <ToggleButton value="patient">👤 Patient</ToggleButton>
              <ToggleButton value="provider">👨‍⚕️ Provider</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {errors.submit && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: '1px solid #FFCDD2',
                background: '#FFEBEE',
              }}
            >
              {errors.submit}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* First Name */}
              <Box>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: validatedFields.has('firstName') && (
                      <InputAdornment position="end">
                        <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Last Name */}
              <Box>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: validatedFields.has('lastName') && (
                      <InputAdornment position="end">
                        <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Email */}
              <Box>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: validatedFields.has('email') && (
                      <InputAdornment position="end">
                        <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Phone */}
              <Box>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: validatedFields.has('phone') && (
                      <InputAdornment position="end">
                        <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Patient-specific fields */}
              {userType === 'patient' && (
                <>
                  <Box>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Calendar size={20} style={{ color: '#0066CC' }} />
                          </InputAdornment>
                        ),
                        endAdornment: validatedFields.has('dateOfBirth') && (
                          <InputAdornment position="end">
                            <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={!!errors.address}
                      helperText={errors.address}
                      multiline
                      rows={2}
                      InputProps={{
                        endAdornment: validatedFields.has('address') && (
                          <InputAdornment position="end">
                            <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                      Emergency Contact
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Emergency Contact Name"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        error={!!errors.emergencyContactName}
                        helperText={errors.emergencyContactName}
                        size="small"
                        InputProps={{
                          endAdornment: validatedFields.has('emergencyContactName') && (
                            <InputAdornment position="end">
                              <CheckCircle2 size={16} style={{ color: '#4CAF50' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Emergency Contact Phone"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                        error={!!errors.emergencyContactPhone}
                        helperText={errors.emergencyContactPhone}
                        size="small"
                        InputProps={{
                          endAdornment: validatedFields.has('emergencyContactPhone') && (
                            <InputAdornment position="end">
                              <CheckCircle2 size={16} style={{ color: '#4CAF50' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Relationship"
                        name="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={handleChange}
                        error={!!errors.emergencyContactRelationship}
                        helperText={errors.emergencyContactRelationship}
                        size="small"
                        InputProps={{
                          endAdornment: validatedFields.has('emergencyContactRelationship') && (
                            <InputAdornment position="end">
                              <CheckCircle2 size={16} style={{ color: '#4CAF50' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Box>
                </>
              )}

              {/* Provider-specific fields */}
              {userType === 'provider' && (
                <>
                  <Box>
                    <FormControl fullWidth error={!!errors.specialty}>
                      <InputLabel>Specialty</InputLabel>
                      <Select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleSelectChange}
                        label="Specialty"
                      >
                        <MenuItem value="general_practice">General Practice</MenuItem>
                        <MenuItem value="cardiology">Cardiology</MenuItem>
                        <MenuItem value="dermatology">Dermatology</MenuItem>
                        <MenuItem value="pediatrics">Pediatrics</MenuItem>
                        <MenuItem value="orthopedics">Orthopedics</MenuItem>
                        <MenuItem value="psychiatry">Psychiatry</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <TextField
                      fullWidth
                      label="License Number"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      error={!!errors.licenseNumber}
                      helperText={errors.licenseNumber}
                      InputProps={{
                        endAdornment: validatedFields.has('licenseNumber') && (
                          <InputAdornment position="end">
                            <CheckCircle2 size={20} style={{ color: '#4CAF50' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </>
              )}

              {/* Password */}
              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Confirm Password */}
              <Box>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} style={{ color: '#0066CC' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading || Object.keys(errors).length > 0}
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                    py: 1.8,
                    fontSize: '1rem',
                    fontWeight: 700,
                    mt: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #004B99 0%, #003366 100%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>
            </Stack>
          </form>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, fontWeight: 500 }}>
              Already have an account?
            </Typography>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#0066CC',
                  color: '#0066CC',
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 102, 204, 0.04)',
                    borderColor: '#0066CC',
                  },
                }}
              >
                Sign In
              </Button>
            </Link>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
