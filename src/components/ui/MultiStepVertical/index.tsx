import { cn } from '@/lib/utils'
import { Step } from './Step'

interface Step {
  title: string
  description: string
}

interface MultiStepVerticalProps {
  currentStep: number
  steps: Step[]
}

export function MultiStepVertical({
  currentStep,
  steps,
}: MultiStepVerticalProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.title} className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <Step
              index={i + 1}
              description={step.description}
              variant={
                currentStep === i + 1
                  ? 'current'
                  : currentStep > i + 1
                  ? 'checked'
                  : 'default'
              }
            />
          </div>

          {i < steps.length - 1 && (
            <div className="mb-2 flex h-[100px] w-[50px] items-center justify-center">
              <div
                className={cn(
                  'h-full w-[3px] rounded-full',
                  currentStep > i + 1 && 'bg-violet-500',
                  currentStep <= i + 1 && 'bg-zinc-200',
                )}
              ></div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
