import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GPT-Task Manager App',
  description: 'Task Manager App using OpenAI API and speech to text',
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
