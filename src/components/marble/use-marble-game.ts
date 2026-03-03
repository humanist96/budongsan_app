'use client'

import { useReducer, useCallback } from 'react'
import {
  BOARD_SPACES,
  DISTRICTS,
  GOLDEN_KEY_CARDS,
  GAME_CONSTANTS,
  TOTAL_SPACES,
  getRent,
  getMaxBuildings,
  type GoldenKeyCard,
} from '@/data/marble-data'

// --- Types ---

export interface PlayerState {
  readonly id: 'player' | 'computer'
  readonly name: string
  readonly money: number
  readonly position: number
  readonly properties: Record<string, readonly number[]>  // districtKey → 건설된 건물 인덱스 배열 ([] = 땅만 보유)
  readonly islandTurnsLeft: number
  readonly nextBuyHalf: boolean
  readonly bankrupt: boolean
}

export type GamePhase = 'intro' | 'playing' | 'result'

export type TurnPhase =
  | 'roll'          // 주사위 굴리기 대기
  | 'moving'        // 이동 애니메이션
  | 'landed'        // 칸에 도착 (처리 대기)
  | 'buy-prompt'    // 매수 여부
  | 'build-prompt'  // 건설 여부
  | 'golden-key'    // 황금열쇠 카드
  | 'island'        // 무인도
  | 'event'         // 이벤트 처리 중
  | 'turn-end'      // 턴 종료

export interface LogEntry {
  readonly turn: number
  readonly playerId: 'player' | 'computer'
  readonly message: string
}

export interface GameState {
  readonly phase: GamePhase
  readonly player: PlayerState
  readonly computer: PlayerState
  readonly currentPlayer: 'player' | 'computer'
  readonly turnPhase: TurnPhase
  readonly turn: number
  readonly dice: readonly [number, number]
  readonly isDouble: boolean
  readonly logs: readonly LogEntry[]
  readonly currentGoldenKey: GoldenKeyCard | null
  readonly goldenKeyDeck: readonly number[] // shuffled card ids
  readonly goldenKeyIndex: number
  readonly winner: 'player' | 'computer' | null
  readonly lotteryResult: number | null
  readonly moveCount: number  // 'moving' useEffect 재트리거용
}

// --- Actions ---

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE' }
  | { type: 'FINISH_MOVE' }
  | { type: 'BUY_PROPERTY'; buy: boolean }
  | { type: 'BUILD'; build: boolean; buildingIndex?: number }
  | { type: 'DISMISS_GOLDEN_KEY' }
  | { type: 'ESCAPE_ISLAND'; pay: boolean }
  | { type: 'DISMISS_EVENT' }
  | { type: 'END_TURN' }
  | { type: 'COMPUTER_ACT' }
  | { type: 'DISMISS_LOTTERY' }

// --- Helpers ---

function shuffleArray<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1
}

function createPlayer(id: 'player' | 'computer', name: string): PlayerState {
  return {
    id,
    name,
    money: GAME_CONSTANTS.STARTING_MONEY,
    position: 0,
    properties: {},
    islandTurnsLeft: 0,
    nextBuyHalf: false,
    bankrupt: false,
  }
}

function addLog(state: GameState, playerId: 'player' | 'computer', message: string): readonly LogEntry[] {
  return [...state.logs, { turn: state.turn, playerId, message }]
}

function getActivePlayer(state: GameState): PlayerState {
  return state.currentPlayer === 'player' ? state.player : state.computer
}

function getOpponent(state: GameState): PlayerState {
  return state.currentPlayer === 'player' ? state.computer : state.player
}

function updatePlayer(state: GameState, playerId: 'player' | 'computer', updates: Partial<PlayerState>): Pick<GameState, 'player' | 'computer'> {
  if (playerId === 'player') {
    return { player: { ...state.player, ...updates }, computer: state.computer }
  }
  return { player: state.player, computer: { ...state.computer, ...updates } }
}

function countProperties(p: PlayerState): number {
  return Object.keys(p.properties).length
}

function countBuildings(p: PlayerState): number {
  return Object.values(p.properties).reduce((sum, indices) => sum + indices.length, 0)
}

function totalAssets(p: PlayerState): number {
  let assets = p.money
  for (const [districtKey, builtIndices] of Object.entries(p.properties)) {
    const d = DISTRICTS[districtKey]
    if (d) {
      assets += d.price + d.buildCost * builtIndices.length
    }
  }
  return assets
}

