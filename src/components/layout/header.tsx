'use client'

import Link from 'next/link'
import {
  MapPin, Users, Trophy, Menu, X, Sun, Moon, Send, Search,
  Swords, Brain, Zap, Dice5, Clock, Network, Scale,
  Gamepad2, ChevronDown,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTheme } from './theme-provider'
import { GlobalSearch } from './global-search'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

interface NavGroup {
  label: string
  icon: React.ElementType
  children: NavItem[]
}

type NavEntry = NavItem | NavGroup

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry
}

const navEntries: NavEntry[] = [
  { href: '/map', label: '지도', icon: MapPin },
  { href: '/celebrity', label: '셀럽', icon: Users },
  { href: '/rankings', label: '랭킹', icon: Trophy },
  { href: '/graph', label: '관계망', icon: Network },
  { href: '/politics', label: '정치', icon: Scale },
  { href: '/mbti', label: 'MBTI', icon: Brain },
  {
    label: '놀이터',
    icon: Gamepad2,
    children: [
      { href: '/debate', label: '토론', icon: Swords },
      { href: '/battle', label: '배틀', icon: Zap },
      { href: '/marble', label: '브루마블', icon: Dice5 },
      { href: '/timeline', label: '연대기', icon: Clock },
    ],
  },
  { href: '/submit', label: '제보', icon: Send },
]

function DesktopDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen((prev) => !prev)}
      >
        <group.icon className="h-4 w-4" />
        {group.label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[140px] rounded-lg border bg-popover p-1 shadow-lg">
          {group.children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-pink-500" />
          <span className="font-bold text-lg hidden sm:inline-block">
            셀럽하우스맵
          </span>
          <span className="font-bold text-lg sm:hidden">셀럽맵</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navEntries.map((entry) =>
            isGroup(entry) ? (
              <DesktopDropdown key={entry.label} group={entry} />
            ) : (
              <Link key={entry.href} href={entry.href}>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <entry.icon className="h-4 w-4" />
                  {entry.label}
                </Button>
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="검색"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="테마 변경">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-1">
            {navEntries.map((entry) =>
              isGroup(entry) ? (
                <div key={entry.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === entry.label ? null : entry.label)
                    }
                  >
                    <entry.icon className="h-4 w-4" />
                    {entry.label}
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform ${
                        mobileExpanded === entry.label ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                  {mobileExpanded === entry.label && (
                    <div className="ml-6 flex flex-col gap-1">
                      {entry.children.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={entry.href}
                  href={entry.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <entry.icon className="h-4 w-4" />
                    {entry.label}
                  </Button>
                </Link>
              )
            )}
          </nav>
        </div>
      )}

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
