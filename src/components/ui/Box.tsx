import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const boxVariants = cva('p-6 rounded-lg bg-zinc-800 border border-zinc-700')

interface BoxProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof boxVariants> {}

const Box = React.forwardRef<HTMLParagraphElement, BoxProps>(
  ({ className, ...props }, ref) => {
    const Component = 'div'

    return (
      <Component
        ref={ref}
        className={cn(boxVariants({ className }), className)}
        {...props}
      />
    )
  },
)

Box.displayName = 'Box'

export { Box }
