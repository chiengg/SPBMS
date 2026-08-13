import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '党建管理系统',
  description: '党建管理系统 - Party Building Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}