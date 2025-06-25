import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '多功能工具箱',
  description: '图片排序工具和待办事项管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}