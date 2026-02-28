'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface Comment {
  id: string
  user_id: string
  content: string
  created_at: string
  parent_id: string | null
}

interface CommentSectionProps {
  propertyId: string
}

export function CommentSection({ propertyId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComments() {
      try {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (user) setUserId(user.id)

        const { data } = await supabase
          .from('comments')
          .select('*')
          .eq('property_id', propertyId)
          .order('created_at', { ascending: false })

        setComments((data || []) as Comment[])
      } catch {
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [propertyId])

  const handleSubmit = async () => {
    if (!newComment.trim() || !userId) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: userId,
          property_id: propertyId,
          content: newComment.trim(),
        })
        .select()
        .single()

      if (error) throw error
      setComments((prev) => [data as Comment, ...prev])
      setNewComment('')
    } catch (err) {
      // Comment failed
    }
  }

  const handleDelete = async (commentId: string) => {
    try {
      const supabase = createClient()
      await supabase.from('comments').delete().eq('id', commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
      // Delete failed
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          댓글 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {userId ? (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button size="icon" onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
        )}

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            아직 댓글이 없습니다.
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 group">
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                {userId === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
