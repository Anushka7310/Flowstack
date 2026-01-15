'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { ArrowLeft, Clock, Save } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/Header'

interface Availability {
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityPage() {
  const router = useRouter()
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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

    initializeAvailability()
  }, [router])

  const initializeAvailability = () => {
    const defaultAvailability: Availability[] = DAYS.map((_, index) => ({
      dayOfWeek: index,
      startTime: '09:00',
      endTime: '17:00',
      isActive: index >= 1 && index <= 5, // Monday to Friday
    }))
    setAvailability(defaultAvailability)
    setLoading(false)
  }

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability((prev) =>
      prev.map((item, idx) =>
        idx === dayIndex ? { ...item, [field]: value } : item
      )
    )
  }

  const handleToggle = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((item, idx) =>
        idx === dayIndex ? { ...item, isActive: !item.isActive } : item
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/providers/availability', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ availability }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to save availability')
        return
      }

      setSuccess('Availability updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
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

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            sx={{
              color: '#0066CC',
              textTransform: 'none',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Back to Dashboard
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
            Set Your Availability
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Configure your working hours and availability for appointments
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Availability Table */}
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#F5F5F5' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#0066CC' }}>Day</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0066CC' }}>Available</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0066CC' }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0066CC' }}>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availability.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        '&:hover': { background: '#FAFAFA' },
                        background: item.isActive ? '#F0F7FF' : '#FAFAFA',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>{DAYS[item.dayOfWeek]}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.isActive}
                          onChange={() => handleToggle(index)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#0066CC',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#0066CC',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                          disabled={!item.isActive}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                          disabled={!item.isActive}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 1,
                            },
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card sx={{ borderRadius: 3, mb: 4, background: '#E3F2FD', border: '2px solid #2196F3' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              💡 Tips
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                • Toggle the switch to enable/disable availability for each day
              </Typography>
              <Typography variant="body2">
                • Set your start and end times for each working day
              </Typography>
              <Typography variant="body2">
                • Patients can only book appointments during your available hours
              </Typography>
              <Typography variant="body2">
                • Save your changes to apply them immediately
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#0066CC',
                color: '#0066CC',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Cancel
            </Button>
          </Link>
          <Button
            variant="contained"
            startIcon={<Save size={20} />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
