import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Parish Admin | St. Francis of Assisi',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
