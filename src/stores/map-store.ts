import { create } from 'zustand'
import type { CelebrityCategory } from '@/types'

interface MapBounds {
  sw: { lat: number; lng: number }
  ne: { lat: number; lng: number }
}

interface MapState {
  center: { lat: number; lng: number }
  level: number
  bounds: MapBounds | null
  selectedMarkerId: string | null

  setCenter: (lat: number, lng: number) => void
  setLevel: (level: number) => void
  setBounds: (bounds: MapBounds) => void
  setSelectedMarker: (id: string | null) => void
}

export const useMapStore = create<MapState>((set) => ({
  center: { lat: 37.5665, lng: 126.978 },
  level: 12,
  bounds: null,
  selectedMarkerId: null,

  setCenter: (lat, lng) => set({ center: { lat, lng } }),
  setLevel: (level) => set({ level }),
  setBounds: (bounds) => set({ bounds }),
  setSelectedMarker: (id) => set({ selectedMarkerId: id }),
}))

interface FilterState {
  categories: CelebrityCategory[]
  multiOwnerOnly: boolean
  searchQuery: string
  minPropertyCount: number

  toggleCategory: (category: CelebrityCategory) => void
  setMultiOwnerOnly: (value: boolean) => void
  setSearchQuery: (query: string) => void
  setMinPropertyCount: (count: number) => void
  resetFilters: () => void
}

const defaultFilters = {
  categories: ['entertainer', 'politician', 'athlete', 'expert'] as CelebrityCategory[],
  multiOwnerOnly: false,
  searchQuery: '',
  minPropertyCount: 0,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,

  toggleCategory: (category) =>
    set((state) => {
      const exists = state.categories.includes(category)
      return {
        categories: exists
          ? state.categories.filter((c) => c !== category)
          : [...state.categories, category],
      }
    }),

  setMultiOwnerOnly: (value) => set({ multiOwnerOnly: value }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMinPropertyCount: (count) => set({ minPropertyCount: count }),
  resetFilters: () => set(defaultFilters),
}))
