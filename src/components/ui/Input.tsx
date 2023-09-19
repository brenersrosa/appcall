import * as React from 'react'
import { FieldError } from 'react-hook-form'

import { Text } from './Text'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  prefix?: string
  isInvalid?: boolean
  error?: FieldError
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, prefix, isInvalid = false, error = null, ...props }, ref) => {
    const invalidClass = isInvalid || error ? 'border-red-500' : ''

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
            'flex h-12 items-center rounded-md border border-zinc-900 bg-zinc-900 p-3 transition-all focus-within:border-violet-500',
            invalidClass,
          )}
        >
          <Text as="span" className="text-zinc-400">
            {prefix}
          </Text>

          <input
            type={type}
            className={cn(
              'flex w-full bg-zinc-900 leading-relaxed text-zinc-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && <span className='text-sm text-red-500 italic'>{error?.message}</span>}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
