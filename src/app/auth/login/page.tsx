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

  useEffect(() => {
    setMounted(true)
  }, [])

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
    } catch (err) {
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
        background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
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
            <Typography variant="body2" color="textSecondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Email Field */}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Password Field */}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #004B99 0%, #003366 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Register Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Don&apos;t have an account?
            </Typography>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#0066CC',
                  color: '#0066CC',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 102, 204, 0.05)',
                    borderColor: '#0066CC',
                  },
                }}
              >
                Create Account
              </Button>
            </Link>
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
