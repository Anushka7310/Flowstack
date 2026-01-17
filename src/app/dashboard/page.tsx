'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Stack,
} from '@mui/material'
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/Header'

interface DashboardStats {
  totalAppointments: number
  upcomingAppointments: number
  completedAppointments: number
  patientCount?: number
  providerCount?: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
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
    fetchStats(token)
  }, [router])

  const fetchStats = async (token: string) => {
    try {
      // Fetch appointments
      const appointmentsResponse = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments')
      }

      const appointmentsData = await appointmentsResponse.json()
      const appointments = appointmentsData.data?.appointments || []

      // Fetch patient count
      const patientsResponse = await fetch('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })

      let patientCount = 0
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json()
        // patientsData.data is an array of patients
        patientCount = Array.isArray(patientsData.data) ? patientsData.data.length : 0
      }

      // Fetch provider count
      const providersResponse = await fetch('/api/providers', {
        headers: { Authorization: `Bearer ${token}` },
      })

      let providerCount = 0
      if (providersResponse.ok) {
        const providersData = await providersResponse.json()
        // providersData.data is an array of providers
        providerCount = Array.isArray(providersData.data) ? providersData.data.length : 0
      }

      const stats: DashboardStats = {
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter(
          (a: Record<string, unknown>) => a.status === 'scheduled' || a.status === 'confirmed'
        ).length,
        completedAppointments: appointments.filter((a: Record<string, unknown>) => a.status === 'completed').length,
        patientCount,
        providerCount,
      }

      setStats(stats)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: React.ComponentType<{ size: number; color: string }>
    title: string
    value: number
    color: string
  }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}12 0%, ${color}04 100%)`,
        border: `1.5px solid ${color}20`,
        borderRadius: 2.5,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 16px 40px ${color}25`,
          borderColor: `${color}40`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 48,
              height: 48,
            }}
          >
            <Icon size={28} color={color} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color,
                fontSize: '2rem',
              }}
            >
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#F5F7FA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome back!
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>
            Here&apos;s what&apos;s happening with your appointments today.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={Calendar}
              title="Total Appointments"
              value={stats?.totalAppointments || 0}
              color="#0066CC"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={Clock}
              title="Upcoming"
              value={stats?.upcomingAppointments || 0}
              color="#FF9800"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={CheckCircle}
              title="Completed"
              value={stats?.completedAppointments || 0}
              color="#4CAF50"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              icon={Users}
              title={userRole === 'provider' ? 'Patients' : 'Providers'}
              value={userRole === 'provider' ? (stats?.patientCount || 0) : (stats?.providerCount || 0)}
              color="#00BCD4"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card
          sx={{
            borderRadius: 2.5,
            border: '1px solid #E8EAED',
            mb: 8,
            background: '#FFFFFF',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3.5,
                color: '#1A1A1A',
              }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={2.5}>
              {userRole === 'patient' && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Link href="/appointments/new" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                          py: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Book Appointment
                      </Button>
                    </Link>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Link href="/appointments" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: '#0066CC',
                          color: '#0066CC',
                          py: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        View Appointments
                      </Button>
                    </Link>
                  </Grid>
                </>
              )}
              {userRole === 'provider' && (
                <>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Link href="/appointments" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                          py: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        View Appointments
                      </Button>
                    </Link>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Link href="/settings/availability" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderColor: '#0066CC',
                          color: '#0066CC',
                          py: 2,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Set Availability
                      </Button>
                    </Link>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 2.5,
                border: '1px solid #E8EAED',
                height: '100%',
                background: 'linear-gradient(135deg, #E3F2FD 0%, #F5F7FA 100%)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    color: '#1A1A1A',
                  }}
                >
                  📋 How It Works
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    ✓ {userRole === 'patient' ? 'Browse available providers and book appointments' : 'Manage your availability and appointments'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    ✓ {userRole === 'patient' ? 'Receive confirmations and reminders' : 'Confirm or reject appointment requests'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    ✓ {userRole === 'patient' ? 'Rate your experience after appointments' : 'Complete appointments and add notes'}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 2.5,
                border: '1px solid #E8EAED',
                height: '100%',
                background: 'linear-gradient(135deg, #F0F4FF 0%, #F5F7FA 100%)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2.5,
                    color: '#1A1A1A',
                  }}
                >
                  🎯 Tips
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    • Keep your profile information up to date
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    • Check your appointments regularly
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                    • Provide feedback to help us improve
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
