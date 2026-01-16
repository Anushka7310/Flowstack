'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
  TextField,
  MenuItem,
  Alert,
  Grid,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react'
import { Header } from '@/components/Header'

interface Provider {
  _id: string
  firstName: string
  lastName: string
  specialty: string
}

export default function BookAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    providerId: '',
    startTime: '',
    duration: '30',
    reason: '',
  })

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetchProviders(token)
  }, [router])

  const fetchProviders = async (token: string) => {
    try {
      const response = await fetch('/api/providers', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch providers')
      }

      const data = await response.json()
      setProviders(data.data || [])
    } catch (err) {
      setError('Failed to load providers')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData((prev) => ({ ...prev, [name]: value }))
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

      // Validate all required fields
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

      if (!formData.reason || formData.reason.trim().length < 5) {
        setError('Please provide a reason for the appointment (at least 5 characters)')
        setSubmitting(false)
        return
      }

      // Convert datetime-local to ISO string
      const startDateTime = new Date(formData.startTime)
      if (isNaN(startDateTime.getTime())) {
        setError('Invalid date/time format')
        setSubmitting(false)
        return
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          providerId: formData.providerId,
          startTime: startDateTime.toISOString(),
          duration: parseInt(formData.duration),
          reason: formData.reason.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Booking error:', data)
        setError(data.error || 'Failed to book appointment')
        return
      }

      router.push('/appointments')
    } catch (err) {
      console.error('Submit error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!mounted) return null

  const steps = ['Select Provider', 'Choose Date & Time', 'Add Details', 'Review & Book']

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Back Button */}
        <Link href="/appointments" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            sx={{
              color: '#0066CC',
              textTransform: 'none',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Back to Appointments
          </Button>
        </Link>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Book an Appointment
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Schedule a consultation with a healthcare provider
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Stepper */}
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={step} sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Form */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Step 1: Select Provider */}
                {step === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      👨‍⚕️ Select a Provider
                    </Typography>
                    <TextField
                      fullWidth
                      select
                      label="Healthcare Provider"
                      name="providerId"
                      value={formData.providerId}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={20} style={{ color: '#0066CC' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      {providers.map((provider) => (
                        <MenuItem key={provider._id} value={provider._id}>
                          Dr. {provider.firstName} {provider.lastName} - {provider.specialty}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}

                {/* Step 2: Choose Date & Time */}
                {step === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      📅 Choose Date & Time
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Date"
                          name="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={handleChange}
                          required
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
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          select
                          label="Duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Clock size={20} style={{ color: '#0066CC' }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        >
                          <MenuItem value="15">15 minutes</MenuItem>
                          <MenuItem value="30">30 minutes</MenuItem>
                          <MenuItem value="45">45 minutes</MenuItem>
                          <MenuItem value="60">1 hour</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 3: Add Details */}
                {step === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      📝 Add Details
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Reason for Visit"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                      placeholder="Describe your symptoms or reason for the appointment..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FileText size={20} style={{ color: '#0066CC' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Box>
                )}

                {/* Step 4: Review */}
                {step === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                      ✅ Review Your Appointment
                    </Typography>
                    <Stack spacing={2}>
                      <Card sx={{ background: '#F5F5F5', borderRadius: 2 }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" color="textSecondary">
                                Provider
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {providers.find((p) => p._id === formData.providerId)
                                  ? `Dr. ${providers.find((p) => p._id === formData.providerId)?.firstName} ${providers.find((p) => p._id === formData.providerId)?.lastName}`
                                  : 'Not selected'}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography variant="body2" color="textSecondary">
                                Date & Time
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formData.startTime
                                  ? new Date(formData.startTime).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : 'Not selected'}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Typography variant="body2" color="textSecondary">
                                Duration
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formData.duration} minutes
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" color="textSecondary">
                                Reason
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formData.reason || 'Not provided'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={step === 0}
                    onClick={() => {
                      setError('')
                      setStep(step - 1)
                    }}
                    sx={{
                      borderColor: '#0066CC',
                      color: '#0066CC',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Previous
                  </Button>

                  {step < 3 ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setError('')
                        setStep(step + 1)
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={submitting}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                      }}
                    >
                      {submitting ? <CircularProgress size={24} color="inherit" /> : 'Book Appointment'}
                    </Button>
                  )}
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
