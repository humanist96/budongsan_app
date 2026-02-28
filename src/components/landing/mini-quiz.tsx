'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Gamepad2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizQuestion {
  readonly question: string
  readonly options: readonly string[]
  readonly correctIndex: number
}

const quizPool: readonly QuizQuestion[] = [
  {
    question: 'BTS 정국의 이태원 대저택, 매입가는 얼마일까요?',
    options: ['45억', '76억', '120억', '55억'],
    correctIndex: 1,
  },
  {
    question: 'GD(권지용)의 나인원한남 펜트하우스, 분양가는?',
    options: ['98억', '164억', '200억', '130억'],
    correctIndex: 1,
  },
  {
    question: '손흥민의 에테르노 압구정 PH, 분양가는 약 얼마?',
    options: ['200억', '300억', '400억', '150억'],
    correctIndex: 2,
  },
  {
    question: '비(정지훈)&김태희 부부의 서초동 빌딩 매입가는?',
    options: ['450억', '680억', '920억', '1,200억'],
    correctIndex: 2,
  },
  {
    question: '아이유의 에테르노 청담, 매입가는 얼마일까요?',
    options: ['80억', '130억', '200억', '160억'],
    correctIndex: 1,
  },
]

export function MiniQuiz() {
  const question = useMemo(
    () => quizPool[Math.floor(Math.random() * quizPool.length)],
    []
  )
  const [selected, setSelected] = useState<number | null>(null)

  const isCorrect = selected === question.correctIndex

  return (
    <section className="px-4 py-16 md:py-24 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gamepad2 className="h-7 w-7 text-orange-500" />
          <h2 className="text-3xl md:text-4xl font-black">셀럽 부동산 퀴즈</h2>
        </div>

        <p className="text-lg md:text-xl font-semibold mt-6 mb-8 leading-relaxed">
          &ldquo;{question.question}&rdquo;
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {question.options.map((option, idx) => {
            const isThisCorrect = idx === question.correctIndex
            const isSelected = idx === selected

            let btnClass = 'h-12 text-base font-bold border-2 transition-all '
            if (selected === null) {
              btnClass += 'border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/50'
            } else if (isThisCorrect) {
              btnClass += 'border-green-500 bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400'
            } else if (isSelected) {
              btnClass += 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
            } else {
              btnClass += 'border-muted opacity-50'
            }

            return (
              <Button
                key={option}
                variant="outline"
                className={btnClass}
                disabled={selected !== null}
                onClick={() => setSelected(idx)}
              >
                {selected !== null && isThisCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {selected !== null && isSelected && !isThisCorrect && (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                {option}
              </Button>
            )
          })}
        </div>

        {selected !== null && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isCorrect ? (
              <p className="text-lg font-bold text-green-600">정답입니다!</p>
            ) : (
              <p className="text-lg font-bold text-red-600">
                아쉽! 정답은 <span className="text-green-600">{question.options[question.correctIndex]}</span>
              </p>
            )}
            <Link href="/quiz" className="inline-block mt-4">
              <Button className="gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold">
                5문제 더 풀기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
