import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  BUDGET_RANGE,
  getConfiguredPrice,
  getConfiguredWeight,
  getDefaultVariants,
  getFrameById,
  getGroupsetById,
  getGroupsetLocks,
  getWheelsById,
  getWheelsLocks,
  type BikeType,
  type VariantSelection,
} from '../config/parts'
import { getStandardParts } from '../config/standardParts'

export const STEP_ORDER = ['biketype', 'budget', 'frame', 'groupset', 'wheels', 'result'] as const
export type StepId = (typeof STEP_ORDER)[number]

interface ConfiguratorState {
  step: StepId
  bikeType: BikeType | null
  budget: number
  frameId: string | null
  /** Unterauswahlen des Rahmens, z. B. { size: '54', finish: 'matt' }. */
  frameVariants: VariantSelection
  groupsetId: string | null
  /** Unterauswahlen der Schaltgruppe, z. B. { crankLength: '170' }. */
  groupsetVariants: VariantSelection
  wheelsId: string | null
  /** Unterauswahlen der Laufräder, z. B. { rimDepth: '50', bearing: 'steel' }. */
  wheelsVariants: VariantSelection
  /** Unterauswahl der Gravel-Reifen (Standardkomponente), z. B. { tireWidth: '40' }. */
  tireVariants: VariantSelection
}

interface ConfiguratorContextValue extends ConfiguratorState {
  stepIndex: number
  totalSteps: number
  totalPrice: number
  /** Summe der bekannten Gesamtgewichte der gewählten Teile, in Gramm. */
  totalWeight: number
  /** true, wenn mindestens ein gewähltes Teil keine Gewichtsangabe hat. */
  weightIncomplete: boolean
  remainingBudget: number
  /** Vom Rahmen festgelegte Unterauswahlen der Schaltgruppe (z. B. Tretlager). */
  groupsetLocks: VariantSelection
  /** Von der Schaltgruppe festgelegte Unterauswahlen der Laufräder (z. B. Freilauf). */
  wheelsLocks: VariantSelection
  setBikeType: (type: BikeType) => void
  setBudget: (value: number) => void
  selectFrame: (id: string) => void
  selectGroupset: (id: string) => void
  selectWheels: (id: string) => void
  setFrameVariant: (groupId: string, optionId: string) => void
  setGroupsetVariant: (groupId: string, optionId: string) => void
  setWheelsVariant: (groupId: string, optionId: string) => void
  setTireVariant: (groupId: string, optionId: string) => void
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
  frameVariants: {},
  groupsetId: null,
  groupsetVariants: {},
  wheelsId: null,
  wheelsVariants: {},
  tireVariants: {},
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null)

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfiguratorState>(initialState)

  const stepIndex = STEP_ORDER.indexOf(state.step)

  // Vorgaben anderer Teile (Tretlager vom Rahmen, Freilauf von der Kassette)
  // überschreiben die gespeicherte Auswahl – so passen sie auch nach einem Rahmenwechsel.
  const frame = getFrameById(state.frameId)
  const groupset = getGroupsetById(state.groupsetId)
  const wheels = getWheelsById(state.wheelsId)
  const groupsetLocks = useMemo(() => getGroupsetLocks(groupset, frame), [groupset, frame])
  const wheelsLocks = useMemo(() => getWheelsLocks(wheels, groupset), [wheels, groupset])
  const groupsetVariants = useMemo(
    () => ({ ...state.groupsetVariants, ...groupsetLocks }),
    [state.groupsetVariants, groupsetLocks],
  )
  const wheelsVariants = useMemo(
    () => ({ ...state.wheelsVariants, ...wheelsLocks }),
    [state.wheelsVariants, wheelsLocks],
  )

  const { totalPrice, totalWeight, weightIncomplete } = useMemo(() => {
    const selected = [
      { part: frame, variants: state.frameVariants },
      { part: groupset, variants: groupsetVariants },
      { part: wheels, variants: wheelsVariants },
    ].filter((entry) => entry.part)

    // Sattel, Reifen & Co. sind immer dabei und zählen von Anfang an mit.
    const standardParts = getStandardParts(state.bikeType, frame, state.tireVariants, groupset)
    const weights = [
      ...selected.map(({ part, variants }) => getConfiguredWeight(part, variants)),
      ...standardParts.map((p) => p.weight),
    ]
    return {
      totalPrice:
        selected.reduce((sum, { part, variants }) => sum + getConfiguredPrice(part, variants), 0) +
        standardParts.reduce((sum, p) => sum + p.price, 0),
      totalWeight: weights.reduce<number>((sum, w) => sum + (w ?? 0), 0),
      weightIncomplete: weights.some((w) => w === undefined),
    }
  }, [
    state.bikeType,
    state.frameVariants,
    state.tireVariants,
    frame,
    groupset,
    wheels,
    groupsetVariants,
    wheelsVariants,
  ])

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
    groupsetVariants,
    wheelsVariants,
    groupsetLocks,
    wheelsLocks,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    totalPrice,
    totalWeight,
    weightIncomplete,
    remainingBudget: state.budget - totalPrice,
    canGoNext,
    setBikeType: (type) =>
      setState((s) => ({
        ...s,
        bikeType: type,
        // Bike-Typ-Wechsel invalidiert evtl. bereits gewählte, nicht mehr passende Teile.
        frameId: null,
        frameVariants: {},
        groupsetId: null,
        groupsetVariants: {},
        wheelsId: null,
        wheelsVariants: {},
        tireVariants: {},
      })),
    setBudget: (value) => setState((s) => ({ ...s, budget: value })),
    // Erneutes Anklicken desselben Teils behält die Unterauswahl, ein Wechsel setzt die Defaults.
    selectFrame: (id) =>
      setState((s) =>
        s.frameId === id ? s : { ...s, frameId: id, frameVariants: getDefaultVariants(getFrameById(id)) },
      ),
    selectGroupset: (id) =>
      setState((s) =>
        s.groupsetId === id
          ? s
          : { ...s, groupsetId: id, groupsetVariants: getDefaultVariants(getGroupsetById(id)) },
      ),
    selectWheels: (id) =>
      setState((s) =>
        s.wheelsId === id ? s : { ...s, wheelsId: id, wheelsVariants: getDefaultVariants(getWheelsById(id)) },
      ),
    setFrameVariant: (groupId, optionId) =>
      setState((s) => ({ ...s, frameVariants: { ...s.frameVariants, [groupId]: optionId } })),
    setGroupsetVariant: (groupId, optionId) =>
      setState((s) => ({ ...s, groupsetVariants: { ...s.groupsetVariants, [groupId]: optionId } })),
    setWheelsVariant: (groupId, optionId) =>
      setState((s) => ({ ...s, wheelsVariants: { ...s.wheelsVariants, [groupId]: optionId } })),
    setTireVariant: (groupId, optionId) =>
      setState((s) => ({ ...s, tireVariants: { ...s.tireVariants, [groupId]: optionId } })),
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