function drawGoldenKey(state: GameState): { card: GoldenKeyCard; goldenKeyIndex: number; goldenKeyDeck: readonly number[] } {
  let deck = state.goldenKeyDeck
  let idx = state.goldenKeyIndex

  if (idx >= deck.length) {
    deck = shuffleArray(GOLDEN_KEY_CARDS.map(c => c.id))
    idx = 0
  }

  const cardId = deck[idx]
  const card = GOLDEN_KEY_CARDS.find(c => c.id === cardId) ?? GOLDEN_KEY_CARDS[0]

  return { card, goldenKeyIndex: idx + 1, goldenKeyDeck: deck }
}

// --- Initial State ---

function createInitialState(): GameState {
  return {
    phase: 'intro',
    player: createPlayer('player', '플레이어'),
    computer: createPlayer('computer', '컴퓨터'),
    currentPlayer: 'player',
    turnPhase: 'roll',
    turn: 1,
    dice: [1, 1],
    isDouble: false,
    logs: [],
    currentGoldenKey: null,
    goldenKeyDeck: shuffleArray(GOLDEN_KEY_CARDS.map(c => c.id)),
    goldenKeyIndex: 0,
    winner: null,
    lotteryResult: null,
    moveCount: 0,
  }
}

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      return {
        ...createInitialState(),
        phase: 'playing',
        turnPhase: 'roll',
        logs: [{ turn: 1, playerId: 'player', message: '게임 시작! 시작 자금 300억' }],
      }
    }

    case 'ROLL_DICE': {
      const active = getActivePlayer(state)
      if (active.bankrupt) return state

      // 무인도 체크
      if (active.islandTurnsLeft > 0) {
        return { ...state, turnPhase: 'island' }
      }

      const d1 = rollDie()
      const d2 = rollDie()
      const total = d1 + d2
      const isDouble = d1 === d2

      const oldPos = active.position
      const newPos = (oldPos + total) % TOTAL_SPACES
      const passedStart = oldPos + total >= TOTAL_SPACES

      let money = active.money
      let logs = state.logs

      if (passedStart && newPos !== 0) {
        money += GAME_CONSTANTS.SALARY
        logs = addLog({ ...state, logs }, active.id, `출발 통과! +${GAME_CONSTANTS.SALARY}억`)
      }

      logs = [...logs, { turn: state.turn, playerId: active.id, message: `주사위 ${d1}+${d2}=${total} → ${BOARD_SPACES[newPos].name}` }]

      return {
        ...state,
        ...updatePlayer(state, active.id, { ...active, money, position: newPos }),
        dice: [d1, d2] as const,
        isDouble: isDouble,
        turnPhase: 'moving',
        moveCount: state.moveCount + 1,
        logs,
      }
    }

    case 'FINISH_MOVE': {
      const active = getActivePlayer(state)
      const space = BOARD_SPACES[active.position]

      switch (space.type) {
        case 'start': {
          const newMoney = active.money + GAME_CONSTANTS.SALARY
          const logs = addLog(state, active.id, `출발 도착! +${GAME_CONSTANTS.SALARY}억`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'property': {
          const dKey = space.districtKey!
          const opponent = getOpponent(state)

          // 상대가 소유한 땅
          if (opponent.properties[dKey] !== undefined) {
            const builtIndices = opponent.properties[dKey]
            const rent = getRent(dKey, builtIndices.length)
            const district = DISTRICTS[dKey]
            const buildingName = builtIndices.length > 0
              ? ` (${builtIndices.map(idx => district.buildings[idx]?.name).filter(Boolean).join(', ')})`
              : ''
            const logs = addLog(state, active.id, `${space.name} 임대료 ${rent}억 지불${buildingName}`)
            const newActiveMoney = active.money - rent
            const newOpponentMoney = opponent.money + rent
            const bankrupt = newActiveMoney <= 0

            const updatedActive = { ...active, money: newActiveMoney, bankrupt }
            const updatedOpponent = { ...opponent, money: newOpponentMoney }
            const playerUpdates = active.id === 'player'
              ? { player: updatedActive, computer: updatedOpponent }
              : { player: updatedOpponent, computer: updatedActive }

            if (bankrupt) {
              return {
                ...state,
                ...playerUpdates,
                turnPhase: 'turn-end',
                logs: addLog({ ...state, logs }, active.id, `파산! 💀`),
                winner: opponent.id,
                phase: 'result',
              }
            }

            return {
              ...state,
              ...playerUpdates,
              turnPhase: 'turn-end',
              logs,
            }
          }

          // 본인 소유 → 건설 제안
          if (active.properties[dKey] !== undefined) {
            const builtCount = active.properties[dKey].length
            const maxBuild = getMaxBuildings(dKey)
            if (builtCount < maxBuild) {
              return { ...state, turnPhase: 'build-prompt' }
            }
            return { ...state, turnPhase: 'turn-end' }
          }

          // 빈 땅 → 매수 제안
          return { ...state, turnPhase: 'buy-prompt' }
        }

        case 'golden-key': {
          const { card, goldenKeyIndex, goldenKeyDeck } = drawGoldenKey(state)
          return {
            ...state,
            currentGoldenKey: card,
            goldenKeyIndex,
            goldenKeyDeck,
            turnPhase: 'golden-key',
          }
        }

        case 'desert-island': {
          const logs = addLog(state, active.id, `무인도 도착! ${GAME_CONSTANTS.ISLAND_TURNS}턴 대기`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { islandTurnsLeft: GAME_CONSTANTS.ISLAND_TURNS }),
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'space-travel': {
          const gangnamIdx = 20
          const logs = addLog(state, active.id, `우주여행! 강남구로 이동!`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { position: gangnamIdx }),
            turnPhase: 'moving',
            moveCount: state.moveCount + 1,
            logs,
          }
        }

        case 'tax':
        case 'fund': {
          const amount = space.amount ?? 0
          const newMoney = active.money + amount
          const logs = addLog(state, active.id, `${space.name}: ${amount}억`)
          const bankrupt = newMoney <= 0

          if (bankrupt) {
            return {
              ...state,
              ...updatePlayer(state, active.id, { money: newMoney, bankrupt: true }),
              turnPhase: 'turn-end',
              logs: addLog({ ...state, logs }, active.id, `파산! 💀`),
              winner: getOpponent(state).id,
              phase: 'result',
            }
          }

          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            turnPhase: 'event',
            logs,
          }
        }

        case 'olympic': {
          const amount = space.amount ?? 20
          const newMoney = active.money + amount
          const logs = addLog(state, active.id, `올림픽 보너스! +${amount}억`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            turnPhase: 'event',
            logs,
          }
        }

        case 'lottery': {
          const win = Math.random() > 0.5
          const amount = win ? (space.amount ?? 20) : -(space.amount ?? 20)
          const newMoney = active.money + amount
          const logs = addLog(state, active.id, `복권 ${win ? '당첨' : '꽝'}! ${amount > 0 ? '+' : ''}${amount}억`)
          const bankrupt = newMoney <= 0

          if (bankrupt) {
            return {
              ...state,
              ...updatePlayer(state, active.id, { money: newMoney, bankrupt: true }),
              turnPhase: 'turn-end',
              logs: addLog({ ...state, logs }, active.id, `파산! 💀`),
              winner: getOpponent(state).id,
              phase: 'result',
              lotteryResult: amount,
            }
          }

          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            turnPhase: 'event',
            logs,
            lotteryResult: amount,
          }
        }

        case 'go-to-island': {
          const logs = addLog(state, active.id, `한강나들이! 무인도로 이동!`)
          return {
            ...state,
            ...updatePlayer(state, active.id, {
              position: 7,
              islandTurnsLeft: GAME_CONSTANTS.ISLAND_TURNS,
            }),
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'bonus': {
          const amount = space.amount ?? 10
          const newMoney = active.money + amount
          const logs = addLog(state, active.id, `셀럽 만남! +${amount}억`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            turnPhase: 'event',
            logs,
          }
        }

        default:
          return { ...state, turnPhase: 'turn-end' }
      }
    }

    case 'BUY_PROPERTY': {
      const active = getActivePlayer(state)
      const space = BOARD_SPACES[active.position]
      const dKey = space.districtKey!
      const district = DISTRICTS[dKey]

      if (!action.buy || !district) {
        const logs = addLog(state, active.id, `${space.name} 매수 포기`)
        return { ...state, turnPhase: 'turn-end', logs }
      }

      let cost = district.price
      if (active.nextBuyHalf) {
        cost = Math.round(cost / 2)
      }

      if (active.money < cost) {
        const logs = addLog(state, active.id, `자금 부족! ${space.name} 매수 불가`)
        return { ...state, turnPhase: 'turn-end', logs }
      }

      const newProps = { ...active.properties, [dKey]: [] as readonly number[] }
      const logs = addLog(state, active.id, `${space.name} 매수! -${cost}억${active.nextBuyHalf ? ' (반값!)' : ''}`)

      return {
        ...state,
        ...updatePlayer(state, active.id, {
          money: active.money - cost,
          properties: newProps,
          nextBuyHalf: false,
        }),
        turnPhase: 'turn-end',
        logs,
      }
    }

    case 'BUILD': {
      const active = getActivePlayer(state)
      const space = BOARD_SPACES[active.position]
      const dKey = space.districtKey!
      const district = DISTRICTS[dKey]

      if (!action.build || !district) {
        return { ...state, turnPhase: 'turn-end' }
      }

      const builtIndices = active.properties[dKey] ?? []
      const maxBuild = getMaxBuildings(dKey)
      const cost = district.buildCost

      if (builtIndices.length >= maxBuild) {
        return { ...state, turnPhase: 'turn-end' }
      }

      if (active.money < cost) {
        const logs = addLog(state, active.id, `건설 자금 부족!`)
        return { ...state, turnPhase: 'turn-end', logs }
      }

      // 선택된 건물 인덱스 (없으면 아직 안 지은 첫 번째 건물)
      const chosenIdx = action.buildingIndex ?? district.buildings.findIndex((_, i) => !builtIndices.includes(i))
      if (chosenIdx < 0 || chosenIdx >= district.buildings.length || builtIndices.includes(chosenIdx)) {
        return { ...state, turnPhase: 'turn-end' }
      }

      const building = district.buildings[chosenIdx]
      const displayName = building.celeb ? `${building.name}(${building.celeb})` : building.name

      const newProps = { ...active.properties, [dKey]: [...builtIndices, chosenIdx] }
      const logs = addLog(state, active.id, `${displayName} 건설! -${cost}억`)

      return {
        ...state,
        ...updatePlayer(state, active.id, {
          money: active.money - cost,
          properties: newProps,
        }),
        turnPhase: 'turn-end',
        logs,
      }
    }

    case 'DISMISS_GOLDEN_KEY': {
      if (!state.currentGoldenKey) return { ...state, turnPhase: 'turn-end', currentGoldenKey: null }

      const card = state.currentGoldenKey
      const active = getActivePlayer(state)
      const opponent = getOpponent(state)
      let logs = addLog(state, active.id, `황금열쇠: ${card.title}`)

      switch (card.effect.type) {
        case 'money': {
          const newMoney = active.money + card.effect.amount
          const bankrupt = newMoney <= 0
          if (bankrupt) {
            return {
              ...state,
              ...updatePlayer(state, active.id, { money: newMoney, bankrupt: true }),
              currentGoldenKey: null,
              turnPhase: 'turn-end',
              logs: addLog({ ...state, logs }, active.id, `파산! 💀`),
              winner: opponent.id,
              phase: 'result',
            }
          }
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'money-per-property': {
          const count = countProperties(active)
          const total = card.effect.amountPerProperty * count
          const newMoney = active.money + total
          logs = addLog({ ...state, logs }, active.id, `부동산 ${count}개 × ${card.effect.amountPerProperty}억 = ${total}억`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: Math.max(newMoney, 0) }),
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'money-per-building': {
          const count = countBuildings(active)
          const total = card.effect.amountPerBuilding * count
          const newMoney = active.money + total
          logs = addLog({ ...state, logs }, active.id, `건물 ${count}개 × ${card.effect.amountPerBuilding}억 = ${total}억`)
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: newMoney }),
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs,
          }
        }

        case 'move-to': {
          const newPos = card.effect.spaceIndex
          let newMoney = active.money
          if (card.effect.collectSalary) {
            newMoney += GAME_CONSTANTS.SALARY
            logs = addLog({ ...state, logs }, active.id, `출발 보너스 +${GAME_CONSTANTS.SALARY}억`)
          }
          return {
            ...state,
            ...updatePlayer(state, active.id, {
              money: newMoney,
              position: newPos,
              islandTurnsLeft: newPos === 7 ? GAME_CONSTANTS.ISLAND_TURNS : 0,
            }),
            currentGoldenKey: null,
            turnPhase: newPos === 7 ? 'turn-end' : 'moving',
            moveCount: state.moveCount + 1,
            logs,
          }
        }

        case 'both-lose': {
          const amount = card.effect.amount
          const newPlayerMoney = state.player.money - amount
          const newComputerMoney = state.computer.money - amount
          const playerBankrupt = newPlayerMoney <= 0
          const computerBankrupt = newComputerMoney <= 0

          const bothLoseLogs = addLog({ ...state, logs }, active.id, `양쪽 모두 -${amount}억!`)

          if (playerBankrupt || computerBankrupt) {
            return {
              ...state,
              player: { ...state.player, money: newPlayerMoney, bankrupt: playerBankrupt },
              computer: { ...state.computer, money: newComputerMoney, bankrupt: computerBankrupt },
              currentGoldenKey: null,
              turnPhase: 'turn-end',
              phase: 'result',
              winner: playerBankrupt ? 'computer' : 'player',
              logs: bothLoseLogs,
            }
          }

          return {
            ...state,
            player: { ...state.player, money: newPlayerMoney },
            computer: { ...state.computer, money: newComputerMoney },
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs: bothLoseLogs,
          }
        }

        case 'next-buy-half': {
          return {
            ...state,
            ...updatePlayer(state, active.id, { nextBuyHalf: true }),
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs: addLog({ ...state, logs }, active.id, `다음 매수 반값!`),
          }
        }

        case 'conditional-bonus': {
          const hasDistrict = active.properties[card.effect.districtKey] !== undefined
          const amount = hasDistrict ? card.effect.bonus : card.effect.fallback
          return {
            ...state,
            ...updatePlayer(state, active.id, { money: active.money + amount }),
            currentGoldenKey: null,
            turnPhase: 'turn-end',
            logs: addLog({ ...state, logs }, active.id, `${hasDistrict ? '보유 보너스' : ''} +${amount}억`),
          }
        }

        default:
          return { ...state, currentGoldenKey: null, turnPhase: 'turn-end' }
      }
    }

    case 'ESCAPE_ISLAND': {
      const active = getActivePlayer(state)

      if (action.pay && active.money >= GAME_CONSTANTS.ISLAND_ESCAPE_COST) {
        const logs = addLog(state, active.id, `무인도 탈출! -${GAME_CONSTANTS.ISLAND_ESCAPE_COST}억`)
        return {
          ...state,
          ...updatePlayer(state, active.id, {
            money: active.money - GAME_CONSTANTS.ISLAND_ESCAPE_COST,
            islandTurnsLeft: 0,
          }),
          turnPhase: 'roll',
          logs,
        }
      }

      // 대기
      const remaining = active.islandTurnsLeft - 1
      if (remaining <= 0) {
        const logs = addLog(state, active.id, `무인도 탈출! (대기 완료)`)
        return {
          ...state,
          ...updatePlayer(state, active.id, { islandTurnsLeft: 0 }),
          turnPhase: 'roll',
          logs,
        }
      }

      const logs = addLog(state, active.id, `무인도 대기 중... ${remaining}턴 남음`)
      return {
        ...state,
        ...updatePlayer(state, active.id, { islandTurnsLeft: remaining }),
        turnPhase: 'turn-end',
        logs,
      }
    }

    case 'DISMISS_EVENT':
    case 'DISMISS_LOTTERY': {
      return { ...state, turnPhase: 'turn-end', lotteryResult: null }
    }

    case 'END_TURN': {
      // 파산 체크
      if (state.player.bankrupt || state.computer.bankrupt) {
        return {
          ...state,
          phase: 'result',
          winner: state.player.bankrupt ? 'computer' : 'player',
        }
      }

      // 최대 턴 체크
      const nextTurn = state.currentPlayer === 'computer' ? state.turn + 1 : state.turn
      if (nextTurn > GAME_CONSTANTS.MAX_TURNS) {
        const playerAssets = totalAssets(state.player)
        const computerAssets = totalAssets(state.computer)
        return {
          ...state,
          phase: 'result',
          winner: playerAssets >= computerAssets ? 'player' : 'computer',
          logs: addLog(state, 'player',
            `${GAME_CONSTANTS.MAX_TURNS}턴 종료! 플레이어: ${playerAssets}억 vs 컴퓨터: ${computerAssets}억`
          ),
        }
      }

      // 더블이면 한 번 더
      if (state.isDouble && !getActivePlayer(state).bankrupt) {
        const logs = addLog(state, state.currentPlayer, `더블! 한 번 더!`)
        return { ...state, turnPhase: 'roll', isDouble: false, logs }
      }

      // 턴 교대
      const nextPlayer = state.currentPlayer === 'player' ? 'computer' : 'player'
      return {
        ...state,
        currentPlayer: nextPlayer,
        turnPhase: 'roll',
        turn: nextTurn,
        isDouble: false,
        lotteryResult: null,
      }
    }

    case 'COMPUTER_ACT': {
      // AI 결정 로직
      return computerAI(state)
    }

    default:
      return state
  }
}

