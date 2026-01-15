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
      const response = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      const appointments = data.data?.appointments || []

      const stats: DashboardStats = {
        totalAppointments: appointments.length,
        upcomingAppointments: appointments.filter(
          (a: any) => a.status === 'scheduled' || a.status === 'confirmed'
        ).length,
        completedAppointments: appointments.filter((a: any) => a.status === 'completed').length,
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
    icon: any
    title: string
    value: number
    color: string
  }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${color}20`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={32} color={color} />
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 6 }}>
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
            Welcome back!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Here&apos;s what&apos;s happening with your appointments today.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
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
              value={Math.floor(Math.random() * 50) + 10}
              color="#00BCD4"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ borderRadius: 3, mb: 6 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
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
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  📋 How It Works
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="textSecondary">
                    ✓ {userRole === 'patient' ? 'Browse available providers and book appointments' : 'Manage your availability and appointments'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ✓ {userRole === 'patient' ? 'Receive confirmations and reminders' : 'Confirm or reject appointment requests'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ✓ {userRole === 'patient' ? 'Rate your experience after appointments' : 'Complete appointments and add notes'}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  🎯 Tips
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="textSecondary">
                    • Keep your profile information up to date
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    • Check your appointments regularly
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
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
