import * as React from 'react'

import { Text } from './Text'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
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

        <textarea
          className={cn(
            'flex min-h-[200px] w-full resize-none rounded-md border border-zinc-900 bg-zinc-900 p-3 leading-relaxed text-zinc-50 placeholder:text-zinc-400 focus-within:border-violet-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
