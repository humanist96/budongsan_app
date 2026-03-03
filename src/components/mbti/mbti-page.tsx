'use client'

import { useState, useCallback } from 'react'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MbtiProgressBar } from './mbti-progress-bar'
import { MbtiQuestionCard } from './mbti-question-card'
import { MbtiResultCard } from './mbti-result-card'
import { MBTI_QUESTIONS, computeMbtiCode, getMbtiResult } from '@/data/mbti-data'
import type { MbtiResult } from '@/data/mbti-data'

type Phase = 'intro' | 'questions' | 'loading' | 'result'

export function MbtiPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({})
  const [result, setResult] = useState<MbtiResult | null>(null)

  const handleStart = useCallback(() => {
    setPhase('questions')
    setCurrentQuestion(0)
    setAnswers({})
    setResult(null)
  }, [])

  const handleAnswer = useCallback((value: 'A' | 'B') => {
    const questionId = MBTI_QUESTIONS[currentQuestion].id
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion + 1 >= MBTI_QUESTIONS.length) {
      setPhase('loading')
      const code = computeMbtiCode(newAnswers)
      const mbtiResult = getMbtiResult(code)
      setTimeout(() => {
        setResult(mbtiResult)
        setPhase('result')
      }, 1500)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }, [currentQuestion, answers])

  const handleRetry = useCallback(() => {
    handleStart()
  }, [handleStart])

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center mb-6">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3">셀럽 부동산 MBTI</h1>
        <p className="text-muted-foreground mb-2 max-w-md">
          8개 질문으로 알아보는 나의 부동산 성향!
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md">
          당신과 같은 부동산 유형의 셀럽은 누구일까요?
        </p>
        <Button
          onClick={handleStart}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-8"
        >
          테스트 시작하기
        </Button>
      </div>
    )
  }

  if (phase === 'questions') {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <MbtiProgressBar current={currentQuestion + 1} total={MBTI_QUESTIONS.length} />
        <MbtiQuestionCard
          key={currentQuestion}
          question={MBTI_QUESTIONS[currentQuestion]}
          questionNumber={currentQuestion + 1}
          onAnswer={handleAnswer}
        />
      </div>
    )
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-16 h-16 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mb-6" />
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          당신의 부동산 성향을 분석 중...
        </p>
      </div>
    )
  }

  if (phase === 'result' && result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <MbtiResultCard result={result} onRetry={handleRetry} />
      </div>
    )
  }

  return null
}
