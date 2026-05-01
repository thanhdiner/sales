import { useMemo, useState } from 'react'
import { SmilePlus } from 'lucide-react'

import {
  CHAT_REACTION_OPTIONS,
  getChatReactionGroups
} from '@/utils/chatMessage'

const basePickerButtonClass =
  'inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-400 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-300'

const getEmojiButtonClass = active =>
  `inline-flex h-8 w-8 items-center justify-center rounded-full text-base transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800 ${
    active ? 'bg-blue-50 dark:bg-blue-950/50' : ''
  }`

function canReactToMessage(message, disabled) {
  return Boolean(message?._id && !message.isOptimistic && !disabled)
}

export function ChatReactionPicker({
  actor,
  align = 'left',
  className = '',
  disabled = false,
  getReactionLabel,
  label = 'React',
  message,
  onReact
}) {
  const [open, setOpen] = useState(false)
  const groups = useMemo(() => getChatReactionGroups(message, actor), [actor, message])
  const activeEmoji = groups.find(group => group.active)?.emoji
  const canReact = canReactToMessage(message, disabled)
  const placementClass = align === 'right' ? 'right-0' : 'left-0'

  if (!canReact) return null

  const handleReact = emoji => {
    onReact?.(message, emoji)
    setOpen(false)
  }

  return (
    <div
      className={`relative shrink-0 ${className}`}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className={basePickerButtonClass}
        aria-label={label}
        title={label}
      >
        <SmilePlus className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          className={`absolute bottom-full z-30 mb-1 grid w-[7.25rem] grid-cols-3 gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${placementClass}`}
          onMouseDown={event => event.preventDefault()}
        >
          {CHAT_REACTION_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleReact(emoji)}
              className={getEmojiButtonClass(activeEmoji === emoji)}
              aria-label={getReactionLabel?.(emoji, activeEmoji === emoji) || `${label} ${emoji}`}
              title={getReactionLabel?.(emoji, activeEmoji === emoji) || `${label} ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChatReactionSummary({
  actor,
  align = 'left',
  className = '',
  disabled = false,
  getReactionLabel,
  message,
  onReact
}) {
  const groups = useMemo(() => getChatReactionGroups(message, actor), [actor, message])
  const canReact = canReactToMessage(message, disabled)

  if (groups.length === 0) return null

  return (
    <div className={`mt-1 flex ${align === 'right' ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`flex flex-wrap items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {groups.map(group => (
          <button
            key={group.emoji}
            type="button"
            disabled={!canReact}
            onClick={() => canReact && onReact?.(message, group.emoji)}
            className={`inline-flex h-6 items-center gap-1 rounded-full border px-2 text-xs font-semibold shadow-sm transition disabled:cursor-default ${
              group.active
                ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                : 'border-gray-200 bg-white/90 text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-300'
            }`}
            aria-label={getReactionLabel?.(group.emoji, group.active) || `${group.emoji} ${group.count}`}
            title={getReactionLabel?.(group.emoji, group.active) || `${group.emoji} ${group.count}`}
          >
            <span>{group.emoji}</span>
            <span>{group.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
