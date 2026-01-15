# UI Visual Guide - Material Design 3

## Color Palette

### Primary Colors
- **Primary Blue**: #0066CC
  - Light: #4D94FF
  - Dark: #004B99
  - Used for: Buttons, links, headers

- **Secondary Cyan**: #00BCD4
  - Light: #4DD0E1
  - Dark: #0097A7
  - Used for: Accents, secondary actions

### Status Colors
- **Success Green**: #4CAF50
  - Used for: Completed, confirmed, active
  
- **Error Red**: #F44336
  - Used for: Cancelled, errors, warnings
  
- **Warning Orange**: #FF9800
  - Used for: Pending, upcoming, caution
  
- **Info Blue**: #2196F3
  - Used for: Information, scheduled

### Neutral Colors
- **Background**: #FAFAFA
- **Surface**: #FFFFFF
- **Text Primary**: #212121
- **Text Secondary**: #757575
- **Divider**: #E0E0E0

## Typography Scale

```
H1: 2.5rem (40px) - Page titles
H2: 2rem (32px) - Section titles
H3: 1.75rem (28px) - Subsection titles
H4: 1.5rem (24px) - Card titles
H5: 1.25rem (20px) - Subheadings
H6: 1rem (16px) - Small titles
Body1: 1rem (16px) - Main text
Body2: 0.875rem (14px) - Secondary text
Button: 0.875rem (14px) - Button text
Caption: 0.75rem (12px) - Helper text
```

## Component Styles

### Buttons
```
Contained: Solid background with shadow
Outlined: Border only, no background
Text: No border or background
```

### Cards
- Border radius: 12px
- Shadow: Elevation 2-8
- Hover: Elevation increases, slight lift

### Text Fields
- Border radius: 8px
- Outline style
- Icon support
- Error states

### Chips
- Border radius: 8px
- Status indicators
- Removable option

### Dialogs
- Border radius: 12px
- Centered on screen
- Backdrop blur effect

## Layout System

### Spacing (8px grid)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Breakpoints
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 960px (small laptop)
- lg: 1280px (desktop)
- xl: 1920px (large screen)

## Page Layouts

### Home Page
```
┌─────────────────────────────────┐
│  Navigation Bar                 │
├─────────────────────────────────┤
│                                 │
│  Hero Section (Gradient)        │
│  - Title                        │
│  - Subtitle                     │
│  - CTA Buttons                  │
│                                 │
├─────────────────────────────────┤
│  Features Section               │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Card 1│ │Card 2│ │Card 3│   │
│  └──────┘ └──────┘ └──────┘   │
│  ┌──────┐                      │
│  │Card 4│                      │
│  └──────┘                      │
├─────────────────────────────────┤
│  CTA Section (Gradient)         │
│  - Title                        │
│  - Button                       │
├─────────────────────────────────┤
│  Footer                         │
└─────────────────────────────────┘
```

### Dashboard Page
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Welcome Section                │
│  - Title                        │
│  - Subtitle                     │
├─────────────────────────────────┤
│  Stats Grid (4 columns)         │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Stat 1│ │Stat 2│ │Stat 3│   │
│  └──────┘ └──────┘ └──────┘   │
│  ┌──────┐                      │
│  │Stat 4│                      │
│  └──────┘                      │
├─────────────────────────────────┤
│  Quick Actions Card             │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Btn 1 │ │Btn 2 │ │Btn 3 │   │
│  └──────┘ └──────┘ └──────┘   │
├─────────────────────────────────┤
│  Info Cards (2 columns)         │
│  ┌──────────────┐ ┌──────────┐ │
│  │Info Card 1   │ │Info Card2│ │
│  └──────────────┘ └──────────┘ │
└─────────────────────────────────┘
```

### Appointments List Page
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Title & Book Button            │
├─────────────────────────────────┤
│  Search & Filter Row            │
│  ┌──────────────┐ ┌──────────┐ │
│  │Search        │ │Filter    │ │
│  └──────────────┘ └──────────┘ │
├─────────────────────────────────┤
│  Appointment Cards (Stack)      │
│  ┌─────────────────────────────┐│
│  │ Provider | Date | Status    ││
│  │ Reason | View Details       ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Provider | Date | Status    ││
│  │ Reason | View Details       ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

### Appointment Details Page
```
┌─────────────────────────────────┐
│  Header                         │
├─────────────────────────────────┤
│  Back Button                    │
├─────────────────────────────────┤
│  Main Card                      │
│  ┌─────────────────────────────┐│
│  │ Title | Status Badge        ││
│  ├─────────────────────────────┤│
│  │ Date & Time Section         ││
│  ├─────────────────────────────┤│
│  │ Provider/Patient Info       ││
│  ├─────────────────────────────┤│
│  │ Reason for Visit            ││
│  ├─────────────────────────────┤│
│  │ Notes (if any)              ││
│  ├─────────────────────────────┤│
│  │ Prescription (if any)       ││
│  ├─────────────────────────────┤│
│  │ Rating (if completed)       ││
│  └─────────────────────────────┘│
├─────────────────────────────────┤
│  Action Cards (Provider/Patient)│
│  ┌─────────────────────────────┐│
│  │ Confirm | Reject | Complete ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

## Icon Usage

### Navigation Icons
- Dashboard: 📊
- Appointments: 📅
- Providers: 👨‍⚕️
- Patients: 👥
- Settings: ⚙️

### Action Icons
- Search: 🔍
- Filter: 🔽
- Add: ➕
- Edit: ✏️
- Delete: 🗑️
- Back: ⬅️
- Forward: ➡️

### Status Icons
- Success: ✅
- Error: ❌
- Warning: ⚠️
- Info: ℹ️
- Clock: ⏰

### Feature Icons
- Calendar: 📅
- Clock: 🕐
- User: 👤
- Phone: 📞
- Email: 📧
- Location: 📍
- Document: 📄
- Star: ⭐

## Interaction Patterns

### Hover Effects
- Cards: Lift up 8px, shadow increases
- Buttons: Brightness increases, shadow increases
- Links: Color changes, underline appears
- Icons: Scale increases slightly

### Click Effects
- Buttons: Ripple effect
- Cards: Slight scale down then back
- Dialogs: Fade in with scale

### Loading States
- Buttons: Show spinner
- Cards: Skeleton loading
- Pages: Full page spinner

### Error States
- Text Fields: Red border, error message
- Cards: Red border, error icon
- Alerts: Red background with icon

## Responsive Behavior

### Mobile (xs)
- Single column layout
- Full-width cards
- Hamburger menu
- Larger touch targets

### Tablet (sm)
- Two column layout
- Adjusted spacing
- Sidebar menu
- Optimized cards

### Desktop (md+)
- Multi-column layout
- Full navigation
- Expanded content
- Hover effects

## Animation Timings

- **Fast**: 150ms (hover effects)
- **Normal**: 300ms (transitions)
- **Slow**: 500ms (page transitions)

## Accessibility Features

- ✅ High contrast ratios (WCAG AA)
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Icon + text combinations
- ✅ Semantic HTML
- ✅ Screen reader support

## Best Practices

1. **Consistency**: Use the same colors and styles throughout
2. **Hierarchy**: Use typography scale for visual hierarchy
3. **Spacing**: Use 8px grid for consistent spacing
4. **Feedback**: Provide visual feedback for all interactions
5. **Accessibility**: Always consider accessibility
6. **Performance**: Optimize animations and transitions
7. **Mobile-first**: Design for mobile first, then enhance

---

This visual guide ensures consistent design across the entire application.
