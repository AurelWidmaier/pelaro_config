import { useConfigurator } from '../../../context/ConfiguratorContext'
import { getConfiguredPrice, getConfiguredWeight, getFrameById, getPriceBracket, suggestFrames } from '../../../config/parts'
import { OptionCard } from '../../../components/OptionCard'
import { PartDetails } from '../../../components/PartDetails'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import styles from './OptionGrid.module.css'

const MATERIAL_LABEL = { alu: 'Alu', carbon: 'Carbon' } as const

export function FrameStep() {
  const {
    bikeType,
    budget,
    totalPrice,
    totalWeight,
    weightIncomplete,
    frameId,
    frameVariants,
    selectFrame,
    setFrameVariant,
    canGoNext,
    goNext,
    goBack,
  } = useConfigurator()

  if (!bikeType) {
    return (
      <StepShell eyebrow="Schritt 3 von 5" title="Wähle deinen Rahmentyp">
        <p>Bitte wähle zuerst einen Bike-Typ aus.</p>
        <button type="button" className="btn btn-ghost" onClick={goBack} style={{ marginTop: 16 }}>
          Zurück
        </button>
      </StepShell>
    )
  }

  const options = suggestFrames(bikeType, budget)
  const bracket = getPriceBracket('frame', budget)
  const selectedFrame = getFrameById(frameId)
  const otherTotal = totalPrice - getConfiguredPrice(selectedFrame, frameVariants)

  return (
    <StepShell
      eyebrow="Schritt 3 von 5"
      title="Wähle deinen Rahmen"
      intro="Der Rahmen ist das Grundgerüst deines Bikes – er bestimmt Gewicht, Optik und wie sportlich du sitzt."
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
      <PriceBracketNote label="einen Rahmen" min={bracket.min} max={bracket.max} />
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            badge={MATERIAL_LABEL[option.material]}
            selected={option.id === frameId}
            onSelect={selectFrame}
            weight={getConfiguredWeight(option, option.id === frameId ? frameVariants : {})}
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
      {selectedFrame && (
        <PartDetails part={selectedFrame} selection={frameVariants} onChange={setFrameVariant} />
      )}
    </StepShell>
  )
}
