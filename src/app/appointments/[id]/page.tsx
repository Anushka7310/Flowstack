'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  Chip,
  TextField,
  Rating,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Calendar, Clock, User, Phone, Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { Header } from '@/components/Header'

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
  const [mounted, setMounted] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [patientFeedback, setPatientFeedback] = useState('')
  const [providerNotes, setProviderNotes] = useState('')
  const [prescription, setPrescription] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogAction, setDialogAction] = useState<'confirm' | 'reject' | 'complete' | null>(null)

  useEffect(() => {
    setMounted(true)
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
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch appointment')
      }

      const data = await response.json()
      if (data.success && data.data) {
        setAppointment(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointment')
    } finally {
      setLoading(false)
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
      setOpenDialog(false)
    } catch {
      setError('An error occurred. Please try again.')
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
      setOpenDialog(false)
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setUpdatingStatus(false)
    }
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
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmittingRating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2196F3'
      case 'confirmed':
        return '#4CAF50'
      case 'completed':
        return '#9C27B0'
      case 'cancelled':
        return '#F44336'
      default:
        return '#757575'
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

  if (!appointment) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F44336' }}>
                {error || 'Appointment not found'}
              </Typography>
              <Link href="/appointments" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Back to Appointments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

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

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Main Card */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Appointment Details
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {userRole === 'patient'
                    ? `Dr. ${appointment.providerId?.firstName} ${appointment.providerId?.lastName}`
                    : `${appointment.patientSnapshot?.firstName} ${appointment.patientSnapshot?.lastName}`}
                </Typography>
              </Box>
              <Chip
                label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                sx={{
                  background: getStatusColor(appointment.status),
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Date & Time */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📅 Date & Time
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Calendar size={24} color="#0066CC" />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(appointment.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Clock size={24} color="#FF9800" />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Time
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(appointment.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Provider/Patient Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                👤 {userRole === 'patient' ? 'Provider Information' : 'Patient Information'}
              </Typography>
              <Grid container spacing={2}>
                {userRole === 'patient' ? (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <User size={24} color="#0066CC" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Dr. {appointment.providerId?.firstName} {appointment.providerId?.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="textSecondary">
                        Specialty
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {appointment.providerId?.specialty}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <User size={24} color="#0066CC" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {appointment.patientSnapshot?.firstName} {appointment.patientSnapshot?.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Mail size={20} color="#0066CC" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {appointment.patientSnapshot?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Phone size={20} color="#0066CC" />
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Phone
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {appointment.patientSnapshot?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Reason */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📝 Reason for Visit
              </Typography>
              <Typography variant="body1">{appointment.reason}</Typography>
            </Box>

            {/* Notes */}
            {appointment.notes && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    📋 Notes
                  </Typography>
                  <Card sx={{ background: '#F5F5F5', borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="body2">{appointment.notes}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              </>
            )}

            {/* Prescription */}
            {appointment.prescription && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    💊 Prescription
                  </Typography>
                  <Card sx={{ background: '#E3F2FD', borderRadius: 2, border: '2px solid #2196F3' }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {appointment.prescription}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </>
            )}

            {/* Rating */}
            {appointment.rating && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    ⭐ Patient Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={appointment.rating} readOnly size="large" />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {appointment.rating} out of 5 stars
                    </Typography>
                  </Box>
                  {appointment.patientFeedback && (
                    <Card sx={{ background: '#F5F5F5', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="body2">{appointment.patientFeedback}</Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {userRole === 'patient' && appointment.status === 'completed' && !appointment.rating && (
          <Card sx={{ borderRadius: 3, mb: 3, background: '#E3F2FD', border: '2px solid #2196F3' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                ⭐ Rate Your Experience
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Rating (1-5 stars)
                  </Typography>
                  <Rating
                    value={selectedRating}
                    onChange={(_e, value) => setSelectedRating(value)}
                    size="large"
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Feedback (Optional)"
                  value={patientFeedback}
                  onChange={(e) => setPatientFeedback(e.target.value)}
                  maxRows={4}
                  placeholder="Share your feedback about the appointment..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  disabled={submittingRating || !selectedRating}
                  onClick={handleSubmitRating}
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {submittingRating ? <CircularProgress size={24} color="inherit" /> : 'Submit Rating'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {userRole === 'provider' && appointment.status === 'scheduled' && (
          <Card sx={{ borderRadius: 3, mb: 3, background: '#FFF3E0', border: '2px solid #FF9800' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                ⚡ Appointment Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircle size={20} />}
                  onClick={() => {
                    setDialogAction('confirm')
                    setOpenDialog(true)
                  }}
                  sx={{
                    background: '#4CAF50',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Confirm Appointment
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<XCircle size={20} />}
                  onClick={() => {
                    setDialogAction('reject')
                    setOpenDialog(true)
                  }}
                  sx={{
                    background: '#F44336',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Reject Appointment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {userRole === 'provider' && appointment.status === 'confirmed' && (
          <Card sx={{ borderRadius: 3, mb: 3, background: '#F3E5F5', border: '2px solid #9C27B0' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                ✅ Complete Appointment
              </Typography>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={providerNotes}
                  onChange={(e) => setProviderNotes(e.target.value)}
                  placeholder="Add notes about the appointment..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Prescription (Optional)"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Add prescription details if needed..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  disabled={updatingStatus}
                  onClick={() => {
                    setDialogAction('complete')
                    setOpenDialog(true)
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {updatingStatus ? <CircularProgress size={24} color="inherit" /> : 'Mark as Completed'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {dialogAction === 'confirm' && 'Confirm Appointment?'}
            {dialogAction === 'reject' && 'Reject Appointment?'}
            {dialogAction === 'complete' && 'Complete Appointment?'}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary">
              {dialogAction === 'confirm' && 'Are you sure you want to confirm this appointment?'}
              {dialogAction === 'reject' && 'Are you sure you want to reject this appointment?'}
              {dialogAction === 'complete' && 'Are you sure you want to mark this appointment as completed?'}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (dialogAction === 'confirm') {
                  handleUpdateStatus('confirmed')
                } else if (dialogAction === 'reject') {
                  handleUpdateStatus('cancelled')
                } else if (dialogAction === 'complete') {
                  handleCompleteAppointment()
                }
              }}
              variant="contained"
              sx={{
                background:
                  dialogAction === 'reject'
                    ? '#F44336'
                    : 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {dialogAction === 'confirm' && 'Confirm'}
              {dialogAction === 'reject' && 'Reject'}
              {dialogAction === 'complete' && 'Complete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
