import clsx from 'clsx'
import { CalendarPlus, UsersThree } from 'phosphor-react'

interface WidgetIconProps {
  type: string
  asRead: boolean
}

export function WidgetIcon({ type, asRead = false }: WidgetIconProps) {
  return (
    <div className="relative">
      <div
        className={clsx('', {
          'absolute -right-2 top-2 h-2 w-2 rounded-full bg-red-500': !asRead,
        })}
      ></div>
      {type === 'friend_request' && (
        <UsersThree className="mt-4 h-6 w-6 text-violet-500" />
      )}
      {type === 'appointment' && (
        <CalendarPlus className="mt-4 h-6 w-6 text-violet-500" />
      )}
    </div>
  )
}
