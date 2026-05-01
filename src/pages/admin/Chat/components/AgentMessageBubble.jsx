import { Lock, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { getChatImageUrls, getLocalizedSystemMessage, hasChatImages } from '@/utils/chatMessage'
import { renderTextWithLinks } from '@/utils/renderTextWithLinks'
import { ChatReactionPicker, ChatReactionSummary } from '@/components/shared/ChatMessageReactions'

import ChatAvatar, { getAvatarSrc, getInitials } from './ChatAvatar'
import { dayjs } from '../utils'

function ChatImage({ src, alt, multiple = false, onOpen }) {
  const imageClassName = multiple
    ? 'block h-24 w-full rounded-xl object-cover shadow-sm ring-1 ring-black/5'
    : 'block max-h-80 w-auto max-w-[260px] rounded-xl object-cover shadow-sm ring-1 ring-black/5'

  return (
    <button
      type="button"
      onClick={() => onOpen?.(src, alt)}
      className={`block cursor-zoom-in rounded-xl p-0 text-left transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] focus:ring-offset-2 focus:ring-offset-[var(--admin-bg-soft)] ${multiple ? 'w-full' : 'max-w-[260px]'}`}
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={imageClassName}
      />
    </button>
  )
}

function ChatImageGallery({ imageUrls, alt, onOpenImage }) {
  if (imageUrls.length === 1) {
    return <ChatImage src={imageUrls[0]} alt={alt} onOpen={onOpenImage} />
  }

  return (
    <div className="grid max-w-[260px] grid-cols-2 gap-2">
      {imageUrls.map((src, index) => (
        <ChatImage
          key={`${src}_${index}`}
          src={src}
          alt={`${alt} ${index + 1}`}
          multiple
          onOpen={onOpenImage}
        />
      ))}
    </div>
  )
}

function ImageMessageContent({ message, captionClassName, imageAlt, senderName, onOpenImagePreview }) {
  const imageUrls = getChatImageUrls(message)
  const handleOpenImage = (url, alt) => {
    onOpenImagePreview?.({
      url,
      alt,
      senderName,
      createdAt: message.createdAt
    })
  }

  return (
    <div className="space-y-2">
      <ChatImageGallery
        imageUrls={imageUrls}
        alt={message.message || imageAlt}
        onOpenImage={handleOpenImage}
      />
      {message.message ? (
        <div className={captionClassName}>
          {renderTextWithLinks(message.message, 'break-all underline underline-offset-2')}
        </div>
      ) : null}
    </div>
  )
}

export default function AgentMessageBubble({
  message,
  onOpenImagePreview,
  onReactToMessage,
  reactionActor
}) {
  const { t, i18n } = useTranslation('adminChat')
  const language = i18n.resolvedLanguage || i18n.language
  const isAgent = message.sender === 'agent'
  const isCustomer = message.sender === 'customer' || message.sender === 'guest'
  const isSystem = message.type === 'system' || message.sender === 'system'
  const isBot = message.sender === 'bot'
  const isInternalNote = message.type === 'note' || message.isInternal
  const isImageMessage = message.type === 'image' && hasChatImages(message)
  const timeLabel = dayjs(message.createdAt).format('HH:mm')
  const customerName = message.senderName || t('message.customer')
  const customerAvatar = getAvatarSrc(
    message.senderAvatar,
    message.avatar,
    message.customer?.avatar,
    message.customer?.avatarUrl
  )
  const agentName = message.senderName || t('message.agent')
  const agentAvatar = getAvatarSrc(
    message.senderAvatar,
    message.agentAvatar,
    message.assignedAgent?.agentAvatar
  )
  const reactionLabel = t('message.react')
  const getReactionLabel = (emoji, active) =>
    active
      ? t('message.removeReaction', { emoji })
      : t('message.reactWith', { emoji })

  const noteLinkClassName =
    'break-all underline decoration-amber-400 underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200'
  const customerLinkClassName =
    'break-all text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200'
  const agentLinkClassName =
    'break-all underline decoration-white/70 underline-offset-2 hover:text-blue-100'
  const botLinkClassName =
    'break-all text-emerald-700 underline decoration-emerald-400 underline-offset-2 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200'

  if (isSystem) {
    return (
      <div className="my-3 flex justify-center">
        <span className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-1.5 text-xs text-[var(--admin-text-muted)] shadow-sm">
          {getLocalizedSystemMessage(message, t, language)}
        </span>
      </div>
    )
  }

  if (isInternalNote) {
    return (
      <div className={`flex justify-end ${message.isOptimistic ? 'opacity-60' : ''}`}>
        <div className="max-w-[72%] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200 md:max-w-[520px]">
          <div className="mb-1 flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-300">
            <Lock className="h-3 w-3" />
            {t('message.internalNote')}
            {!message.isOptimistic && ` - ${timeLabel}`}
          </div>
          {renderTextWithLinks(message.message, noteLinkClassName)}
        </div>
      </div>
    )
  }

  if (isCustomer) {
    return (
      <div className="group flex items-end gap-2">
        <ChatAvatar
          src={customerAvatar}
          alt=""
          className="mb-0.5 h-8 w-8 rounded-xl bg-[var(--admin-surface)] text-xs font-semibold text-[var(--admin-text-muted)] shadow-sm ring-1 ring-[var(--admin-border)]"
        >
          {getInitials(customerName, 'K')}
        </ChatAvatar>

        <div className="max-w-[72%] md:max-w-[520px]">
          <p className="mb-1 ml-1 text-[11px] text-[var(--admin-text-muted)]">
            {customerName}
          </p>

          {isImageMessage ? (
            <div className="flex w-fit flex-col items-start">
              <ImageMessageContent
                message={message}
                imageAlt={t('message.imageAlt')}
                senderName={customerName}
                onOpenImagePreview={onOpenImagePreview}
                captionClassName="rounded-2xl rounded-bl-sm border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3.5 py-2.5 text-sm text-[var(--admin-text)] shadow-sm whitespace-pre-wrap break-words"
              />
              <ChatReactionSummary
                actor={reactionActor}
                align="left"
                getReactionLabel={getReactionLabel}
                message={message}
                onReact={onReactToMessage}
              />
            </div>
          ) : (
            <div className="flex w-fit flex-col items-start">
              <div className="rounded-2xl rounded-bl-sm border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3.5 py-2.5 text-sm text-[var(--admin-text)] shadow-sm whitespace-pre-wrap break-words">
                {renderTextWithLinks(message.message, customerLinkClassName)}
              </div>
              <ChatReactionSummary
                actor={reactionActor}
                align="left"
                getReactionLabel={getReactionLabel}
                message={message}
                onReact={onReactToMessage}
              />
            </div>
          )}
        </div>

        <ChatReactionPicker
          actor={reactionActor}
          align="right"
          className="mb-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
          label={reactionLabel}
          getReactionLabel={getReactionLabel}
          message={message}
          onReact={onReactToMessage}
        />

        <span className="mb-0.5 self-end text-[11px] text-[var(--admin-text-subtle)] opacity-0 transition-opacity group-hover:opacity-100">
          {timeLabel}
        </span>
      </div>
    )
  }

  if (isBot) {
    const suggestions = Array.isArray(message.metadata?.suggestions)
      ? message.metadata.suggestions.filter(Boolean)
      : []

    return (
      <div className="group flex items-end justify-end gap-2">
        <span className="mb-0.5 self-end text-[11px] text-[var(--admin-text-subtle)] opacity-0 transition-opacity group-hover:opacity-100">
          {timeLabel}
        </span>

        <ChatReactionPicker
          actor={reactionActor}
          align="right"
          className="mb-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
          label={reactionLabel}
          getReactionLabel={getReactionLabel}
          message={message}
          onReact={onReactToMessage}
        />

        <div className="max-w-[72%] md:max-w-[520px]">
          <p className="mb-1 mr-1 flex items-center justify-end gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
            <Sparkles className="h-3 w-3" />
            {message.senderName || 'SmartMall Bot'}
          </p>

          <div className="w-fit rounded-2xl rounded-br-sm border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-3.5 py-2.5 text-sm text-[var(--admin-text)] shadow-sm whitespace-pre-wrap break-words dark:border-emerald-800/40 dark:from-emerald-900/20 dark:to-teal-900/20">
            {renderTextWithLinks(message.message, botLinkClassName)}
          </div>
          <ChatReactionSummary
            actor={reactionActor}
            align="right"
            getReactionLabel={getReactionLabel}
            message={message}
            onReact={onReactToMessage}
          />

          {suggestions.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap justify-end gap-1.5">
              {suggestions.map((suggestion, index) => (
                <span
                  key={`${suggestion}_${index}`}
                  className="rounded-full border border-emerald-200 bg-[var(--admin-surface)] px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
                >
                  {suggestion}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-sm">
          <Sparkles className="h-4 w-4" strokeWidth={1.8} />
        </div>
      </div>
    )
  }

  if (isAgent) {
    return (
      <div className={`group flex items-end justify-end gap-2 ${message.isOptimistic ? 'opacity-60' : ''}`}>
        {!message.isOptimistic && (
          <span className="mb-0.5 self-end text-[11px] text-[var(--admin-text-subtle)] opacity-0 transition-opacity group-hover:opacity-100">
            {timeLabel}
          </span>
        )}

        <ChatReactionPicker
          actor={reactionActor}
          align="right"
          className="mb-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
          label={reactionLabel}
          getReactionLabel={getReactionLabel}
          message={message}
          onReact={onReactToMessage}
        />

        <div className="max-w-[72%] md:max-w-[520px]">
          {isImageMessage ? (
            <div className="flex w-fit flex-col items-end">
              <ImageMessageContent
                message={message}
                imageAlt={t('message.imageAlt')}
                senderName={agentName}
                onOpenImagePreview={onOpenImagePreview}
                captionClassName="w-fit rounded-2xl rounded-br-sm bg-[var(--admin-accent)] px-3.5 py-2.5 text-sm text-[#f4f5f8] shadow-sm whitespace-pre-wrap break-words"
              />
              <ChatReactionSummary
                actor={reactionActor}
                align="right"
                getReactionLabel={getReactionLabel}
                message={message}
                onReact={onReactToMessage}
              />
            </div>
          ) : (
            <div className="flex w-fit flex-col items-end">
              <div className="w-fit rounded-2xl rounded-br-sm bg-[var(--admin-accent)] px-3.5 py-2.5 text-sm text-[#f4f5f8] shadow-sm whitespace-pre-wrap break-words">
                {renderTextWithLinks(message.message, agentLinkClassName)}
              </div>
              <ChatReactionSummary
                actor={reactionActor}
                align="right"
                getReactionLabel={getReactionLabel}
                message={message}
                onReact={onReactToMessage}
              />
            </div>
          )}
        </div>

        <ChatAvatar
          src={agentAvatar}
          alt=""
          className="mb-0.5 h-8 w-8 rounded-xl bg-[var(--admin-accent)] text-xs font-semibold text-[#f4f5f8] shadow-sm"
        >
          {getInitials(agentName, 'A')}
        </ChatAvatar>
      </div>
    )
  }

  return null
}
