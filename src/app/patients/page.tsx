'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material'
import { Search, Users } from 'lucide-react'
import { Header } from '@/components/Header'

interface Patient {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      router.push('/auth/login')
      return
    }

    if (role !== 'provider') {
      router.push('/dashboard')
      return
    }

    fetchPatients(token)
  }, [router])

  const fetchPatients = async (token: string) => {
    try {
      const response = await fetch('/api/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch patients')
      }

      const data = await response.json()
      setPatients(data.data || [])
    } catch {
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName} ${patient.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!mounted) return null

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
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
            My Patients
          </Typography>
          <Typography variant="body1" color="textSecondary">
            View and manage your patient list
          </Typography>
        </Box>

        {error && (
          <Card sx={{ mb: 3, borderRadius: 2, background: '#FFEBEE', border: '1px solid #FFCDD2' }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search by name or email..."
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
        </Box>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
            <CardContent>
              <Users size={48} style={{ color: '#BDBDBD', margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No patients found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You haven&apos;t had any appointments yet
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredPatients.map((patient) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={patient._id}>
                <Card
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
                    {/* Name */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {patient.firstName} {patient.lastName}
                    </Typography>

                    {/* Email */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                        {patient.email}
                      </Typography>
                    </Box>

                    {/* Phone */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        Phone
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {patient.phone}
                      </Typography>
                    </Box>

                    {/* Date of Birth */}
                    <Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                        Date of Birth
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Typography>
                    </Box>

                    {/* Status Badge */}
                    <Box sx={{ mt: 3 }}>
                      <Chip
                        label="Active Patient"
                        size="small"
                        sx={{
                          background: '#E8F5E9',
                          color: '#2E7D32',
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
