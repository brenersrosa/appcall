import clsx from 'clsx'
import { Check, Envelope, X } from 'phosphor-react'

interface ButtonActionsProps {
  variant: 'close' | 'check'
  asRead?: boolean
  onClick?: () => void
}

export function ButtonActions({
  variant,
  asRead,
  onClick,
}: ButtonActionsProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded transition-colors',
        {
          'bg-zinc-400 hover:bg-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-700':
            variant === 'close',
          'bg-violet-500 hover:bg-violet-600': variant === 'check',
        },
      )}
    >
      {variant === 'close' ? (
        <X className="h-3 text-zinc-50" />
      ) : (
        <Check className="h-3 text-zinc-50" />
      )}
    </button>
  )
}