// --- Computer AI ---

function computerAI(state: GameState): GameState {
  const computer = state.computer
  const space = BOARD_SPACES[computer.position]

  // 무인도
  if (computer.islandTurnsLeft > 0) {
    if (computer.money >= GAME_CONSTANTS.ISLAND_ESCAPE_COST + 50) {
      return gameReducer(state, { type: 'ESCAPE_ISLAND', pay: true })
    }
    return gameReducer(state, { type: 'ESCAPE_ISLAND', pay: false })
  }

  // 매수 결정
  if (state.turnPhase === 'buy-prompt' && space.districtKey) {
    const district = DISTRICTS[space.districtKey]
    if (!district) return gameReducer(state, { type: 'BUY_PROPERTY', buy: false })

    const cost = computer.nextBuyHalf ? Math.round(district.price / 2) : district.price
    const isHighGrade = district.grade === 'S' || district.grade === 'A'

    // S/A급은 항상 매수, 나머지는 자금의 60% 이하일 때만
    const shouldBuy = computer.money >= cost && (isHighGrade || cost <= computer.money * 0.6)
    return gameReducer(state, { type: 'BUY_PROPERTY', buy: shouldBuy })
  }

  // 건설 결정
  if (state.turnPhase === 'build-prompt' && space.districtKey) {
    const district = DISTRICTS[space.districtKey]
    if (!district) return gameReducer(state, { type: 'BUILD', build: false })

    const sameGradeCount = Object.keys(computer.properties).filter(
      key => DISTRICTS[key]?.grade === district.grade
    ).length
    const shouldBuild = sameGradeCount >= 2 && computer.money >= district.buildCost + 30
    // AI: 아직 안 지은 건물 중 첫 번째 선택
    const builtIndices = computer.properties[space.districtKey] ?? []
    const nextIdx = district.buildings.findIndex((_, i) => !builtIndices.includes(i))
    return gameReducer(state, { type: 'BUILD', build: shouldBuild, buildingIndex: nextIdx >= 0 ? nextIdx : undefined })
  }

  // 황금열쇠
  if (state.turnPhase === 'golden-key') {
    return gameReducer(state, { type: 'DISMISS_GOLDEN_KEY' })
  }

  // 이벤트/복권
  if (state.turnPhase === 'event') {
    return gameReducer(state, { type: 'DISMISS_EVENT' })
  }

  return state
}

