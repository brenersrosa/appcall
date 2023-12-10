import * as React from 'react'
import { FieldError } from 'react-hook-form'

import { Text } from './Text'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: FieldError
  limit?: number
  totalCharacters?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error = null, limit = 1000, totalCharacters, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex w-full flex-col gap-2',
          props.disabled && 'opacity-50',
        )}
      >
        {label && (
          <Text as="span" size="sm">
            {label}
          </Text>
        )}

        <div
          className={cn(
            'flex flex-col gap-2 rounded-md border border-zinc-900 bg-zinc-900 p-3 focus-within:border-violet-500',
            error?.message && 'focus-within:border-red-500',
          )}
        >
          <textarea
            maxLength={limit}
            className={cn(
              'flex min-h-[72px] w-full resize-none rounded-md bg-zinc-900 leading-relaxed text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            ref={ref}
            {...props}
          />

          <span className="flex flex-1 justify-end px-2 text-xs text-zinc-400">
            {totalCharacters}/{limit} caracteres
          </span>
        </div>
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
