'use client'

import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, Avatar } from '@mui/material'
import { LogOut, Menu as MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'

interface HeaderProps {
  title?: string
  showLogout?: boolean
}

export function Header({ title = 'HealthCare+', showLogout = true }: HeaderProps) {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setUserRole(localStorage.getItem('role'))
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    router.push('/')
  }

  if (!mounted) return null

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </Typography>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                Dashboard
              </Button>
            </Link>
            <Link href="/appointments" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                Appointments
              </Button>
            </Link>
            {userRole === 'provider' && (
              <Link href="/settings/availability" style={{ textDecoration: 'none' }}>
                <Button color="inherit" sx={{ fontWeight: 500, fontSize: '0.95rem' }}>
                  Availability
                </Button>
              </Link>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Mobile Menu */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            color="inherit"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon size={24} />
          </IconButton>

          {/* User Menu */}
          {showLogout && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  p: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #4D94FF 0%, #00BCD4 100%)',
                    fontWeight: 700,
                  }}
                >
                  {userRole?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled sx={{ fontWeight: 500 }}>
                  {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User'}
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#F44336' }}>
                  <LogOut size={18} style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <MenuItem onClick={handleMobileMenuClose} component={Link} href="/dashboard">
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose} component={Link} href="/appointments">
          Appointments
        </MenuItem>
        {userRole === 'provider' && (
          <MenuItem onClick={handleMobileMenuClose} component={Link} href="/settings/availability">
            Availability
          </MenuItem>
        )}
      </Menu>
    </AppBar>
  )
}
