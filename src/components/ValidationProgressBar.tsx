'use client'

import { Box, Typography, Fade } from '@mui/material'

interface ValidationProgressBarProps {
  filled: number
  total: number
}

export function ValidationProgressBar({ filled, total }: ValidationProgressBarProps) {
  const percentage = (filled / total) * 100

  const getColor = () => {
    if (percentage === 100) return '#10B981'
    if (percentage >= 75) return '#0066CC'
    if (percentage >= 50) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <Fade in timeout={800}>
      <Box suppressHydrationWarning sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#1F2937',
              fontSize: '0.875rem',
              letterSpacing: '0.3px',
            }}
          >
            Form Progress
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6B7280',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {filled} of {total}
          </Typography>
        </Box>

        {/* Material Design 3 Linear Progress with Wave Effect */}
        <Box
          sx={{
            position: 'relative',
            height: 6,
            borderRadius: 3,
            backgroundColor: '#E5E7EB',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Main progress bar with gradient */}
          <Box
            sx={{
              position: 'absolute',
              height: '100%',
              width: `${percentage}%`,
              borderRadius: 3,
              background: `linear-gradient(90deg, ${getColor()} 0%, ${getColor()}E6 100%)`,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 12px ${getColor()}40`,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 3,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite',
              },
            }}
          />

          {/* Animated wave effect at the end */}
          {percentage > 0 && percentage < 100 && (
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                width: '20px',
                left: `${percentage}%`,
                transform: 'translateX(-50%)',
                background: `radial-gradient(circle, ${getColor()} 0%, transparent 70%)`,
                opacity: 0.6,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          )}

          {/* Completion indicator */}
          {percentage === 100 && (
            <Box
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: getColor(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              ✓
            </Box>
          )}

          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
            @keyframes scaleIn {
              0% { transform: translateY(-50%) scale(0); }
              100% { transform: translateY(-50%) scale(1); }
            }
          `}</style>
        </Box>

        {/* Status text */}
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#9CA3AF',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {percentage === 100
              ? '✓ All fields completed'
              : `${Math.round(percentage)}% complete`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
            }}
          >
            {Array.from({ length: total }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: i < filled ? getColor() : '#D1D5DB',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}
