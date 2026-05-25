import React from 'react'
import { motion } from 'framer-motion'

const processMotionViewport = { once: false, amount: 0.08, margin: '0px 0px 28% 0px' }

const processSectionVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
}

const processItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  }
}

const processStepsVariants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.46,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.08
    }
  }
}

const processStepVariants = {
  hidden: { opacity: 0, x: -18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
  }
}

const formatStepAria = (template, step, title) =>
  String(template || '')
    .replace('{{step}}', step)
    .replace('{{title}}', title)

const GuideProcess = ({ content, currentStep, setCurrentStep }) => {
  const section = content?.processSection || {}
  const steps = content?.steps || []

  return (
    <motion.section
      id="shopping-guide-steps"
      className="shopping-guide-section px-4 py-10 sm:px-6 lg:px-8 lg:py-12"
      variants={processSectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={processMotionViewport}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-9 text-center"
          variants={processItemVariants}
        >
          <p className="shopping-guide-process-eyebrow mb-3 text-sm font-semibold uppercase">
            {section.eyebrow}
          </p>

          <h2 className="guide-title text-3xl font-semibold">{section.title}</h2>
        </motion.div>

        <motion.div
          className="shopping-guide-process-steps"
          variants={processStepsVariants}
        >
          {steps.map((step, index) => {
            const isActive = currentStep === index
            const title = step.title
            const StepIcon = step.icon

            return (
              <motion.button
                key={`${title}-${index}`}
                type="button"
                onClick={() => setCurrentStep(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-label={formatStepAria(section.stepAria, index + 1, title)}
                className={`shopping-guide-process-step ${isActive ? 'is-active' : ''}`}
                initial="hidden"
                whileInView="show"
                viewport={processMotionViewport}
                variants={processStepVariants}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.985 }}
              >
                <span className="shopping-guide-process-step__number" aria-hidden="true">
                  {index + 1}
                </span>

                {StepIcon ? <StepIcon className="shopping-guide-process-step__icon" aria-hidden="true" /> : null}

                <span className="shopping-guide-process-step__copy">
                  <span className="shopping-guide-process-step__title">{title}</span>
                  <span className="shopping-guide-process-step__text">{step.content}</span>
                </span>
              </motion.button>
            )
          })}
        </motion.div>

        <motion.div
          className="mt-7 flex justify-center gap-3"
          variants={processItemVariants}
        >
          <motion.button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
            className="shopping-guide-process-button shopping-guide-process-button--secondary px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            whileHover={currentStep === 0 ? undefined : { y: -2 }}
            whileTap={currentStep === 0 ? undefined : { scale: 0.97 }}
          >
            {section.previous}
          </motion.button>

          <motion.button
            type="button"
            disabled={currentStep >= steps.length - 1}
            onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
            className="shopping-guide-process-button shopping-guide-process-button--primary px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            whileHover={currentStep >= steps.length - 1 ? undefined : { y: -2 }}
            whileTap={currentStep >= steps.length - 1 ? undefined : { scale: 0.97 }}
          >
            {section.next}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default GuideProcess
