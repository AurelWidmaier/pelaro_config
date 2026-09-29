import { useConfigurator } from '../../../context/ConfiguratorContext'
import { getPriceBracket, suggestFrames } from '../../../config/parts'
import { OptionCard } from '../../../components/OptionCard'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import styles from './OptionGrid.module.css'

const MATERIAL_LABEL = { alu: 'Alu', carbon: 'Carbon' } as const

export function FrameStep() {
  const { bikeType, budget, totalPrice, frameId, selectFrame, canGoNext, goNext, goBack } =
    useConfigurator()

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
  const otherTotal = totalPrice - (options.find((o) => o.id === frameId)?.price ?? 0)

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
        <BudgetBar budget={budget} spent={totalPrice} />
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
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
    </StepShell>
  )
}
