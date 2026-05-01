import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { renderTextWithLinks } from '@/utils/renderTextWithLinks'
import { getChatImageUrls, getLocalizedSystemMessage, hasChatImages } from '@/utils/chatMessage'
import { ChatReactionPicker, ChatReactionSummary } from '@/components/shared/ChatMessageReactions'
import AgentActivityPanel from './AgentActivityPanel'

function TypewriterText({ text, speed = 15, linkClassName }) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i += 1
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return <>{renderTextWithLinks(displayed, linkClassName)}</>
}

function ChatImage({ src, alt, multiple = false, onOpen }) {
  const imageClassName = multiple
    ? 'block h-24 w-full rounded-2xl object-cover shadow-sm ring-1 ring-black/5'
    : 'block max-h-72 w-auto max-w-[240px] rounded-2xl object-cover shadow-sm ring-1 ring-black/5'

  return (
    <button
      type="button"
      onClick={() => onOpen?.(src, alt)}
      className={`block cursor-zoom-in rounded-2xl p-0 text-left transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-950 ${multiple ? 'w-full' : 'max-w-[240px]'}`}
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
    <div className="grid max-w-[240px] grid-cols-2 gap-2">
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

function ImageMessageContent({ msg, captionClassName, imageAlt, senderName, onOpenImagePreview }) {
  const imageUrls = getChatImageUrls(msg)
  const handleOpenImage = (url, alt) => {
    onOpenImagePreview?.({
      url,
      alt,
      senderName,
      createdAt: msg.createdAt
    })
  }

  return (
    <div className="space-y-2">
      <ChatImageGallery
        imageUrls={imageUrls}
        alt={msg.message || imageAlt}
        onOpenImage={handleOpenImage}
      />
      {msg.message ? (
        <div className={captionClassName}>
          {renderTextWithLinks(msg.message, 'underline underline-offset-2 break-all')}
        </div>
      ) : null}
    </div>
  )
}

function AgentAvatar({ src, name }) {
  const initials = String(name || 'A')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'A'

  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mb-0.5 overflow-hidden text-[10px] font-semibold text-white">
      {src
        ? <img src={src} alt="" className="w-full h-full object-cover" />
        : initials
      }
    </div>
  )
}

export default function MessageBubble({
  msg,
  assignedAgent,
  showAvatar,
  onSuggestionClick,
  onOpenImagePreview,
  onReactToMessage,
  reactionActor
}) {
  const { t, i18n } = useTranslation('clientChat')
  const isCustomer = msg.sender === 'customer' || msg.sender === 'guest'
  const isSystem = msg.type === 'system' || msg.sender === 'system'
  const isBot = msg.sender === 'bot'
  const isImage = msg.type === 'image' && hasChatImages(msg)
  const customerLinkClassName = 'underline underline-offset-2 decoration-white/70 break-all hover:text-blue-100'
  const botLinkClassName = 'underline underline-offset-2 decoration-emerald-400 break-all text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200'
  const agentLinkClassName = 'underline underline-offset-2 decoration-blue-300 break-all text-blue-600 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-200'
  const agentName = msg.senderName || assignedAgent?.agentName || t('agent.defaultName')
  const agentAvatar = msg.senderAvatar || assignedAgent?.agentAvatar || ''
  const reactionLabel = t('reactions.add')
  const getReactionLabel = (emoji, active) =>
    active
      ? t('reactions.remove', { emoji })
      : t('reactions.reactWith', { emoji })

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-3 py-1 rounded-full">
          {getLocalizedSystemMessage(msg, t, i18n.resolvedLanguage || i18n.language)}
        </span>
      </div>
    )
  }

  const timeLocale = i18n.language === 'en' ? 'en-US' : 'vi-VN'
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' }) : ''

  if (isCustomer) {
    return (
      <div className={`flex justify-end items-end gap-2 group ${msg.isOptimistic ? 'opacity-60' : ''}`}>
        {!msg.isOptimistic && (
          <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
            {formatTime(msg.createdAt)}
          </span>
        )}
        <ChatReactionPicker
          actor={reactionActor}
          align="right"
          className="mb-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
          label={reactionLabel}
          getReactionLabel={getReactionLabel}
          message={msg}
          onReact={onReactToMessage}
        />
        {isImage ? (
          <div className="flex w-fit max-w-[75%] flex-col items-end">
            <ImageMessageContent
              msg={msg}
              imageAlt={t('defaults.imageAlt')}
              senderName={msg.senderName || t('defaults.you')}
              onOpenImagePreview={onOpenImagePreview}
              captionClassName="bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed whitespace-pre-wrap break-words"
            />
            <ChatReactionSummary
              actor={reactionActor}
              align="right"
              getReactionLabel={getReactionLabel}
              message={msg}
              onReact={onReactToMessage}
            />
          </div>
        ) : (
          <div className="flex w-fit max-w-[75%] flex-col items-end">
            <div className="w-fit bg-blue-600 text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words">
              {renderTextWithLinks(msg.message, customerLinkClassName)}
            </div>
            <ChatReactionSummary
              actor={reactionActor}
              align="right"
              getReactionLabel={getReactionLabel}
              message={msg}
              onReact={onReactToMessage}
            />
          </div>
        )}
      </div>
    )
  }

  if (isBot) {
    const suggestions = msg.metadata?.suggestions || []
    return (
      <div className="flex justify-start items-end gap-2 group">
        {showAvatar ? (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="w-7 flex-shrink-0" />
        )}
        <div className="flex flex-col gap-0.5 max-w-[80%]">
          {showAvatar && (
            <span className="text-[10px] text-emerald-500 ml-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {msg.senderName || t('agent.botName')}
            </span>
          )}
          <div className="w-fit bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-emerald-100 dark:border-emerald-800/40 whitespace-pre-wrap break-words">
            {msg.isNew
              ? <TypewriterText text={msg.message} linkClassName={botLinkClassName} />
              : renderTextWithLinks(msg.message, botLinkClassName)}
          </div>
          <AgentActivityPanel msg={msg} />
          <ChatReactionSummary
            actor={reactionActor}
            align="left"
            getReactionLabel={getReactionLabel}
            message={msg}
            onReact={onReactToMessage}
          />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => onSuggestionClick?.(s)}
                  className="text-xs bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <ChatReactionPicker
          actor={reactionActor}
          align="right"
          className="mb-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
          label={reactionLabel}
          getReactionLabel={getReactionLabel}
          message={msg}
          onReact={onReactToMessage}
        />
        <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
          {formatTime(msg.createdAt)}
        </span>
      </div>
    )
  }

  return (
    <div className="flex justify-start items-end gap-2 group">
      {showAvatar ? (
        <AgentAvatar src={agentAvatar} name={agentName} />
      ) : (
        <div className="w-7 flex-shrink-0" />
      )}
      <div className="flex flex-col gap-0.5 max-w-[80%]">
        {showAvatar && (
          <span className="text-[10px] text-gray-400 ml-1">{agentName}</span>
        )}
        {isImage ? (
          <div className="flex w-fit flex-col items-start">
            <ImageMessageContent
              msg={msg}
              imageAlt={t('defaults.imageAlt')}
              senderName={agentName}
              onOpenImagePreview={onOpenImagePreview}
              captionClassName="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words"
            />
            <ChatReactionSummary
              actor={reactionActor}
              align="left"
              getReactionLabel={getReactionLabel}
              message={msg}
              onReact={onReactToMessage}
            />
          </div>
        ) : (
          <div className="flex w-fit flex-col items-start">
            <div className="w-fit bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm border border-gray-100 dark:border-gray-700 whitespace-pre-wrap break-words">
              {renderTextWithLinks(msg.message, agentLinkClassName)}
            </div>
            <ChatReactionSummary
              actor={reactionActor}
              align="left"
              getReactionLabel={getReactionLabel}
              message={msg}
              onReact={onReactToMessage}
            />
          </div>
        )}
      </div>
      <ChatReactionPicker
        actor={reactionActor}
        align="right"
        className="mb-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100"
        label={reactionLabel}
        getReactionLabel={getReactionLabel}
        message={msg}
        onReact={onReactToMessage}
      />
      <span className="text-[10px] text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mb-1">
        {formatTime(msg.createdAt)}
      </span>
    </div>
  )
}
