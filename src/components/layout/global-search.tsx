'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, Building2 } from 'lucide-react'
import { globalSearch, type SearchResult } from '@/lib/utils/search'

interface GlobalSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const router = useRouter()

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onOpenChange])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Debounced search
  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    setSelectedIndex(0)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      setResults(globalSearch(value, 10))
    }, 300)
  }, [])

  const navigateToResult = useCallback((result: SearchResult) => {
    onOpenChange(false)
    router.push(result.href)
  }, [onOpenChange, router])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      navigateToResult(results[selectedIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    }
  }, [results, selectedIndex, navigateToResult, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="bg-background border rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="셀럽 이름, 매물명, 주소 검색... (Cmd+K)"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {result.type === 'celebrity' ? (
                        <Users className="h-4 w-4 text-pink-500" />
                      ) : (
                        <Building2 className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {result.type === 'celebrity' ? '셀럽' : '매물'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.length > 0 && results.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          )}

          {query.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              셀럽 이름이나 매물 주소를 입력하세요
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
