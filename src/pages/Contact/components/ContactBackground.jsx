import React from 'react'

const BACKGROUND_SHAPES = [
  'contact-bg-orb contact-bg-orb--blue absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/25 blur-3xl dark:bg-blue-500/10',
  'contact-bg-orb contact-bg-orb--violet absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl dark:bg-violet-500/10',
  'contact-bg-orb contact-bg-orb--cyan absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-100/20 blur-3xl dark:bg-cyan-500/5'
]

const ContactBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BACKGROUND_SHAPES.map(className => (
        <div key={className} className={className} />
      ))}
    </div>
  )
}

export default ContactBackground
