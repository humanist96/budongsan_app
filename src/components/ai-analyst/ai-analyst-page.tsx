'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Bot, Send, Sparkles, User, BarChart3, MapPin, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  analyzeQuery,
  SUGGESTED_QUESTIONS,
  type ChatMessage,
  type AnalysisResult,
} from '@/lib/geo/ai-analyst-engine'
import { celebrities, properties } from '@/data/celebrity-seed-data'

function AnalysisResultView({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="mt-2 space-y-2">
      {/* Rankings */}
      {analysis.data?.rankings && analysis.data.rankings.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="space-y-1.5">
            {analysis.data.rankings.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium truncate">{item.name}</span>
                  {item.detail && (
                    <span className="text-muted-foreground text-[10px] shrink-0">
                      {item.detail}
                    </span>
                  )}
                </div>
                <span className="font-bold text-pink-600 dark:text-pink-400 shrink-0 ml-2">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neighbor Relations */}
      {analysis.data?.neighbors && analysis.data.neighbors.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
            이웃 셀럽 TOP {analysis.data.neighbors.length}
          </p>
          <div className="space-y-1.5">
            {analysis.data.neighbors.map((n, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] font-bold text-violet-600 shrink-0">
                  {i + 1}
                </span>
                <span className="truncate">
                  {n.sourceName} ↔ {n.targetName}
                </span>
                <span className="text-muted-foreground shrink-0 ml-auto">
                  {n.distanceMeters}m
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gu Stats */}
      {analysis.data?.guStats && analysis.data.guStats.length > 1 && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="space-y-1.5">
            {analysis.data.guStats.map((gu) => (
              <div key={gu.gu} className="flex items-center justify-between text-xs">
                <span className="font-medium">{gu.gu}</span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {gu.celebrityCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {gu.propertyCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function AiAnalystPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = useCallback(
    (text?: string) => {
      const query = text ?? input.trim()
      if (!query) return

      const userMessage: ChatMessage = {
        role: 'user',
        content: query,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsTyping(true)

      // Simulate analysis delay
      setTimeout(() => {
        const analysis = analyzeQuery(query)
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: analysis.content,
          analysis,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      }, 600 + Math.random() * 400)
    },
    [input],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold">AI GIS 분석가</h1>
            <p className="text-[10px] text-muted-foreground">
              셀럽 부동산 데이터를 공간 분석으로 탐색합니다
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-muted-foreground">분석 준비 완료</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-7 w-7 text-violet-500" />
            </div>
            <h2 className="text-lg font-bold mb-2">셀럽 부동산 AI 분석가</h2>
            <p className="text-sm text-muted-foreground mb-6">
              자연어로 부동산 공간 분석을 질문하세요
            </p>

            {/* Suggested Questions */}
            <div className="grid grid-cols-2 gap-2 max-w-lg mx-auto">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs text-left h-auto py-2 justify-start"
                  onClick={() => handleSend(q)}
                >
                  <Sparkles className="h-3 w-3 mr-1.5 text-violet-500 shrink-0" />
                  <span className="truncate">{q}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5'
                  : 'bg-muted rounded-2xl rounded-bl-md px-4 py-2.5'
              }`}
            >
              {msg.analysis?.title && msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-xs font-bold">{msg.analysis.title}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.analysis && <AnalysisResultView analysis={msg.analysis} />}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="셀럽 부동산에 대해 질문하세요..."
            className="flex-1 px-4 py-2.5 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            disabled={isTyping}
          />
          <Button
            size="icon"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          {celebrities.length}명 셀럽 × {properties.length}개 매물 데이터 기반 공간 분석
        </p>
      </div>
    </div>
  )
}
