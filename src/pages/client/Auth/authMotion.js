const AUTH_EASE = [0.16, 1, 0.3, 1]
const AUTH_SMOOTH = { duration: 0.45, ease: AUTH_EASE }

export function getAuthMotion(shouldReduceMotion) {
  if (shouldReduceMotion) {
    return {
      page: { initial: false, animate: false, transition: { duration: 0 } },
      header: { initial: false, animate: false, transition: { duration: 0 } },
      leftPanel: { initial: false, animate: false, transition: { duration: 0 } },
      heroImage: { initial: false, animate: false, transition: { duration: 0 } },
      heroContent: { initial: false, animate: false, transition: { duration: 0 } },
      sideFooter: { initial: false, animate: false, transition: { duration: 0 } },
      rightPanel: { initial: false, animate: false, transition: { duration: 0 } },
      card: { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } },
      cardHeader: { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } },
      formContent: { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } },
      stepContent: { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    }
  }

  return {
    page: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    header: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    leftPanel: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    heroImage: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    heroContent: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    sideFooter: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    rightPanel: {
      initial: false,
      animate: false,
      transition: { duration: 0 }
    },
    card: {
      initial: { opacity: 0, y: 28, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { ...AUTH_SMOOTH, delay: 0.18 }
    },
    cardHeader: {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.32, ease: AUTH_EASE, delay: 0.3 }
    },
    formContent: {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.34, ease: AUTH_EASE, delay: 0.36 }
    },
    stepContent: {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -12 },
      transition: { duration: 0.24, ease: 'easeOut' }
    }
  }
}
