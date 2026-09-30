import { useConfigurator } from '../../../context/ConfiguratorContext'
import { getConfiguredPrice, getConfiguredWeight, getFrameById, getPriceBracket, suggestFrames } from '../../../config/parts'
import { OptionCard } from '../../../components/OptionCard'
import { PartDetails } from '../../../components/PartDetails'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import { BeginnerTip } from '../../../components/BeginnerTip'
import { FrameSizeAdvisor } from '../../../components/FrameSizeAdvisor'
import { getFrameSizes } from '../../../config/frameSize'
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
    rider,
    setRider,
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

  const { options, recommendedId } = suggestFrames(bikeType, budget)
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
      <BeginnerTip>
        Der Rahmen bestimmt Sitzposition und Gewicht. Nimm einen <strong>Aero-Rahmen</strong>, wenn du schnell in der
        Ebene fahren willst, und einen <strong>leichten Rahmen</strong>, wenn du viele Höhenmeter machst. Am wichtigsten
        ist aber die richtige Größe – der Größenrechner hilft dir, sobald du einen Rahmen gewählt hast.
      </BeginnerTip>
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            badge={MATERIAL_LABEL[option.material]}
            selected={option.id === frameId}
            recommended={option.id === recommendedId}
            onSelect={selectFrame}
            weight={getConfiguredWeight(option, option.id === frameId ? frameVariants : {})}
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
      {selectedFrame && (
        <PartDetails part={selectedFrame} selection={frameVariants} onChange={setFrameVariant} />
      )}
      {selectedFrame && getFrameSizes(selectedFrame).length > 0 && (
        <FrameSizeAdvisor
          key={selectedFrame.id}
          frame={selectedFrame}
          currentSize={frameVariants.size}
          rider={rider}
          onRiderChange={setRider}
          onApply={(size) => setFrameVariant('size', size)}
        />
      )}
    </StepShell>
  )
}
