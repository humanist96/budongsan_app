import { create } from 'zustand'
import type { DebateSide, PlaybackSpeed } from '@/types/debate'

interface DebateState {
  currentTurnIndex: number
  isPlaying: boolean
  playbackSpeed: PlaybackSpeed
  revealedTurnIndices: number[]
  hasStarted: boolean
  showSummary: boolean
  userVote: DebateSide | null
  isTypingComplete: boolean

  start: () => void
  togglePlay: () => void
  setSpeed: (speed: PlaybackSpeed) => void
  nextTurn: () => void
  prevTurn: () => void
  skipToTurn: (index: number) => void
  completeCurrentTurn: () => void
  setTypingComplete: (complete: boolean) => void
  vote: (side: DebateSide) => void
  reset: () => void
}

const TOTAL_TURNS = 50

export const useDebateStore = create<DebateState>((set, get) => ({
  currentTurnIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  revealedTurnIndices: [],
  hasStarted: false,
  showSummary: false,
  userVote: null,
  isTypingComplete: false,

  start: () =>
    set({
      hasStarted: true,
      isPlaying: true,
      currentTurnIndex: 0,
      revealedTurnIndices: [],
      showSummary: false,
      isTypingComplete: false,
    }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setSpeed: (speed) => set({ playbackSpeed: speed }),

  nextTurn: () => {
    const state = get()
    const nextIndex = state.currentTurnIndex + 1
    if (nextIndex >= TOTAL_TURNS) {
      set({
        showSummary: true,
        isPlaying: false,
        revealedTurnIndices: [
          ...state.revealedTurnIndices,
          state.currentTurnIndex,
        ],
      })
      return
    }
    set({
      currentTurnIndex: nextIndex,
      revealedTurnIndices: [
        ...state.revealedTurnIndices,
        state.currentTurnIndex,
      ],
      isTypingComplete: false,
    })
  },

  prevTurn: () =>
    set((state) => {
      if (state.currentTurnIndex <= 0) return state
      const prevIndex = state.currentTurnIndex - 1
      return {
        currentTurnIndex: prevIndex,
        revealedTurnIndices: state.revealedTurnIndices.filter(
          (i) => i < prevIndex
        ),
        isTypingComplete: false,
        showSummary: false,
      }
    }),

  skipToTurn: (index) =>
    set(() => {
      const clamped = Math.max(0, Math.min(index, TOTAL_TURNS - 1))
      const revealed = Array.from({ length: clamped }, (_, i) => i)
      return {
        currentTurnIndex: clamped,
        revealedTurnIndices: revealed,
        isTypingComplete: false,
        showSummary: false,
        isPlaying: false,
      }
    }),

  completeCurrentTurn: () =>
    set((state) => ({
      isTypingComplete: true,
      revealedTurnIndices: state.revealedTurnIndices.includes(
        state.currentTurnIndex
      )
        ? state.revealedTurnIndices
        : [...state.revealedTurnIndices, state.currentTurnIndex],
    })),

  setTypingComplete: (complete) => set({ isTypingComplete: complete }),

  vote: (side) => set({ userVote: side }),

  reset: () =>
    set({
      currentTurnIndex: 0,
      isPlaying: false,
      revealedTurnIndices: [],
      hasStarted: false,
      showSummary: false,
      userVote: null,
      isTypingComplete: false,
    }),
}))
