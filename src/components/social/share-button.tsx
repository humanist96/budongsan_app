'use client'

import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  url?: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = url || window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5">
      <Share2 className="h-4 w-4" />
      공유
    </Button>
  )
}
