import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GPT-Task Manager App',
  description: 'AI powered task manager app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
