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
  Chip,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
} from '@mui/material'
import { Calendar, Clock, User, Search } from 'lucide-react'
import { Header } from '@/components/Header'

interface Appointment {
  _id: string
  startTime: string
  endTime: string
  status: string
  reason: string
  providerId?: {
    firstName: string
    lastName: string
    specialty: string
  }
  patientSnapshot?: {
    firstName: string
    lastName: string
    phone: string
  }
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      router.push('/auth/login')
      return
    }

    setUserRole(role)
    fetchAppointments(token)
  }, [router])

  const fetchAppointments = async (token: string) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch appointments')
      }

      const data = await response.json()
      setAppointments(data.data?.appointments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments')
    } finally {
      setLoading(false)
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

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      userRole === 'patient'
        ? `${apt.providerId?.firstName} ${apt.providerId?.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : `${apt.patientSnapshot?.firstName} ${apt.patientSnapshot?.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus

    return matchesSearch && matchesStatus
  })

  if (!mounted) return null

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
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
              My Appointments
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and track your appointments
            </Typography>
          </Box>
          {userRole === 'patient' && (
            <Link href="/appointments/new" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                }}
              >
                + Book Appointment
              </Button>
            </Link>
          )}
        </Box>

        {error && (
          <Card sx={{ mb: 3, borderRadius: 2, background: '#FFEBEE', border: '1px solid #FFCDD2' }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} style={{ color: '#0066CC' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#FFFFFF',
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
            <CardContent>
              <Calendar size={48} style={{ color: '#BDBDBD', margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No appointments found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {userRole === 'patient'
                  ? 'Start by booking your first appointment'
                  : 'No appointments scheduled yet'}
              </Typography>
              {userRole === 'patient' && (
                <Link href="/appointments/new" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Book Your First Appointment
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {filteredAppointments.map((appointment) => (
              <Card
                key={appointment._id}
                sx={{
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: '#E3F2FD',
                          }}
                        >
                          <User size={24} color="#0066CC" />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {userRole === 'patient'
                              ? `Dr. ${appointment.providerId?.firstName} ${appointment.providerId?.lastName}`
                              : `${appointment.patientSnapshot?.firstName} ${appointment.patientSnapshot?.lastName}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {userRole === 'patient'
                              ? appointment.providerId?.specialty
                              : appointment.patientSnapshot?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={18} color="#FF9800" />
                          <Typography variant="body2">
                            {new Date(appointment.startTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Clock size={18} color="#FF9800" />
                          <Typography variant="body2">
                            {new Date(appointment.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Reason
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {appointment.reason}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={getStatusLabel(appointment.status)}
                        sx={{
                          background: getStatusColor(appointment.status),
                          color: '#FFFFFF',
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      />
                      <Link href={`/appointments/${appointment._id}`} style={{ textDecoration: 'none' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: '#0066CC',
                            color: '#0066CC',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          View Details
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  )
}
