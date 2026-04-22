import { Bot, Lock } from 'lucide-react'

import { hasChatImages } from '@/utils/chatMessage'
import { renderTextWithLinks } from '@/utils/renderTextWithLinks'

import { dayjs } from '../utils'

function ChatImage({ src, alt }) {
  return (
    <a href={src} target="_blank" rel="noreferrer" className="block">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block max-h-80 w-auto max-w-[260px] rounded-2xl object-cover shadow-sm ring-1 ring-black/5"
      />
    </a>
  )
}

function ImageMessageContent({ message, captionClassName }) {
  return (
    <div className="space-y-2">
      <ChatImage src={message.imageUrl} alt={message.message || 'Ảnh chat'} />
      {message.message ? (
        <div className={captionClassName}>
          {renderTextWithLinks(message.message, 'break-all underline underline-offset-2')}
        </div>
      ) : null}
    </div>
  )
}

export default function AgentMessageBubble({ message }) {
  const isAgent = message.sender === 'agent'
  const isCustomer = message.sender === 'customer' || message.sender === 'guest'
  const isSystem = message.type === 'system' || message.sender === 'system'
  const isInternalNote = message.type === 'note' || message.isInternal
  const isImageMessage = message.type === 'image' && hasChatImages(message)
  const timeLabel = dayjs(message.createdAt).format('HH:mm')

  const noteLinkClassName =
    'break-all underline decoration-amber-400 underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200'
  const customerLinkClassName =
    'break-all text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200'
  const agentLinkClassName = 'break-all underline decoration-white/70 underline-offset-2 hover:text-blue-100'

  if (isSystem) {
    return (
      <div className="my-3 flex justify-center">
        <span className="rounded-full border border-gray-200 bg-gray-100 px-4 py-1.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {message.message}
        </span>
      </div>
    )
  }

  if (isInternalNote) {
    return (
      <div className={`flex justify-end ${message.isOptimistic ? 'opacity-60' : ''}`}>
        <div className="max-w-[70%] rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-amber-500">
            <Lock className="h-3 w-3" />
            Ghi chú nội bộ
            {!message.isOptimistic && `· ${timeLabel}`}
          </div>
          {renderTextWithLinks(message.message, noteLinkClassName)}
        </div>
      </div>
    )
  }

  if (isCustomer) {
    return (
      <div className="group flex items-end gap-2">
        <div className="mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-bold text-white">
          {(message.senderName || 'K')[0].toUpperCase()}
        </div>
        <div className="max-w-[65%]">
          <p className="mb-0.5 ml-1 text-[10px] text-gray-400">{message.senderName}</p>
          {isImageMessage ? (
            <ImageMessageContent
              message={message}
              captionClassName="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm whitespace-pre-wrap break-words dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          ) : (
            <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm whitespace-pre-wrap break-words dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
              {renderTextWithLinks(message.message, customerLinkClassName)}
            </div>
          )}
        </div>
        <span className="mb-0.5 self-end text-[10px] text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600">
          {timeLabel}
        </span>
      </div>
    )
  }

  if (isAgent) {
    return (
      <div className={`group flex items-end justify-end gap-2 ${message.isOptimistic ? 'opacity-60' : ''}`}>
        {!message.isOptimistic && (
          <span className="mb-0.5 self-end text-[10px] text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600">
            {timeLabel}
          </span>
        )}
        <div className="max-w-[65%]">
          {isImageMessage ? (
            <ImageMessageContent
              message={message}
              captionClassName="w-fit rounded-2xl rounded-br-sm bg-blue-600 px-3.5 py-2.5 text-sm text-white shadow-sm whitespace-pre-wrap break-words"
            />
          ) : (
            <div className="w-fit rounded-2xl rounded-br-sm bg-blue-600 px-3.5 py-2.5 text-sm text-white shadow-sm whitespace-pre-wrap break-words">
              {renderTextWithLinks(message.message, agentLinkClassName)}
            </div>
          )}
        </div>
        <div className="mb-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
          <Bot className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return null
}
