import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Real-Time Exam Practice System",
  description: "A timed exam platform where students can practice answering questions in real-time",
  generator: 'Next.js',
  authors: [{ name: "Manel Saad", url:"https://github.com/manelsd" }]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
