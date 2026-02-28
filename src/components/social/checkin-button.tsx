'use client'

import { useState, useEffect } from 'react'
import { MapPinCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface CheckinButtonProps {
  propertyId: string
  initialCount: number
}

export function CheckinButton({ propertyId, initialCount }: CheckinButtonProps) {
  const [checkedIn, setCheckedIn] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)
      const { data } = await supabase
        .from('checkins')
        .select('id')
        .eq('property_id', propertyId)
        .eq('user_id', user.id)
        .single()

      if (data) setCheckedIn(true)
    }

    checkStatus()
  }, [propertyId])

  const handleToggle = async () => {
    if (!userId) return

    const supabase = createClient()

    if (checkedIn) {
      await supabase.from('checkins').delete().eq('property_id', propertyId).eq('user_id', userId)
      setCheckedIn(false)
      setCount((prev) => prev - 1)
    } else {
      await supabase.from('checkins').insert({ user_id: userId, property_id: propertyId })
      setCheckedIn(true)
      setCount((prev) => prev + 1)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={cn('gap-1.5', checkedIn && 'text-green-500')}
    >
      <MapPinCheck className={cn('h-4 w-4', checkedIn && 'fill-current')} />
      {checkedIn ? '가봤어요' : '여기 가봤어요'}
      {count > 0 && ` ${count}`}
    </Button>
  )
}
