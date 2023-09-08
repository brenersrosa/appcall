import * as React from 'react'

import { Text } from './Text'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  prefix?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, prefix, ...props }, ref) => {
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

        <div className="flex h-12 items-center rounded-lg border-2 border-zinc-900 bg-zinc-900 p-3 focus-within:border-violet-500">
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
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
