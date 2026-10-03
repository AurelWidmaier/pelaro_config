import { useConfigurator } from '../../../context/ConfiguratorContext'
import {
  getConfiguredPrice,
  getConfiguredWeight,
  getExtraParts,
  getGroupsetById,
  getPriceBracket,
  suggestGroupsets,
} from '../../../config/parts'
import { OptionCard } from '../../../components/OptionCard'
import { PartDetails } from '../../../components/PartDetails'
import { BudgetBar } from '../../../components/BudgetBar'
import { PriceBracketNote } from '../../../components/PriceBracketNote'
import { StepShell } from '../StepShell'
import { BeginnerTip } from '../../../components/BeginnerTip'
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
    groupsetLocks,
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

  const { options, recommendedId } = suggestGroupsets(bikeType, budget)
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
      <BeginnerTip>
        <ul>
          <li>
            Nimm <strong>elektronisch</strong>, wenn du bequem per Knopfdruck schalten und möglichst wenig einstellen
            willst.
          </li>
          <li>
            Nimm <strong>mechanisch</strong>, wenn du Geld sparen und selbst schrauben willst.
          </li>
          <li>
            Nimm <strong>1-fach (1x)</strong> für Gravel, wenn es simpel und robust sein soll – <strong>2-fach
            (2x)</strong>, wenn du feinere Gangsprünge für die Straße willst.
          </li>
        </ul>
      </BeginnerTip>
      <div className={styles.grid} style={{ marginTop: 20 }}>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            badge={KIND_LABEL[option.kind]}
            selected={option.id === groupsetId}
            recommended={option.id === recommendedId}
            onSelect={selectGroupset}
            weight={getConfiguredWeight(option, option.id === groupsetId ? groupsetVariants : {})}
            overBudget={otherTotal + option.price > budget}
          />
        ))}
      </div>
      {selectedGroupset && (
        <PartDetails
          part={selectedGroupset}
          selection={groupsetVariants}
          onChange={setGroupsetVariant}
          locked={groupsetLocks}
          extras={getExtraParts(selectedGroupset, groupsetVariants)}
        />
      )}
    </StepShell>
  )
}
