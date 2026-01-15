'use client'

import { Box, LinearProgress, Typography } from '@mui/material'

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

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Form Completion
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {filled} of {total} fields
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={getColor()}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        }}
      />
    </Box>
  )
}
