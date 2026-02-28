'use client'

import { useState, useMemo } from 'react'
import { Gamepad2, CheckCircle2, XCircle, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'

interface QuizQuestion {
  id: number
  celebrityName: string
  propertyName: string
  address: string
  correctPrice: number
  options: number[]
}

const quizPool: QuizQuestion[] = [
  {
    id: 1,
    celebrityName: '홍길동',
    propertyName: '한남더힐',
    address: '서울 용산구 한남동',
    correctPrice: 300000,
    options: [200000, 300000, 400000, 500000],
  },
  {
    id: 2,
    celebrityName: '김영희',
    propertyName: 'PH129',
    address: '서울 강남구 청담동',
    correctPrice: 350000,
    options: [250000, 350000, 450000, 550000],
  },
  {
    id: 3,
    celebrityName: '최민호',
    propertyName: '래미안대치팰리스',
    address: '서울 강남구 대치동',
    correctPrice: 420000,
    options: [320000, 420000, 520000, 620000],
  },
  {
    id: 4,
    celebrityName: '이수진',
    propertyName: '나인원한남',
    address: '서울 용산구 한남동',
    correctPrice: 500000,
    options: [350000, 450000, 500000, 650000],
  },
  {
    id: 5,
    celebrityName: '박철수',
    propertyName: '타워팰리스',
    address: '서울 강남구 도곡동',
    correctPrice: 250000,
    options: [150000, 250000, 350000, 450000],
  },
]

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const questions = useMemo(() => {
    return [...quizPool].sort(() => Math.random() - 0.5).slice(0, 5)
  }, [])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (price: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(price)
    if (price === currentQuestion.correctPrice) {
      setScore((prev) => prev + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameOver(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameOver(false)
  }

  if (gameOver) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <Card>
          <CardContent className="p-8 text-center">
            <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold mb-2">퀴즈 결과</h1>
            <p className="text-4xl font-bold text-primary mb-2">
              {score} / {questions.length}
            </p>
            <p className="text-muted-foreground mb-6">
              정답률 {percentage}%
              {percentage >= 80
                ? ' - 부동산 전문가! 🏆'
                : percentage >= 60
                ? ' - 꽤 잘 아시네요! 👍'
                : ' - 다시 도전해보세요! 💪'}
            </p>
            <Button onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              다시 도전하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">가격 맞추기 퀴즈</h1>
        </div>
        <Badge variant="outline">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {currentQuestion.celebrityName}의 {currentQuestion.propertyName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{currentQuestion.address}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-4">이 매물의 가격은 얼마일까요?</p>

          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((price) => {
              const isCorrect = price === currentQuestion.correctPrice
              const isSelected = price === selectedAnswer

              let variant: 'default' | 'outline' | 'destructive' | 'secondary' = 'outline'
              if (showResult) {
                if (isCorrect) variant = 'default'
                else if (isSelected) variant = 'destructive'
                else variant = 'secondary'
              }

              return (
                <Button
                  key={price}
                  variant={variant}
                  className="h-auto py-3 flex flex-col gap-1"
                  onClick={() => handleAnswer(price)}
                  disabled={showResult}
                >
                  <span className="text-sm font-bold">{formatPrice(price)}원</span>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="h-4 w-4" />
                  )}
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-4 text-center">
              <p className="text-sm mb-3">
                {selectedAnswer === currentQuestion.correctPrice
                  ? '정답입니다! 🎉'
                  : `오답! 정답은 ${formatPrice(currentQuestion.correctPrice)}원입니다.`}
              </p>
              <Button onClick={handleNext}>
                {currentIndex + 1 >= questions.length ? '결과 보기' : '다음 문제'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        현재 점수: {score}점
      </div>
    </div>
  )
}
