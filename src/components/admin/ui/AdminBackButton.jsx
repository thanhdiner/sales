import { isValidElement } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

const sizeClasses = {
  sm: 'gap-1.5 text-xs',
  md: 'gap-2 text-sm',
  lg: 'gap-2.5 text-base'
}

const iconSizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5'
}

const variantClasses = {
  text: 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]',
  ghost: 'rounded-lg px-3 py-2 text-[var(--admin-text-muted)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]',
  outline: 'rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:bg-[var(--admin-surface-2)] hover:text-[var(--admin-text)]'
}

export default function AdminBackButton({
  label = 'Quay lại',
  to,
  onClick,
  icon = ArrowLeft,
  className,
  iconClassName,
  variant = 'text',
  size = 'md',
  disabled = false,
  replace = false,
  state,
  children,
  ...props
}) {
  const navigate = useNavigate()
  const { tabIndex, ...restProps } = props
  const content = children ?? label
  const resolvedIconClassName = cn(iconSizeClasses[size] || iconSizeClasses.md, 'shrink-0', iconClassName)
  const buttonClassName = cn(
    'inline-flex items-center break-words text-left font-medium transition-colors',
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.text,
    disabled && 'pointer-events-none opacity-50',
    className
  )
  const iconNode = icon
    ? isValidElement(icon)
      ? icon
      : (() => {
          const Icon = icon
          return <Icon className={resolvedIconClassName} />
        })()
    : null

  const handleClick = event => {
    if (disabled) return

    if (onClick) {
      onClick(event)
      return
    }

    navigate(-1)
  }

  if (to) {
    const handleLinkClick = event => {
      if (disabled) {
        event.preventDefault()
        return
      }

      onClick?.(event)
    }

    return (
      <Link
        to={to}
        replace={replace}
        state={state}
        className={buttonClassName}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={handleLinkClick}
        {...restProps}
      >
        {iconNode}
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={buttonClassName} onClick={handleClick} disabled={disabled} tabIndex={tabIndex} {...restProps}>
      {iconNode}
      {content}
    </button>
  )
}
