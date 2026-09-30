import { useConfigurator } from '../../../context/ConfiguratorContext'
import { getConfiguredPrice, getConfiguredWeight, getPriceBracket, getWheelsById, suggestWheels } from '../../../config/parts'
import { getGravelTire, getTireWarning } from '../../../config/standardParts'
import { OptionCard } from '../../../components/OptionCard'
import { PartDetails } from '../../../components/PartDetails'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import { BeginnerTip } from '../../../components/BeginnerTip'
import styles from './OptionGrid.module.css'

const MATERIAL_LABEL = { alu: 'Alu', carbon: 'Carbon' } as const

export function WheelsStep() {
  const {
    bikeType,
    budget,
    totalPrice,
    totalWeight,
    weightIncomplete,
    wheelsId,
    wheelsVariants,
    wheelsLocks,
    tireVariants,
    selectWheels,
    setWheelsVariant,
    setTireVariant,
    canGoNext,
    goNext,
    goBack,
  } = useConfigurator()

  if (!bikeType) {
    return (
      <StepShell eyebrow="Schritt 5 von 5" title="Wähle deine Laufräder">
        <p>Bitte wähle zuerst einen Bike-Typ aus.</p>
        <button type="button" className="btn btn-ghost" onClick={goBack} style={{ marginTop: 16 }}>
          Zurück
        </button>
      </StepShell>
    )
  }

  const { options, recommendedId } = suggestWheels(bikeType, budget)
  const bracket = getPriceBracket('wheels', budget)
  const selectedWheels = getWheelsById(wheelsId)
  const otherTotal = totalPrice - getConfiguredPrice(selectedWheels, wheelsVariants)
  const tireWarning = getTireWarning(selectedWheels, wheelsVariants, tireVariants)

  return (
    <StepShell
      eyebrow="Schritt 5 von 5"
      title="Wähle deine Laufräder"
      intro="Laufräder beeinflussen, wie leicht sich dein Bike beschleunigen lässt und wie stabil es unterwegs ist."
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={goBack}>
            Zurück
          </button>
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={!canGoNext}>
            Bike anzeigen
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
      <PriceBracketNote label="Laufräder" min={bracket.min} max={bracket.max} />
      <BeginnerTip>
        Laufräder sind das Tuning-Teil Nummer 1. Nimm <strong>Carbon</strong>, wenn du ein spürbar leichteres, schnelleres
        Bike willst, und <strong>Alu</strong>, wenn du günstig starten willst – aufrüsten kannst du später immer noch.
      </BeginnerTip>
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            badge={MATERIAL_LABEL[option.material]}
            selected={option.id === wheelsId}
            recommended={option.id === recommendedId}
            onSelect={selectWheels}
            weight={getConfiguredWeight(option, option.id === wheelsId ? wheelsVariants : {})}
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
      {selectedWheels && (
        <PartDetails
          part={selectedWheels}
          selection={wheelsVariants}
          onChange={setWheelsVariant}
          locked={wheelsLocks}
        />
      )}
      {bikeType === 'gravel' && (
        <PartDetails part={getGravelTire()} selection={tireVariants} onChange={setTireVariant} />
      )}
      {bikeType === 'gravel' && tireWarning && (
        <p className={styles.warning}>⚠ {tireWarning}</p>
      )}
    </StepShell>
  )
}
