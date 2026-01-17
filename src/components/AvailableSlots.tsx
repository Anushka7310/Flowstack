'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material'
import { Calendar, Clock, CheckCircle2 } from 'lucide-react'

interface TimeSlot {
  time: string
  available: boolean
}

interface AvailableSlotsProps {
  providerId: string
  selectedDate: string
  duration: number
  onSlotSelect: (dateTime: string) => void
  selectedSlot: string | null
}

export function AvailableSlots({
  providerId,
  selectedDate,
  duration,
  onSlotSelect,
  selectedSlot,
}: AvailableSlotsProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!providerId || !selectedDate) {
      setSlots([])
      return
    }

    const fetchAvailableSlots = async () => {
      setLoading(true)
      setError('')
      setSlots([])

      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(
          `/api/providers/availability?providerId=${providerId}&date=${selectedDate}&duration=${duration}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Failed to fetch available slots')
          return
        }

        const data = await response.json()
        setSlots(data.data || [])
      } catch (err) {
        console.error('Error fetching slots:', err)
        setError('Failed to load available slots')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableSlots()
  }, [providerId, selectedDate, duration])

  if (!providerId || !selectedDate) {
    return null
  }

  const dateObj = new Date(selectedDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      const [hours, minutes] = slot.time.split(':')
      const dateTime = new Date(selectedDate)
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      onSlotSelect(dateTime.toISOString().slice(0, 16))
    }
  }

  const availableCount = slots.filter((s) => s.available).length

  return (
    <Box sx={{ mt: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Calendar size={24} style={{ color: '#0066CC' }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1F2937' }}>
            {formattedDate}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B7280' }}>
            {availableCount} slots available
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      ) : slots.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          No available slots for this date. Please select a different date.
        </Alert>
      ) : (
        <Card
          sx={{
            borderRadius: 2.5,
            border: '1px solid #E5E7EB',
            background: '#FFFFFF',
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {slots.map((slot, index) => {
                const isSelected = selectedSlot === slot.time
                return (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                    <Button
                      fullWidth
                      onClick={() => handleSlotClick(slot)}
                      disabled={!slot.available}
                      variant={isSelected ? 'contained' : 'outlined'}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textTransform: 'none',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        backgroundColor: isSelected ? '#0066CC' : 'transparent',
                        color: isSelected ? '#FFFFFF' : '#1F2937',
                        borderColor: isSelected ? '#0066CC' : '#D1D5DB',
                        opacity: slot.available ? 1 : 0.4,
                        cursor: slot.available ? 'pointer' : 'not-allowed',
                        '&:hover': slot.available
                          ? {
                              backgroundColor: isSelected ? '#004B99' : '#E3F2FD',
                              borderColor: '#0066CC',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0, 102, 204, 0.15)',
                            }
                          : {},
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <Clock size={18} />
                      {slot.time}
                      {isSelected && <CheckCircle2 size={18} />}
                    </Button>
                  </Grid>
                )
              })}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
