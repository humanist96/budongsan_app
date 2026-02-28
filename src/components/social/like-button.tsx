'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  propertyId: string
  initialCount: number
}

export function LikeButton({ propertyId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function checkLiked() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single()

      if (data) setLiked(true)
    }

    checkLiked()
  }, [propertyId])

  const handleToggle = async () => {
    if (!userId) return

    const supabase = createClient()

    if (liked) {
      await supabase.from('likes').delete().eq('property_id', propertyId).eq('user_id', userId)
      setLiked(false)
      setCount((prev) => prev - 1)
    } else {
      await supabase.from('likes').insert({ user_id: userId, property_id: propertyId })
      setLiked(true)
      setCount((prev) => prev + 1)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn('gap-1.5', liked && 'text-red-500')}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-current')} />
      {count}
    </Button>
  )
}
