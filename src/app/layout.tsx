import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Header } from '@/components/layout/header'
import './globals.css'

export const metadata: Metadata = {
  title: '셀럽하우스맵 - 유명인 부동산 지도',
  description: '한국 유명인(연예인, 정치인, 운동선수)의 부동산 정보를 지도 위에서 확인하세요. 다주택자 추적, 실거래가 연동, 셀럽 이웃 관계도까지!',
  keywords: ['셀럽', '부동산', '지도', '연예인 집', '다주택자', '실거래가'],
  openGraph: {
    title: '셀럽하우스맵',
    description: '한국 유명인 부동산 정보를 지도 위에서 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
