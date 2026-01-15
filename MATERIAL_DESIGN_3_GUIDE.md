# Material Design 3 Implementation Guide

## Overview

This guide explains how Material Design 3 has been implemented in the HealthCare+ application and how to work with it.

## What is Material Design 3?

Material Design 3 (Material You) is Google's latest design system that emphasizes:
- **Personalization**: Dynamic color system
- **Expressiveness**: Bold typography and colors
- **Accessibility**: WCAG AA compliance
- **Consistency**: Unified design language
- **Flexibility**: Adaptable to any brand

## Installation

### Dependencies Added
```json
{
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@emotion/react": "^11.11.0",
  "@emotion/styled": "^11.11.0",
  "@mui/lab": "^5.0.0-alpha.61"
}
```

### Install Command
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/lab --legacy-peer-deps
```

## Theme Configuration

### Location
`src/lib/theme/theme.ts`

### Key Components
```typescript
const theme = createTheme({
  palette: { /* Colors */ },
  typography: { /* Fonts */ },
  shape: { /* Border radius */ },
  components: { /* Component overrides */ }
})
```

### Color Palette
```typescript
palette: {
  primary: { main: '#0066CC' },
  secondary: { main: '#00BCD4' },
  success: { main: '#4CAF50' },
  error: { main: '#F44336' },
  warning: { main: '#FF9800' },
  info: { main: '#2196F3' }
}
```

## Theme Provider

### Location
`src/components/ThemeProvider.tsx`

### Usage
```typescript
import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
```

### What It Does
- Wraps app with Material-UI theme
- Applies CssBaseline for consistent styling
- Provides theme context to all components

## Using Material-UI Components

### Import
```typescript
import { Button, Card, TextField } from '@mui/material'
```

### Common Components

#### Button
```typescript
<Button variant="contained">Contained</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
```

#### Card
```typescript
<Card>
  <CardContent>
    <Typography>Content</Typography>
  </CardContent>
</Card>
```

#### TextField
```typescript
<TextField
  label="Email"
  type="email"
  variant="outlined"
  fullWidth
/>
```

#### Box (Layout)
```typescript
<Box sx={{ display: 'flex', gap: 2 }}>
  {/* Content */}
</Box>
```

#### Grid (Responsive Layout)
```typescript
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
</Grid>
```

#### Stack (Vertical/Horizontal Layout)
```typescript
<Stack spacing={2} direction="row">
  {/* Content */}
</Stack>
```

## Styling with sx Prop

### Basic Styling
```typescript
<Box sx={{ color: 'primary.main', p: 2 }}>
  Content
</Box>
```

### Responsive Styling
```typescript
<Box sx={{
  fontSize: { xs: '1rem', md: '2rem' },
  p: { xs: 1, md: 3 }
}}>
  Content
</Box>
```

### Hover Effects
```typescript
<Box sx={{
  '&:hover': {
    backgroundColor: 'primary.light',
    transform: 'translateY(-4px)'
  }
}}>
  Content
</Box>
```

## Color Usage

### Using Theme Colors
```typescript
// Primary color
sx={{ color: 'primary.main' }}

// Secondary color
sx={{ backgroundColor: 'secondary.light' }}

// Status colors
sx={{ color: 'success.main' }}
sx={{ color: 'error.main' }}
sx={{ color: 'warning.main' }}
sx={{ color: 'info.main' }}

// Text colors
sx={{ color: 'text.primary' }}
sx={{ color: 'text.secondary' }}
```

## Typography

### Using Typography Component
```typescript
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="body1">Body text</Typography>
<Typography variant="body2">Secondary text</Typography>
<Typography variant="button">Button text</Typography>
```

### Typography Variants
- h1, h2, h3, h4, h5, h6
- body1, body2
- button
- caption
- overline

## Spacing System

### 8px Grid
```typescript
// Using theme spacing
sx={{ p: 1 }}    // 8px
sx={{ p: 2 }}    // 16px
sx={{ p: 3 }}    // 24px
sx={{ p: 4 }}    // 32px

// Or direct values
sx={{ padding: '8px' }}
sx={{ margin: '16px' }}
```

## Responsive Design

### Breakpoints
```typescript
// xs: 0px (mobile)
// sm: 600px (tablet)
// md: 960px (small laptop)
// lg: 1280px (desktop)
// xl: 1920px (large screen)

sx={{
  display: { xs: 'none', md: 'block' },
  fontSize: { xs: '1rem', md: '2rem' },
  p: { xs: 1, sm: 2, md: 3 }
}}
```

## Icons

### Material-UI Icons
```typescript
import { Home, Settings, Logout } from '@mui/icons-material'

