'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material'
import { ArrowRight, Calendar, Users, Clock, Shield } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Navigation */}
      <Box sx={{ background: '#FFFFFF', borderBottom: '1px solid #E0E0E0', py: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HealthCare+
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#0066CC',
                    color: '#0066CC',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #0066CC 0%, #004B99 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
          color: '#FFFFFF',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Healthcare Made Simple
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Book appointments with healthcare providers, manage your health records, and receive quality care
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{
                  background: '#FFFFFF',
                  color: '#0066CC',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    background: '#F5F5F5',
                  },
                }}
              >
                Start Now
              </Button>
            </Link>
            <Link href="/auth/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Sign In
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose HealthCare+?
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience seamless healthcare management with our modern platform
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: Calendar,
              title: 'Easy Booking',
              description: 'Schedule appointments with healthcare providers in just a few clicks',
              color: '#0066CC',
            },
            {
              icon: Users,
              title: 'Expert Providers',
              description: 'Connect with qualified healthcare professionals across various specialties',
              color: '#FF9800',
            },
            {
              icon: Clock,
              title: 'Flexible Scheduling',
              description: 'Choose appointment times that work best for your schedule',
              color: '#4CAF50',
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your health information is protected with enterprise-grade security',
              color: '#00BCD4',
            },
          ].map((feature, index) => {
            const Icon = feature.icon
            return (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        background: `${feature.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      <Icon size={32} color={feature.color} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
          color: '#FFFFFF',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.95 }}>
            Join thousands of patients and providers using HealthCare+ for better healthcare management
          </Typography>
          <Link href="/auth/register" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: '#FFFFFF',
                color: '#0066CC',
                textTransform: 'none',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  background: '#F5F5F5',
                },
              }}
            >
              Create Your Account
            </Button>
          </Link>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ background: '#FFFFFF', borderTop: '1px solid #E0E0E0', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              © 2026 HealthCare+. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography variant="body2" sx={{ color: '#0066CC', cursor: 'pointer', fontWeight: 600 }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" sx={{ color: '#0066CC', cursor: 'pointer', fontWeight: 600 }}>
                Terms of Service
              </Typography>
              <Typography variant="body2" sx={{ color: '#0066CC', cursor: 'pointer', fontWeight: 600 }}>
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
