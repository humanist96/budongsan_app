'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { searchPlace, type VWorldSearchResult } from '@/lib/api/vworld-client'

export function MapSearch() {
  const map = useMap()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<VWorldSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleSearch = useCallback(async (value: string) => {
    if (value.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const data = await searchPlace(value.trim())
      setResults(data)
      setIsOpen(data.length > 0)
    } catch {
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => handleSearch(value), 300)
    },
    [handleSearch]
  )

  const handleSelect = useCallback(
    (result: VWorldSearchResult) => {
      map.flyTo([result.lat, result.lng], 16, { duration: 1.5 })
      setQuery(result.title)
      setIsOpen(false)
      setResults([])
    },
    [map]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && results.length > 0) {
        handleSelect(results[0])
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    },
    [results, handleSelect]
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Stop map events from propagating through the search UI
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const stop = (e: Event) => e.stopPropagation()
    el.addEventListener('mousedown', stop)
    el.addEventListener('dblclick', stop)
    el.addEventListener('wheel', stop)
    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('dblclick', stop)
      el.removeEventListener('wheel', stop)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[min(380px,calc(100%-80px))]"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="장소 검색 (예: 한남더힐, 래미안)"
          className="w-full px-4 py-2.5 pr-10 bg-card/95 backdrop-blur rounded-lg shadow-lg border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {isLoading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="mt-1 max-h-64 overflow-y-auto bg-card/95 backdrop-blur rounded-lg shadow-lg border divide-y divide-border">
          {results.map((result, idx) => (
            <li key={`${result.lat}-${result.lng}-${idx}`}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium truncate">{result.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {result.address}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
