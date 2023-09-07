import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-title font-bold text-zinc-50 leading-tight', {
  variants: {
    size: {
      xs: 'text-xl',
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-6xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: React.ElementType
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as, className, size, ...props }, ref) => {
    const Component = as || 'h2'

    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ className, size }), className)}
        {...props}
      />
    )
  },
)

Heading.displayName = 'Heading'

export { Heading }
