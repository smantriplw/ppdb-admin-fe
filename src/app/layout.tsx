import { Navbar } from '@/components/navbar'
import './globals.css'
import { SessionContextWrap } from '@/components/contexts/sessionContextWrap';

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
        <SessionContextWrap>
          {children}
        </SessionContextWrap>
      </body>
    </html>
  )
}
