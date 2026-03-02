'use client'

import Link from 'next/link'
import { Swords } from 'lucide-react'
import type { DebateEntry } from '@/data/debate-index'
import { cn } from '@/lib/utils'

interface DebateTopicListProps {
  entries: readonly DebateEntry[]
}

export function DebateTopicList({ entries }: DebateTopicListProps) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
            <Swords className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">부동산 토론</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            김인만(🐂) vs 이광수(🐻) — AI가 재현한 50턴 부동산 설전.
            주제를 골라 토론을 감상하세요.
          </p>
        </div>

        <div className="grid gap-4">
          {entries.map((entry, idx) => (
            <Link
              key={entry.slug}
              href={`/debate/${entry.slug}`}
              className={cn(
                'group block rounded-xl border bg-card p-5',
                'transition-all hover:shadow-md hover:border-primary/30',
                'active:scale-[0.99]'
              )}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0 mt-0.5">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h2 className="font-bold text-base group-hover:text-primary transition-colors">
                    {entry.shortTitle}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {entry.description}
                  </p>
                </div>
                <div className="shrink-0 text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
