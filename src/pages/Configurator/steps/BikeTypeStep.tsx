import { useConfigurator } from '../../../context/ConfiguratorContext'
import { BIKE_TYPES } from '../../../config/parts'
import { BikeTypeCard } from '../../../components/BikeTypeCard'
import { StepShell } from '../StepShell'
import { BeginnerTip } from '../../../components/BeginnerTip'
import styles from './OptionGrid.module.css'

export function BikeTypeStep() {
  const { bikeType, setBikeType, canGoNext, goNext } = useConfigurator()

  return (
    <StepShell
      eyebrow="Schritt 1 von 5"
      title="Was für ein Bike möchtest du?"
      intro="Deine Wahl bestimmt die Rahmengeometrie und welche Teile später zu deinem Bike passen."
      footer={
        <>
          <span />
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={!canGoNext}>
            Weiter
          </button>
        </>
      }
    >
      <div className={styles.grid}>
        {BIKE_TYPES.map((type) => (
          <BikeTypeCard
            key={type.id}
            bikeType={type}
            selected={type.id === bikeType}
            onSelect={setBikeType}
          />
        ))}
      </div>
      <BeginnerTip>
        Du bist unsicher? Nimm <strong>Gravel</strong> – damit fährst du auf Straße und Schotter, sitzt etwas aufrechter
        und bist für fast alles gerüstet.
      </BeginnerTip>
    </StepShell>
  )
}
