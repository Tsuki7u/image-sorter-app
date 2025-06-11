import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '图片排序工具',
  description: '拖拽排序图片URL列表',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="font-sans">
        <div className="container mx-auto px-4 py-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {children}
        </div>
      </body>
    </html>
  )
}