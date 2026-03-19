import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knowledge Workspace',
  description: 'Smart knowledge management and AI agent builder',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-zinc-950">{children}</body>
    </html>
  )
}
