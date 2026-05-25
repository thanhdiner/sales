export const FLASH_SALE_PAGE_LIMIT = 10

export const FLASH_SALE_VIEWPORT = { once: false, amount: 0.22, margin: '0px 0px -8% 0px' }

export const FLASH_SALE_STAGGER_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.07,
      delayChildren: 0.04
    }
  }
}

export const FLASH_SALE_FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
}

export const FLASH_SALE_CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: 'easeOut' }
  }
}
