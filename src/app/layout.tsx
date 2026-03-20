import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'AGENT',
  description: 'AI-powered knowledge workspace and agent builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
