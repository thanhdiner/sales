import React from 'react'
import { Mail, MessageCircle } from 'lucide-react'

const FAQHelpCard = ({ content = {}, links = {} }) => {
  return (
    <div className="contact-card contact-faq-help-card">
      <p className="contact-eyebrow contact-faq-help-card__eyebrow">
        {content.eyebrow}
      </p>

      <h3 className="contact-card-title contact-faq-help-card__title">
        {content.title}
      </h3>

      <p className="contact-muted-text contact-faq-help-card__description">
        {content.description}
      </p>

      <div className="contact-faq-help-card__actions">
        <a
          href={links.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-brand-action contact-faq-help-card__button contact-faq-help-card__button--primary"
        >
          <MessageCircle className="h-4 w-4" />
          {content.zaloButton}
        </a>

        <a
          href={links.emailUrl}
          className="contact-secondary-action contact-faq-help-card__button contact-faq-help-card__button--secondary"
        >
          <Mail className="h-4 w-4" />
          {content.emailButton}
        </a>
      </div>

      <p className="contact-tip contact-faq-help-card__tip">
        {content.tip}
      </p>
    </div>
  )
}

export default FAQHelpCard
