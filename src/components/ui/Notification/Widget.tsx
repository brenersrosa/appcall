import { useEffect, useState } from 'react'
import moment from 'moment'

import { ButtonActions } from './ButtonActions'
import { WidgetIcon } from './WidgetIcon'

import { Checks } from 'phosphor-react'
import clsx from 'clsx'
import { Heading } from '../Heading'
import { Button } from '../Button'
import { Text } from '../Text'

const notifications = [
  {
    id: '59d73668-1422-11ee-be56-0242ac120002',
    description:
      'Um novo vídeo de Mayk Brito foi publicado no ExpertsClub! Vem conferir!',
    type: 'friend_request',
    date: '2023-06-27T23:55:00.000Z',
    asRead: true,
  },
  {
    id: '60fddf46-1422-11ee-be56-0242ac120002',
    description:
      'Você recebeu um convite para fazer parte da empresa Rocketseat.',
    type: 'friend_request',
    date: '2023-06-27T23:50:00.000Z',
    asRead: true,
  },
  {
    id: '67266e38-1422-11ee-be56-0242ac120002',
    description:
      'Você foi mencionado no tópico "NextJS é o novo PHP?", por Diego Fernandes.',
    type: 'appointment',
    date: '2023-06-27T14:15:00.000Z',
    asRead: true,
  },
  {
    id: '6f804ae0-1422-11ee-be56-0242ac120002',
    description: 'Flávia Oliveira e mais 5 pessoas gostaram do seu comentário.',
    type: 'friend_request',
    date: '2023-06-18T06:53:20.000Z',
    asRead: true,
  },
  {
    id: '732819fc-1422-11ee-be56-0242ac120002',
    description: 'Novas aulas disponíveis no Ignite React JS. Venha conferir!',
    type: 'appointment',
    date: '2023-06-17T01:07:10.000Z',
    asRead: true,
  },
]

export function Widget() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  // const [notifications, setNotifications] = useState<NotificationProps[]>([])

  const handleMouseEnter = (notificationId: string) => {
    setHoveredItem(notificationId)
  }

  const handleMouseLeave = () => {
    setHoveredItem(null)
  }

  return (
    <div className="w-[448px] overflow-hidden rounded border border-zinc-700">
      <div className="flex items-center justify-between bg-zinc-800 px-6 py-4">
        <Heading size="sm">Notificações</Heading>
        <Button
          // onClick={() => ()}
          variant="link"
          className="text-zinc-400"
        >
          Marcar todas como lidas <Checks className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <div className="divide-x divide-zinc-700 bg-zinc-950 px-5 py-2 text-sm font-medium text-zinc-400">
          Recentes
        </div>
        {notifications.map((notification) => {
          const isHovered = notification.id === hoveredItem
          const shouldRender =
            moment().diff(moment(notification.date), 'minutes') <= 15

          if (shouldRender) {
            return (
              <div key={notification.id} className="divide-y-2 divide-zinc-950">
                <div
                  className="flex items-start gap-6 bg-zinc-900 px-8 py-4"
                  onMouseEnter={() => handleMouseEnter(notification.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <WidgetIcon
                    type={notification.type}
                    asRead={notification.asRead}
                  />

                  <div className="flex flex-1 flex-col gap-2">
                    <p
                      className={clsx('text-sm leading-relaxed text-zinc-400', {
                        'line-clamp-2': isHovered === true,
                      })}
                    >
                      {notification.description}
                    </p>
                    <div className="text-xxs flex items-center gap-1 text-zinc-400">
                      <span>
                        {notification.type === 'friend_request' &&
                          'Solicitação de amizade'}
                        {notification.type === 'appointment' &&
                          'Convite para reunião'}
                      </span>
                      {/* <span> - {formatTimeAgo(notification.date)}</span> */}
                    </div>
                  </div>

                  {isHovered && (
                    <div className="flex gap-2 self-center">
                      <ButtonActions variant="close" />
                      <ButtonActions
                        variant="check"
                        asRead={notification.asRead}
                        // onClick={() =>
                        //   handleNotificationAsRead(notification.id)
                        // }
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      <div>
        <div className="bg-zinc-950 px-5 py-2 text-sm font-medium text-zinc-400">
          Antigas
        </div>

        {notifications.map((notification) => {
          const isHovered = notification.id === hoveredItem
          const shouldRender =
            moment().diff(moment(notification.date), 'minutes') > 15

          if (shouldRender) {
            return (
              <div key={notification.id} className="">
                <div
                  className="flex items-start gap-6 bg-zinc-900 px-8 py-4 hover:bg-zinc-800"
                  onMouseEnter={() => handleMouseEnter(notification.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <WidgetIcon
                    type={notification.type}
                    asRead={notification.asRead}
                  />

                  <div className="flex flex-1 flex-col gap-2">
                    <Text size="sm" className="line-clamp-2">
                      {notification.description}
                    </Text>

                    <div className="text-xxs flex items-center gap-1 text-zinc-400">
                      <Text className="text-zinc-400">
                        {notification.type === 'friend_request' &&
                          'Solicitação de amizade'}
                        {notification.type === 'appointment' &&
                          'Convite para reunião'}
                      </Text>
                      {/* <Text size="sm"> - {formatTimeAgo(notification.date)}</Text size="sm"> */}
                    </div>
                  </div>

                  {isHovered && (
                    <div className="flex gap-2 self-center">
                      <ButtonActions variant="close" />
                      <ButtonActions
                        variant="check"
                        asRead={notification.asRead}
                        // onClick={() =>
                        //   handleNotificationAsRead(notification.id)
                        // }
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
