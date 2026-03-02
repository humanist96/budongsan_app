export type DebateSide = 'bull' | 'bear'
export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2

export interface DebatePersona {
  readonly id: DebateSide
  readonly name: string
  readonly title: string
  readonly emoji: string
  readonly position: string
  readonly catchphrases: readonly string[]
  readonly avatarFallback: string
}

export interface DebatePhase {
  readonly id: number
  readonly name: string
  readonly description: string
  readonly turnRange: readonly [number, number]
  readonly intensity: 1 | 2 | 3 | 4 | 5
}

export interface DebateTurn {
  readonly turnNumber: number
  readonly speakerId: DebateSide
  readonly content: string
  readonly phaseId: number
}

export interface DebateIssue {
  readonly topic: string
  readonly bullPosition: string
  readonly bearPosition: string
}

export interface DebateData {
  readonly title: string
  readonly topic: string
  readonly personas: readonly [DebatePersona, DebatePersona]
  readonly phases: readonly DebatePhase[]
  readonly turns: readonly DebateTurn[]
  readonly summary: readonly DebateIssue[]
  readonly quotes: Readonly<Record<DebateSide, readonly string[]>>
}
