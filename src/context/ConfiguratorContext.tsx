import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  BUDGET_RANGE,
  getFrameById,
  getGroupsetById,
  getWheelsById,
  type BikeType,
} from '../config/parts'

export const STEP_ORDER = ['biketype', 'budget', 'frame', 'groupset', 'wheels', 'result'] as const
export type StepId = (typeof STEP_ORDER)[number]

interface ConfiguratorState {
  step: StepId
  bikeType: BikeType | null
  budget: number
  frameId: string | null
  groupsetId: string | null
  wheelsId: string | null
}

interface ConfiguratorContextValue extends ConfiguratorState {
  stepIndex: number
  totalSteps: number
  totalPrice: number
  remainingBudget: number
  setBikeType: (type: BikeType) => void
  setBudget: (value: number) => void
  selectFrame: (id: string) => void
  selectGroupset: (id: string) => void
  selectWheels: (id: string) => void
  goNext: () => void
  goBack: () => void
  goToStep: (step: StepId) => void
  reset: () => void
  canGoNext: boolean
}

const initialState: ConfiguratorState = {
  step: 'biketype',
  bikeType: null,
  budget: BUDGET_RANGE.default,
  frameId: null,
  groupsetId: null,
  wheelsId: null,
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null)

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfiguratorState>(initialState)

  const stepIndex = STEP_ORDER.indexOf(state.step)

  const totalPrice = useMemo(() => {
    const frame = getFrameById(state.frameId)?.price ?? 0
    const groupset = getGroupsetById(state.groupsetId)?.price ?? 0
    const wheels = getWheelsById(state.wheelsId)?.price ?? 0
    return frame + groupset + wheels
  }, [state.frameId, state.groupsetId, state.wheelsId])

  const canGoNext = useMemo(() => {
    switch (state.step) {
      case 'biketype':
        return Boolean(state.bikeType)
      case 'budget':
        return true
      case 'frame':
        return Boolean(state.frameId)
      case 'groupset':
        return Boolean(state.groupsetId)
      case 'wheels':
        return Boolean(state.wheelsId)
      default:
        return false
    }
  }, [state.step, state.bikeType, state.frameId, state.groupsetId, state.wheelsId])

  const value: ConfiguratorContextValue = {
    ...state,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    totalPrice,
    remainingBudget: state.budget - totalPrice,
    canGoNext,
    setBikeType: (type) =>
      setState((s) => ({
        ...s,
        bikeType: type,
        // Bike-Typ-Wechsel invalidiert evtl. bereits gewählte, nicht mehr passende Teile.
        frameId: null,
        groupsetId: null,
        wheelsId: null,
      })),
    setBudget: (value) => setState((s) => ({ ...s, budget: value })),
    selectFrame: (id) => setState((s) => ({ ...s, frameId: id })),
    selectGroupset: (id) => setState((s) => ({ ...s, groupsetId: id })),
    selectWheels: (id) => setState((s) => ({ ...s, wheelsId: id })),
    goNext: () =>
      setState((s) => {
        const idx = STEP_ORDER.indexOf(s.step)
        const next = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]
        return { ...s, step: next }
      }),
    goBack: () =>
      setState((s) => {
        const idx = STEP_ORDER.indexOf(s.step)
        const prev = STEP_ORDER[Math.max(idx - 1, 0)]
        return { ...s, step: prev }
      }),
    goToStep: (step) => setState((s) => ({ ...s, step })),
    reset: () => setState(initialState),
  }

  return <ConfiguratorContext.Provider value={value}>{children}</ConfiguratorContext.Provider>
}

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext)
  if (!ctx) throw new Error('useConfigurator must be used within a ConfiguratorProvider')
  return ctx
}
