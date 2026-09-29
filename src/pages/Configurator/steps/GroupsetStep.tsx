import { useConfigurator } from '../../../context/ConfiguratorContext'
import {
  getConfiguredPrice,
  getConfiguredWeight,
  getGroupsetById,
  getPriceBracket,
  suggestGroupsets,
} from '../../../config/parts'
import { OptionCard } from '../../../components/OptionCard'
import { PartDetails } from '../../../components/PartDetails'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import styles from './OptionGrid.module.css'

const KIND_LABEL = {
  'mechanisch-2x': '2x mechanisch',
  'mechanisch-1x': '1x mechanisch',
  elektronisch: 'Elektronisch',
} as const

export function GroupsetStep() {
  const {
    bikeType,
    budget,
    totalPrice,
    totalWeight,
    weightIncomplete,
    groupsetId,
    groupsetVariants,
    selectGroupset,
    setGroupsetVariant,
    canGoNext,
    goNext,
    goBack,
  } = useConfigurator()

  if (!bikeType) {
    return (
      <StepShell eyebrow="Schritt 4 von 5" title="Wähle deine Schaltgruppe">
        <p>Bitte wähle zuerst einen Bike-Typ aus.</p>
        <button type="button" className="btn btn-ghost" onClick={goBack} style={{ marginTop: 16 }}>
          Zurück
        </button>
      </StepShell>
    )
  }

  const options = suggestGroupsets(bikeType, budget)
  const bracket = getPriceBracket('groupset', budget)
  const selectedGroupset = getGroupsetById(groupsetId)
  const otherTotal = totalPrice - getConfiguredPrice(selectedGroupset, groupsetVariants)

  return (
    <StepShell
      eyebrow="Schritt 4 von 5"
      title="Wähle deine Schaltgruppe"
      intro="Die Schaltgruppe sorgt dafür, dass du sauber und leicht Gänge wechseln kannst – höhere Stufen schalten präziser und wiegen weniger."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={!canGoNext}>
            Weiter
          </button>
        </>
      }
    >
      <div className={styles.budgetRow}>
        <BudgetBar
          budget={budget}
          spent={totalPrice}
          weight={totalWeight}
          weightIncomplete={weightIncomplete}
        />
      </div>
      <PriceBracketNote label="eine Schaltgruppe" min={bracket.min} max={bracket.max} />
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            badge={KIND_LABEL[option.kind]}
            selected={option.id === groupsetId}
            onSelect={selectGroupset}
            weight={getConfiguredWeight(option, option.id === groupsetId ? groupsetVariants : {})}
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
      {selectedGroupset && (
        <PartDetails part={selectedGroupset} selection={groupsetVariants} onChange={setGroupsetVariant} />
      )}
    </StepShell>
  )
}
