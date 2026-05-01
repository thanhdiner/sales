import React from 'react'
import { motion } from 'framer-motion'
import ContactForm from '@/components/client/ContactForm'
import { viewport } from '../constants'
import SectionHeader from '../components/SectionHeader'
import WorkingHoursCard from '../components/WorkingHoursCard'

const FormAndSchedule = ({ section = {}, workingHoursCard = {}, links = {} }) => {
  return (
    <motion.section
      className="contact-band bg-white px-4 py-12 md:py-20 dark:bg-gray-950"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={viewport}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} description={section.description} eyebrowClassName="text-gray-500" />

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            viewport={viewport}
          >
            <ContactForm />
          </motion.div>

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
            viewport={viewport}
          >
            <WorkingHoursCard content={workingHoursCard} links={links} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default FormAndSchedule
