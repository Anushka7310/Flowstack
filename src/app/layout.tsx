import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Healthcare Appointment System',
  description: 'Manage medical appointments efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
