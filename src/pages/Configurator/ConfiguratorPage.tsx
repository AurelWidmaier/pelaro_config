import { AnimatePresence } from 'framer-motion'
import { useConfigurator } from '../../context/ConfiguratorContext'
import { ProgressSteps } from '../../components/ProgressSteps'
import { Seo } from '../../components/Seo'
import { PAGES } from '../../seo/pages'
import { BikeTypeStep } from './steps/BikeTypeStep'
import { BudgetStep } from './steps/BudgetStep'
import { FrameStep } from './steps/FrameStep'
import { GroupsetStep } from './steps/GroupsetStep'
import { WheelsStep } from './steps/WheelsStep'
import { ResultStep } from './steps/ResultStep'
import styles from './ConfiguratorPage.module.css'

export function ConfiguratorPage() {
  const { step } = useConfigurator()

  return (
    <div className={styles.page}>
      <Seo meta={PAGES.configurator} />
      <div className={`${styles.progressBar} container`}>
        <ProgressSteps current={step} />
      </div>
      <div className="container">
        <AnimatePresence mode="wait">
          {step === 'biketype' && <BikeTypeStep key="biketype" />}
          {step === 'budget' && <BudgetStep key="budget" />}
          {step === 'frame' && <FrameStep key="frame" />}
          {step === 'groupset' && <GroupsetStep key="groupset" />}
          {step === 'wheels' && <WheelsStep key="wheels" />}
          {step === 'result' && <ResultStep key="result" />}
        </AnimatePresence>
      </div>
    </div>
  )
}
