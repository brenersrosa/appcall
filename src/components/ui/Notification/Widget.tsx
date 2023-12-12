import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import moment from 'moment'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { ButtonActions } from './ButtonActions'
import { WidgetIcon } from './WidgetIcon'

import { Scheduling, User } from '@prisma/client'

enum NotificationAction {
  MARK_AS_READ = 'mark_as_read',
  REMOVE_NOTIFICATION = 'remove_notification',
}

enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  APPOINTMENT = 'appointment',
  CANCEL_APPOINTMENT = 'cancel_appointment',
}

interface WidgetProps {
  id: string
  type: NotificationType
  as_read: boolean
  created_at: Date
  user: User
  sender: User
  scheduling: Scheduling
  onNotificationAction: (
    notificationId: string,
    asRead: boolean,
    action: NotificationAction,
  ) => void
}

export function Widget({
  id,
  type,
  as_read,
  created_at,
  user,
  sender,
  scheduling,
  onNotificationAction,
}: WidgetProps) {
  dayjs.locale('pt-br')

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isHovered = id === hoveredItem

  const handleMouseEnter = (notificationId: string) => {
    setHoveredItem(notificationId)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  async function handleNotificationAction(action: NotificationAction) {
    try {
      onNotificationAction(id, as_read, action)
    } catch (error) {
      console.error(`ERROR | Error during ${action} friend request:`, error)
    }
  }

  function formatTimeAgo(date: Date): string {
    const currentDate = moment()
    const targetDate = moment(date)
    const diffDuration = moment.duration(currentDate.diff(targetDate))

    const diffMonths = diffDuration.months()
    const diffDays = diffDuration.days()
    const diffHours = diffDuration.hours()
    const diffMinutes = diffDuration.minutes()

    if (diffMonths > 0) {
      return `há ${diffMonths} meses`
    } else if (diffDays > 0) {
      return `há ${diffDays} dias`
    } else if (diffHours > 0) {
      return `há ${diffHours} horas`
    } else {
      if (diffMinutes <= 0) {
        return 'Agora'
      } else if (diffMinutes === 1) {
        return `há ${diffMinutes} minuto`
      } else {
        return `há ${diffMinutes} minutos`
      }
    }
  }

  return (
    <div className="max-h-96 overflow-y-scroll">
      <div key={id} className="">
        {type === NotificationType.FRIEND_REQUEST && (
          <div
            className="flex items-start gap-6 bg-zinc-900 px-8 py-4 hover:bg-zinc-800"
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href={`/friends/${user.username}`}
              className="flex items-start gap-6"
            >
              <WidgetIcon type={type} asRead={as_read} />

              <div className="flex flex-1 flex-col gap-2">
                <p
                  className={clsx('bold leading-relaxed text-zinc-200', {
                    'line-clamp-1': isHovered === true,
                  })}
                >
                  {`${sender.name} enviou uma solicitação de amizade.`}
                </p>
                <div className="flex flex-col items-start gap-2 text-sm text-zinc-400">
                  <span>Solicitação de amizade</span>
                  <span className="flex items-center justify-start gap-1 text-xs italic text-zinc-400">
                    {formatTimeAgo(created_at)}
                  </span>
                </div>
              </div>

              {isHovered && (
                <div className="flex gap-2 self-center">
                  <ButtonActions
                    variant="close"
                    onClick={() =>
                      handleNotificationAction(
                        NotificationAction.REMOVE_NOTIFICATION,
                      )
                    }
                  />
                  <ButtonActions
                    variant="check"
                    onClick={() =>
                      handleNotificationAction(NotificationAction.MARK_AS_READ)
                    }
                  />
                </div>
              )}
            </Link>
          </div>
        )}

        {type === NotificationType.APPOINTMENT && (
          <div
            className="flex items-start gap-6 bg-zinc-900 px-8 py-4 hover:bg-zinc-800"
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={handleMouseLeave}
          >
            <WidgetIcon type={type} asRead={as_read} />

            <div className="flex flex-1 flex-col gap-2">
              <p
                className={clsx('bold text-zinc-200', {
                  'line-clamp-1': isHovered === true,
                })}
              >
                {`${sender.name} realizou um agendamento.`}
              </p>
              <div className="flex flex-col items-start gap-2 text-sm text-zinc-400">
                <span
                  className={clsx('', {
                    'line-clamp-2': isHovered === true,
                  })}
                >
                  Reunião marcada na{' '}
                  {dayjs(scheduling?.date).format(
                    'dddd, DD [de] MMMM [às] HH:mm[h]',
                  )}
                </span>
                <span className="flex items-center justify-start gap-1 text-xs italic text-zinc-400">
                  {formatTimeAgo(created_at)}
                </span>
              </div>
            </div>

            {isHovered && (
              <div className="flex gap-2 self-center">
                <ButtonActions
                  variant="close"
                  onClick={() =>
                    handleNotificationAction(
                      NotificationAction.REMOVE_NOTIFICATION,
                    )
                  }
                />
                <ButtonActions
                  variant="check"
                  onClick={() =>
                    handleNotificationAction(NotificationAction.MARK_AS_READ)
                  }
                />
              </div>
            )}
          </div>
        )}

        {type === NotificationType.CANCEL_APPOINTMENT && (
          <div
            className="flex items-start gap-6 bg-zinc-900 px-8 py-4 hover:bg-zinc-800"
            onMouseEnter={() => handleMouseEnter(id)}
            onMouseLeave={handleMouseLeave}
          >
            <WidgetIcon type={type} asRead={as_read} />

            <div className="flex flex-1 flex-col gap-2">
              <p
                className={clsx('bold text-zinc-200', {
                  'line-clamp-1': isHovered === true,
                })}
              >
                {`${sender.name} cancelou um agendamento.`}
              </p>
              <div className="flex flex-col items-start gap-2 text-sm text-zinc-400">
                <span
                  className={clsx('', {
                    'line-clamp-2': isHovered === true,
                  })}
                >
                  Cancelada a reunião marcada na{' '}
                  {dayjs(scheduling?.date).format(
                    'dddd, DD [de] MMMM [às] HH:mm[h]',
                  )}
                </span>
                <span className="flex items-center justify-start gap-1 text-xs italic text-zinc-400">
                  {formatTimeAgo(created_at)}
                </span>
              </div>
            </div>

            {isHovered && (
              <div className="flex gap-2 self-center">
                <ButtonActions
                  variant="close"
                  onClick={() =>
                    handleNotificationAction(
                      NotificationAction.REMOVE_NOTIFICATION,
                    )
                  }
                />
                <ButtonActions
                  variant="check"
                  onClick={() =>
                    handleNotificationAction(NotificationAction.MARK_AS_READ)
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
