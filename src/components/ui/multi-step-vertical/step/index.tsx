import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleWavyCheck } from 'phosphor-react'
import colors from 'tailwindcss/colors'

import { Heading } from '../Heading'
import { Text } from '../Text'

import { cn } from '@/lib/utils'

const stepVariants = cva(
  'flex h-[50px] w-[50px] items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-zinc-200',
        current: 'bg-violet-500 shadow-violet',
        checked: 'bg-violet-500 text-zinc-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface StepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepVariants> {
  index: number
  description: string
}

const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, variant, index, description, ...props }, ref) => {
    const Comp = 'div'

    return (
      <>
        <div className="flex flex-col items-end justify-center">
          <Heading as="strong">Passo {index}</Heading>
          <Text>{description}</Text>
        </div>

        <Comp
          className={cn(stepVariants({ variant, className }))}
          {...props}
          ref={ref}
        >
          {variant === 'checked' && (
            <CircleWavyCheck size={24} color={colors.zinc[50]} />
          )}
        </Comp>
      </>
    )
  },
)

Step.displayName = 'Step'

export { Step, stepVariants }
