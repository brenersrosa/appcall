import {
  ButtonHTMLAttributes,
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
} from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  onClick?: () => void
}

const CalendarStepButtonBase: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonProps
> = ({ children, onClick, ...rest }, ref) => {
  return (
    <button
      className="flex h-10 w-full items-center justify-center rounded-lg bg-zinc-700 transition-colors hover:bg-zinc-600 disabled:cursor-default disabled:bg-transparent disabled:opacity-40"
      onClick={onClick}
      ref={ref}
      {...rest}
    >
      {children}
    </button>
  )
}

export const CalendarStepButton = forwardRef(CalendarStepButtonBase)
