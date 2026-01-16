'use client'

import { Box, LinearProgress, Typography, Fade } from '@mui/material'

interface ValidationProgressBarProps {
  filled: number
  total: number
}

export function ValidationProgressBar({ filled, total }: ValidationProgressBarProps) {
  const percentage = (filled / total) * 100

  const getColor = () => {
    if (percentage === 100) return 'success'
    if (percentage >= 75) return 'info'
    if (percentage >= 50) return 'warning'
    return 'error'
  }

  const getColorValue = () => {
    if (percentage === 100) return '#4CAF50'
    if (percentage >= 75) return '#2196F3'
    if (percentage >= 50) return '#FF9800'
    return '#F44336'
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: '#1A1A1A',
              fontSize: '0.875rem',
              letterSpacing: '0.5px',
            }}
          >
            Form Completion
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: getColorValue(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {Math.round(percentage)}%
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#5F6368',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {filled} of {total}
            </Typography>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={getColor()}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#E8EAED',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: `linear-gradient(90deg, ${getColorValue()} 0%, ${getColorValue()}dd 100%)`,
            },
          }}
        />
      </Box>
    </Fade>
  )
}
