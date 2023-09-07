import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'flex items-center gap-2 min-w-[172px] justify-center rounded-md font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-zinc-600',
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
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
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
