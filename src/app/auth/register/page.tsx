'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react'
import { ValidationProgressBar } from '@/components/ValidationProgressBar'

export default function RegisterPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
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
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'This field is required'
        } else if (value.length < 2) {
          newErrors[name] = 'Must be at least 2 characters'
        } else {
          delete newErrors[name]
        }
        break

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format'
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
        } else if (value.length < 8) {
          newErrors.password = 'Must be at least 8 characters'
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = 'Must contain uppercase letter'
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = 'Must contain number'
        } else {
          delete newErrors.password
        }
        break

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm password'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else {
          delete newErrors.confirmPassword
        }
        break

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone is required'
        } else if (!/^\d{10,}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Invalid phone number'
        } else {
          delete newErrors.phone
        }
        break

      case 'dateOfBirth':
        if (userType === 'patient' && !value) {
          newErrors.dateOfBirth = 'Date of birth is required'
        } else {
          delete newErrors.dateOfBirth
        }
        break

      case 'specialty':
        if (userType === 'provider' && !value) {
          newErrors.specialty = 'Specialty is required'
        } else {
          delete newErrors.specialty
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.keys(errors).length > 0) {
      return
    }

    setLoading(true)

    try {
      const endpoint =
        userType === 'patient'
          ? '/api/auth/register/patient'
          : '/api/auth/register/provider'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || 'Registration failed' })
        return
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('role', data.data.role)
      localStorage.setItem('userId', data.data.userId)

      router.push('/dashboard')
    } catch (err) {
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
  ].filter(Boolean).length

  const totalFields = 7

  if (!mounted) return null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            <Typography variant="body2" color="textSecondary">
              Join HealthCare+ today
            </Typography>
          </Box>

          {/* Progress Bar */}
          <ValidationProgressBar filled={filledFields} total={totalFields} />

          {/* User Type Toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 3 }}>
            <ToggleButtonGroup
              value={userType}
              exclusive
              onChange={(e, newType) => {
                if (newType) setUserType(newType)
              }}
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                },
              }}
            >
              <ToggleButton value="patient">Patient</ToggleButton>
              <ToggleButton value="provider">Provider</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {/* First Name */}
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
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Last Name */}
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
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Email */}
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
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Phone */}
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
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Patient-specific fields */}
              {userType === 'patient' && (
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
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              )}

              {/* Provider-specific fields */}
              {userType === 'provider' && (
                <FormControl fullWidth error={!!errors.specialty}>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleSelectChange}
                    label="Specialty"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="general_practice">General Practice</MenuItem>
                    <MenuItem value="cardiology">Cardiology</MenuItem>
                    <MenuItem value="dermatology">Dermatology</MenuItem>
                    <MenuItem value="pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="orthopedics">Orthopedics</MenuItem>
                    <MenuItem value="psychiatry">Psychiatry</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Password */}
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Confirm Password */}
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
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                sx={{
                  background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  mt: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004B99 0%, #003366 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Already have an account?
            </Typography>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#0066CC',
                  color: '#0066CC',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 102, 204, 0.05)',
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