<Button startIcon={<Home />}>Home</Button>
```

### Lucide React Icons
```typescript
import { Home, Settings, LogOut } from 'lucide-react'

<Button startIcon={<Home size={20} />}>Home</Button>
```

## Forms

### Text Input
```typescript
<TextField
  label="Email"
  type="email"
  variant="outlined"
  fullWidth
  error={!!error}
  helperText={error}
/>
```

### Select
```typescript
<TextField
  select
  label="Choose"
  value={value}
  onChange={handleChange}
>
  <MenuItem value="option1">Option 1</MenuItem>
  <MenuItem value="option2">Option 2</MenuItem>
</TextField>
```

### Checkbox
```typescript
<FormControlLabel
  control={<Checkbox />}
  label="Accept terms"
/>
```

### Radio
```typescript
<FormControlLabel
  control={<Radio />}
  label="Option 1"
/>
```

## Dialogs & Modals

### Dialog
```typescript
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>Content</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Confirm</Button>
  </DialogActions>
</Dialog>
```

## Alerts & Notifications

### Alert
```typescript
<Alert severity="success">Success message</Alert>
<Alert severity="error">Error message</Alert>
<Alert severity="warning">Warning message</Alert>
<Alert severity="info">Info message</Alert>
```

## Tables

### Basic Table
```typescript
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Header 1</TableCell>
        <TableCell>Header 2</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Data 1</TableCell>
        <TableCell>Data 2</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
```

## Loading States

### Spinner
```typescript
<CircularProgress />
<CircularProgress size={24} />
```

### Skeleton
```typescript
import { Skeleton } from '@mui/material'

<Skeleton variant="text" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={118} />
```

## Customizing Components

### Override Button Style
```typescript
// In theme.ts
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 24,
      }
    }
  }
}
```

### Override TextField Style
```typescript
// In theme.ts
components: {
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        }
      }
    }
  }
}
```

## Best Practices

### 1. Use Theme Colors
```typescript
// ✅ Good
sx={{ color: 'primary.main' }}

// ❌ Bad
sx={{ color: '#0066CC' }}
```

### 2. Use Theme Spacing
```typescript
// ✅ Good
sx={{ p: 2, m: 1 }}

// ❌ Bad
sx={{ padding: '16px', margin: '8px' }}
```

### 3. Use Typography Variants
```typescript
// ✅ Good
<Typography variant="h1">Title</Typography>

// ❌ Bad
<Typography sx={{ fontSize: '2.5rem' }}>Title</Typography>
```

### 4. Use Responsive Design
```typescript
// ✅ Good
sx={{ fontSize: { xs: '1rem', md: '2rem' } }}

// ❌ Bad
sx={{ fontSize: '2rem' }}
```

### 5. Use Proper Components
```typescript
// ✅ Good
<Button variant="contained">Click</Button>

// ❌ Bad
<div onClick={...} style={{...}}>Click</div>
```

## Common Patterns

### Card with Hover Effect
```typescript
<Card sx={{
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
  }
}}>
  <CardContent>Content</CardContent>
</Card>
```

### Gradient Background
```typescript
<Box sx={{
  background: 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
  color: 'white',
  p: 4
}}>
  Content
</Box>
```

### Responsive Grid
```typescript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
</Grid>
```

### Form with Validation
```typescript
<TextField
  label="Email"
  error={!!errors.email}
  helperText={errors.email}
  onChange={handleChange}
/>
```

## Troubleshooting

### Issue: Styles not applying
**Solution**: Ensure ThemeProvider wraps the app

### Issue: Colors not matching
**Solution**: Check theme.ts for correct color values

### Issue: Responsive layout broken
**Solution**: Use Grid with proper breakpoints

### Issue: Icons not showing
**Solution**: Import from @mui/icons-material or lucide-react

### Issue: Performance issues
**Solution**: Use React.memo for heavy components

## Resources

- [Material-UI Documentation](https://mui.com/)
- [Material Design 3](https://m3.material.io/)
- [Material-UI API](https://mui.com/api/)
- [Lucide React Icons](https://lucide.dev/)

## Summary

Material Design 3 provides:
- ✅ Professional appearance
- ✅ Consistent design system
- ✅ Responsive components
- ✅ Accessibility compliance
- ✅ Easy customization
- ✅ Great developer experience

Use this guide to build beautiful, accessible, and responsive UIs!

---

**Last Updated**: January 16, 2026  
**Version**: 1.0  
**Status**: Complete
