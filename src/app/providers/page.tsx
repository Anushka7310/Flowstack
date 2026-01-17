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
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Rating,
} from '@mui/material'
import { Search, Stethoscope } from 'lucide-react'
import { Header } from '@/components/Header'

interface Provider {
  _id: string
  firstName: string
  lastName: string
  specialty: string
  isActive: boolean
}

export default function ProvidersPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)

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
    } catch {
      setError('Failed to load providers')
    } finally {
      setLoading(false)
    }
  }

  const filteredProviders = providers.filter((provider) =>
    `${provider.firstName} ${provider.lastName} ${provider.specialty}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const getSpecialtyColor = (specialty: string) => {
    const colors: Record<string, string> = {
      general_practice: '#2196F3',
      cardiology: '#F44336',
      dermatology: '#FF9800',
      pediatrics: '#4CAF50',
      orthopedics: '#9C27B0',
      psychiatry: '#00BCD4',
    }
    return colors[specialty] || '#0066CC'
  }

  const getSpecialtyLabel = (specialty: string) => {
    const labels: Record<string, string> = {
      general_practice: 'General Practice',
      cardiology: 'Cardiology',
      dermatology: 'Dermatology',
      pediatrics: 'Pediatrics',
      orthopedics: 'Orthopedics',
      psychiatry: 'Psychiatry',
    }
    return labels[specialty] || specialty
  }

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
            Healthcare Providers
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Browse and connect with qualified healthcare professionals
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
            placeholder="Search by name or specialty..."
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

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Card sx={{ borderRadius: 3, textAlign: 'center', py: 8 }}>
            <CardContent>
              <Stethoscope size={48} style={{ color: '#BDBDBD', margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                No providers found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search criteria
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredProviders.map((provider) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={provider._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          background: `${getSpecialtyColor(provider.specialty)}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Stethoscope size={32} color={getSpecialtyColor(provider.specialty)} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Dr. {provider.firstName} {provider.lastName}
                      </Typography>
                      <Chip
                        label={getSpecialtyLabel(provider.specialty)}
                        size="small"
                        sx={{
                          background: `${getSpecialtyColor(provider.specialty)}20`,
                          color: getSpecialtyColor(provider.specialty),
                          fontWeight: 600,
                          borderRadius: 1,
                        }}
                      />
                    </Box>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={Math.floor(Math.random() * 2) + 4} readOnly size="small" />
                      <Typography variant="body2" color="textSecondary">
                        ({Math.floor(Math.random() * 100) + 10})
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: provider.isActive ? '#4CAF50' : '#BDBDBD',
                          }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {provider.isActive ? 'Available' : 'Unavailable'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Button */}
                    <Link href="/appointments/new" style={{ textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        disabled={!provider.isActive}
                        sx={{
                          background: provider.isActive
                            ? 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)'
                            : '#BDBDBD',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        {provider.isActive ? 'Book Appointment' : 'Unavailable'}
                      </Button>
                    </Link>
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
