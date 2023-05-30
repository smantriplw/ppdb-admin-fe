import React from 'react'
import { Navbar } from '@/components/navbar'
import './globals.css'

export const metadata = {
  title: 'PPDB Admin SMAN 3 PALU',
  description: 'SMANTI BEBAS KORUPSI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
