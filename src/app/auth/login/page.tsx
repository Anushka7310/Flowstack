'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  LinearProgress,
  Fade,
} from '@mui/material'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const filledFields = [email.trim(), password.trim()].filter(Boolean).length
    setFormProgress((filledFields / 2) * 100)
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      localStorage.setItem('token', data.data.token)
      localStorage.setItem('role', data.data.role)
      localStorage.setItem('userId', data.data.userId)

      router.push('/dashboard')
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #E8F0F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'rgba(0, 102, 204, 0.05)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(0, 188, 212, 0.05)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="sm">
        <Fade in={mounted} timeout={600}>
          <Card
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              border: '1px solid rgba(0, 102, 204, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                HealthCare+
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                Sign in to your account
              </Typography>
            </Box>

            {/* Progress Indicator */}
            <Fade in={mounted} timeout={800}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#5F6368', fontSize: '0.75rem' }}>
                    Form Progress
                  </Typography>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: formProgress === 100 ? '#4CAF50' : formProgress >= 50 ? '#2196F3' : '#FF9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(formProgress)}%
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={formProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#E8EAED',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: formProgress === 100 ? '#4CAF50' : formProgress >= 50 ? '#2196F3' : '#FF9800',
                    },
                  }}
                />
              </Box>
            </Fade>

            {error && (
              <Fade in={!!error} timeout={300}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid #FFCDD2',
                    background: '#FFEBEE',
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Email Field */}
                <Fade in={mounted} timeout={1000}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} style={{ color: '#0066CC' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Fade>

                {/* Password Field */}
                <Fade in={mounted} timeout={1200}>
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} style={{ color: '#0066CC' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Fade>

                {/* Submit Button */}
                <Fade in={mounted} timeout={1400}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading || !email || !password}
                    sx={{
                      background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #004B99 0%, #003366 100%)',
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </Fade>
              </Stack>
            </form>

            <Divider sx={{ my: 4, opacity: 0.5 }} />

            {/* Register Link */}
            <Fade in={mounted} timeout={1600}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, fontWeight: 500 }}>
                  Don&apos;t have an account?
                </Typography>
                <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: '#0066CC',
                      color: '#0066CC',
                      fontWeight: 700,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 102, 204, 0.04)',
                        borderColor: '#0066CC',
                      },
                    }}
                  >
                    Create Account
                  </Button>
                </Link>
              </Box>
            </Fade>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}
