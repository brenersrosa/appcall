import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center gap-2 justify-center h-12 border-none rounded-md font-medium transition-all disabled:pointer-events-none disabled:bg-zinc-600/70',
  {
    variants: {
      variant: {
        primary:
          'bg-violet-500 text-zinc-50 hover:bg-violet-600 hover:shadow-violet',
        secondary:
          'bg-zinc-500 text-zinc-50 hover:bg-zinc-600 hover:shadow-zinc',
        destructive:
          'bg-red-500 text-zinc-50 hover:bg-red-600 hover:shadow-red',
        outline:
          'border border-violet-600 bg-transparent hover:bg-violet-600 hover:shadow-violet',
        ghost: 'hover:bg-violet-600 hover:shadow-violet',
        link: 'text-zinc-50 underline-offset-4 hover:underline',
        social: 'text-zinc-50',
      },
      size: {
        default: 'p-3',
        sm: 'p-2',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ElementType
  iconPosition?: 'left' | 'right'
  color?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon: Icon = () => null,
      iconPosition = 'right',
      color,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const colorClass = color ? `bg-${color}-500` : ''

    const hoverClass = color
      ? `hover:bg-${color}-600 hover:shadow-${color}`
      : ''

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          colorClass,
          hoverClass,
        )}
        ref={ref}
        {...props}
      >
        {iconPosition === 'left' && <Icon className="h-5 w-5 text-zinc-50" />}
        {props.children}
        {iconPosition === 'right' && <Icon className="h-5 w-5 text-zinc-50" />}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
