'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { MbtiQuestion } from '@/data/mbti-data'
import { cn } from '@/lib/utils'

interface MbtiQuestionCardProps {
  question: MbtiQuestion
  onAnswer: (value: 'A' | 'B') => void
  questionNumber: number
}

export function MbtiQuestionCard({ question, onAnswer, questionNumber }: MbtiQuestionCardProps) {
  return (
    <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <span className="text-sm font-medium text-muted-foreground">Q{questionNumber}</span>
        <h2 className="text-xl font-bold mt-1">{question.question}</h2>
      </div>

      <div className="space-y-3">
        {question.choices.map((choice, idx) => (
          <Card
            key={choice.value}
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:shadow-md hover:scale-[1.02] hover:border-pink-300',
              'active:scale-[0.98]'
            )}
            onClick={() => onAnswer(choice.value)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-white flex items-center justify-center text-sm font-bold">
                {idx === 0 ? 'A' : 'B'}
              </span>
              <span className="text-sm font-medium leading-snug">{choice.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
