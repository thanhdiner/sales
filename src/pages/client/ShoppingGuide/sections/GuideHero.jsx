import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const heroAssetSources = {
  phone: '/images/phone.png',
  bag: '/images/bag-guard.png',
  card: '/images/card.png'
}

const heroAssetMotion = {
  phone: {
    initial: { opacity: 0, x: 28, y: -8, scale: 0.985 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    hover: { opacity: 1, x: 0, y: 0, scale: 1.025 },
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
  },
  bag: {
    initial: { opacity: 0, x: -24, y: 18, scale: 0.985 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    hover: { opacity: 1, y: -8, x: -4, scale: 1.02 },
    transition: { duration: 0.36, delay: 0.03, ease: [0.22, 1, 0.36, 1] }
  },
  card: {
    initial: { opacity: 0, x: 26, y: 16, scale: 0.985 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    hover: { opacity: 1, y: -9, x: 6, rotate: -1.4, scale: 1.018 },
    transition: { duration: 0.38, delay: 0.06, ease: [0.22, 1, 0.36, 1] }
  }
}

const heroDecorMotion = {
  initial: { opacity: 0.75, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.24, delay: 0.08, ease: 'easeOut' }
}

const heroViewport = { once: false, amount: 0.28, margin: '0px 0px -12% 0px' }

const GuideHero = ({ content, onRegister }) => {
  const hero = content || {}
  const sectionRef = useRef(null)
  const [hoveredAsset, setHoveredAsset] = useState(null)
  const [assetsReady, setAssetsReady] = useState(false)
  const heroInView = useInView(sectionRef, heroViewport)

  useEffect(() => {
    let isMounted = true

    const preloadAsset = src =>
      new Promise(resolve => {
        const image = new Image()
        image.onload = resolve
        image.onerror = resolve
        image.src = src
      })

    Promise.all(Object.values(heroAssetSources).map(preloadAsset)).then(() => {
      if (isMounted) setAssetsReady(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const getAssetHoverProps = asset => ({
    onMouseEnter: () => setHoveredAsset(asset),
    onMouseLeave: () => setHoveredAsset(current => (current === asset ? null : current))
  })

  const getAssetMotion = asset => {
    const motionConfig = heroAssetMotion[asset]
    return {
      initial: motionConfig.initial,
      animate: !heroInView
        ? motionConfig.initial
        : hoveredAsset === asset
          ? motionConfig.hover
          : motionConfig.whileInView,
      transition: motionConfig.transition
    }
  }

  return (
    <motion.section
      ref={sectionRef}
      className="shopping-guide-hero-shell"
      initial={{ opacity: 0, y: 20 }}
      animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="shopping-guide-hero-card">
        <span className="shopping-guide-hero-card__soft-shape shopping-guide-hero-card__soft-shape--one" aria-hidden="true" />
        <span className="shopping-guide-hero-card__soft-shape shopping-guide-hero-card__soft-shape--two" aria-hidden="true" />

        <motion.div
          className="shopping-guide-hero-card__content"
          initial={{ opacity: 0, x: -64 }}
          animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -64 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="shopping-guide-hero-card__eyebrow">{hero.eyebrow}</p>

          <h1 className="shopping-guide-hero-card__title">
            {hero.title}
          </h1>

          <p className="shopping-guide-hero-card__description">{hero.description}</p>

          <div className="shopping-guide-hero-card__actions">
            <button
              type="button"
              onClick={onRegister}
              className="shopping-guide-hero-card__button shopping-guide-hero-card__button--primary"
            >
              {hero.registerButton}
            </button>

            <a
              href="#shopping-guide-steps"
              className="shopping-guide-hero-card__button shopping-guide-hero-card__button--secondary"
            >
              {hero.guideButton}
            </a>
          </div>
        </motion.div>

        <div
          className="shopping-guide-hero-art"
          aria-hidden="true"
        >
          <motion.span
            className="shopping-guide-hero-art__dot shopping-guide-hero-art__dot--one"
            initial={heroDecorMotion.initial}
            animate={heroInView ? heroDecorMotion.animate : heroDecorMotion.initial}
            transition={heroDecorMotion.transition}
          />
          <motion.span
            className="shopping-guide-hero-art__dot shopping-guide-hero-art__dot--two"
            initial={heroDecorMotion.initial}
            animate={heroInView ? heroDecorMotion.animate : heroDecorMotion.initial}
            transition={{ ...heroDecorMotion.transition, delay: 0.12 }}
          />
          <motion.span
            className="shopping-guide-hero-art__diamond shopping-guide-hero-art__diamond--one"
            initial={{ opacity: 0.75, rotate: 45, scale: 0.88 }}
            animate={heroInView ? { opacity: 1, rotate: 45, scale: 1 } : { opacity: 0.75, rotate: 45, scale: 0.88 }}
            transition={{ ...heroDecorMotion.transition, delay: 0.1 }}
          />
          <motion.span
            className="shopping-guide-hero-art__diamond shopping-guide-hero-art__diamond--two"
            initial={{ opacity: 0.75, rotate: 45, scale: 0.88 }}
            animate={heroInView ? { opacity: 1, rotate: 45, scale: 1 } : { opacity: 0.75, rotate: 45, scale: 0.88 }}
            transition={{ ...heroDecorMotion.transition, delay: 0.14 }}
          />

          {assetsReady && (
            <>
              <span className="shopping-guide-hero-asset shopping-guide-hero-asset--phone">
                <motion.span className="shopping-guide-hero-asset__motion" {...getAssetMotion('phone')}>
                  <img src={heroAssetSources.phone} alt="" loading="eager" />
                </motion.span>
              </span>
              <span className="shopping-guide-hero-asset shopping-guide-hero-asset--bag">
                <motion.span className="shopping-guide-hero-asset__motion" {...getAssetMotion('bag')}>
                  <img src={heroAssetSources.bag} alt="" loading="eager" />
                </motion.span>
              </span>
              <span className="shopping-guide-hero-asset shopping-guide-hero-asset--card">
                <motion.span className="shopping-guide-hero-asset__motion" {...getAssetMotion('card')}>
                  <img src={heroAssetSources.card} alt="" loading="eager" />
                </motion.span>
              </span>
              <span
                className="shopping-guide-hero-hotspot shopping-guide-hero-hotspot--phone"
                {...getAssetHoverProps('phone')}
              />
              <span
                className="shopping-guide-hero-hotspot shopping-guide-hero-hotspot--bag"
                {...getAssetHoverProps('bag')}
              />
              <span
                className="shopping-guide-hero-hotspot shopping-guide-hero-hotspot--card"
                {...getAssetHoverProps('card')}
              />
            </>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default GuideHero
