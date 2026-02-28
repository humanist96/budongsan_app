'use client'

import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const previewMarkers = [
  { name: '한남더힐', top: '35%', left: '42%' },
  { name: '나인원한남', top: '30%', left: '48%' },
  { name: '청담', top: '55%', left: '65%' },
  { name: '반포', top: '62%', left: '38%' },
  { name: '성수', top: '28%', left: '60%' },
] as const

export function MapPreview() {
  return (
    <section className="px-4 py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="h-7 w-7 text-pink-500" />
          <h2 className="text-3xl md:text-4xl font-black text-center">
            지도에서 탐험하기
          </h2>
        </div>
        <p className="text-center text-muted-foreground mb-10 md:mb-14">
          셀럽들의 부동산을 지도 위에서 직접 확인하세요
        </p>

        <div className="relative rounded-xl overflow-hidden shadow-2xl h-[350px] md:h-[400px] bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 dark:from-blue-950 dark:via-green-950 dark:to-blue-950">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
              <path d="M100,200 Q200,100 300,180 T500,160 T700,200" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
              <path d="M150,250 Q250,180 350,230 T550,210 T750,260" stroke="currentColor" strokeWidth="1.5" className="text-blue-300" />
              <path d="M0,300 Q200,250 400,280 T800,300" stroke="currentColor" strokeWidth="1" className="text-green-400" />
            </svg>
          </div>

          {previewMarkers.map((marker) => (
            <div
              key={marker.name}
              className="absolute flex flex-col items-center animate-bounce"
              style={{
                top: marker.top,
                left: marker.left,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '3s',
              }}
            >
              <MapPin className="h-6 w-6 text-pink-500 drop-shadow-md" />
              <span className="text-[10px] font-bold bg-white/90 dark:bg-gray-900/90 px-1.5 py-0.5 rounded mt-0.5 shadow-sm">
                {marker.name}
              </span>
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <Link href="/map">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-xl gap-2"
              >
                전체 지도 보기 <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
