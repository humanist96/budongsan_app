'use client'

import { type ReactNode } from 'react'
import 'leaflet/dist/leaflet.css'

export function KakaoMapProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
