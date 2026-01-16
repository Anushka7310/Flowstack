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
  Fade,
  Slide,
} from '@mui/material'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CheckCircle2 } from 'lucide-react'
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
  const [validatedFields, setValidatedFields] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }
    const newValidated = new Set(validatedFields)

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = 'This field is required'
          newValidated.delete(name)
        } else if (value.length < 2) {
          newErrors[name] = 'Must be at least 2 characters'
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
        } else if (!/^\d{10,}$/.test(value.replace(/\D/g, ''))) {
          newErrors.phone = 'Invalid phone number'
          newValidated.delete(name)
        } else {
          delete newErrors.phone
          newValidated.add(name)
        }
        break

      case 'dateOfBirth':
        if (userType === 'patient' && !value) {
          newErrors.dateOfBirth = 'Date of birth is required'
          newValidated.delete(name)
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
    }

    setErrors(newErrors)
    setValidatedFields(newValidated)
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
        <Fade in={mounted} timeout={600}>
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
            <Slide direction="down" in={mounted} timeout={800}>
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
            </Slide>

            {/* Progress Bar with Animation */}
            <Fade in={mounted} timeout={1000}>
              <Box sx={{ mb: 4 }}>
                <ValidationProgressBar filled={filledFields} total={totalFields} />
              </Box>
            </Fade>

            {/* User Type Toggle */}
            <Fade in={mounted} timeout={1200}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <ToggleButtonGroup
                  value={userType}
                  exclusive
                  onChange={(e, newType) => {
                    if (newType) setUserType(newType)
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
            </Fade>

            {errors.submit && (
              <Fade in={!!errors.submit} timeout={300}>
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
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* First Name */}
                <Fade in={mounted} timeout={1400}>
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
                </Fade>

                {/* Last Name */}
                <Fade in={mounted} timeout={1500}>
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
                </Fade>

                {/* Email */}
                <Fade in={mounted} timeout={1600}>
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
                </Fade>

                {/* Phone */}
                <Fade in={mounted} timeout={1700}>
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
                </Fade>

                {/* Patient-specific fields */}
                {userType === 'patient' && (
                  <Fade in={userType === 'patient'} timeout={500}>
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
                  </Fade>
                )}

                {/* Provider-specific fields */}
                {userType === 'provider' && (
                  <Fade in={userType === 'provider'} timeout={500}>
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
                  </Fade>
                )}

                {/* Password */}
                <Fade in={mounted} timeout={1800}>
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
                </Fade>

                {/* Confirm Password */}
                <Fade in={mounted} timeout={1900}>
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
                </Fade>

                {/* Submit Button */}
                <Fade in={mounted} timeout={2000}>
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
                </Fade>
              </Stack>
            </form>

            <Divider sx={{ my: 4, opacity: 0.5 }} />

            {/* Login Link */}
            <Fade in={mounted} timeout={2100}>
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
            </Fade>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}