// --- Hook ---

export function useMarbleGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const rollDice = useCallback(() => dispatch({ type: 'ROLL_DICE' }), [])
  const finishMove = useCallback(() => dispatch({ type: 'FINISH_MOVE' }), [])
  const buyProperty = useCallback((buy: boolean) => dispatch({ type: 'BUY_PROPERTY', buy }), [])
  const build = useCallback((b: boolean, buildingIndex?: number) => dispatch({ type: 'BUILD', build: b, buildingIndex }), [])
  const dismissGoldenKey = useCallback(() => dispatch({ type: 'DISMISS_GOLDEN_KEY' }), [])
  const escapeIsland = useCallback((pay: boolean) => dispatch({ type: 'ESCAPE_ISLAND', pay }), [])
  const dismissEvent = useCallback(() => dispatch({ type: 'DISMISS_EVENT' }), [])
  const endTurn = useCallback(() => dispatch({ type: 'END_TURN' }), [])
  const computerAct = useCallback(() => dispatch({ type: 'COMPUTER_ACT' }), [])
  const dismissLottery = useCallback(() => dispatch({ type: 'DISMISS_LOTTERY' }), [])

  const activePlayer = getActivePlayer(state)
  const opponentPlayer = getOpponent(state)

  return {
    state,
    activePlayer,
    opponentPlayer,
    totalAssets,
    actions: {
      startGame,
      rollDice,
      finishMove,
      buyProperty,
      build,
      dismissGoldenKey,
      escapeIsland,
      dismissEvent,
      endTurn,
      computerAct,
      dismissLottery,
    },
  }
}
