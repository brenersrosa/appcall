import { useEffect, useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { Bell, CaretLeft, Checks, SignOut } from 'phosphor-react'
import clsx from 'clsx'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@radix-ui/react-dropdown-menu'

import { Heading } from '../ui/Heading'
import { Widget } from '../ui/Notification/Widget'
import { Text } from '../ui/Text'
import { Button } from '../ui/Button'
import { Loading } from '../ui/Loading'

import { api } from '@/lib/axios'
import { Scheduling, User } from '@prisma/client'

interface HeaderProps {
  title: string
}

enum NotificationAction {
  MARK_AS_READ = 'mark_as_read',
  MARK_ALL_AS_READ = 'mark_all_as_read',
  REMOVE_NOTIFICATION = 'remove_notification',
}

enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  APPOINTMENT = 'appointment',
}

export interface NotificationProps {
  id: string
  type: NotificationType
  as_read: boolean
  created_at: Date
  updated_at: Date
  user_id: string
  sender_id: string
  user: User
  sender: User
  scheduling: Scheduling
}

export function Header({ title }: HeaderProps) {
  const [notificationsList, setNotificationsList] =
    useState<NotificationProps[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  const session = useSession()
  const user = session.data?.user
  const router = useRouter()

  useEffect(() => {
    const currentPath = window.location.pathname
    const pathLevels = currentPath.split('/')

    if (
      pathLevels.length > 2 &&
      window.location.pathname.includes('/schedule')
    ) {
      setIsButtonEnabled(true)
    } else {
      setIsButtonEnabled(false)
    }
  }, [])

  async function handleSignOut() {
    await signOut()

    await router.push('/')
  }

  const { data: notifications } = useQuery<NotificationProps[]>(
    ['notifications', user?.username],
    async () => {
      const response = await api.get(
        `/users/${user?.username}/list-notifications`,
      )

      return response.data.notifications
    },
    {
      refetchOnWindowFocus: true,
    },
  )

  useEffect(() => {
    if (notifications) {
      setNotificationsList(notifications)
    }
  }, [notifications])

  async function handleNotificationAction(
    notificationId: string | null,
    asRead: boolean,
    action: NotificationAction,
  ) {
    setIsLoading(true)

    try {
      let response

      switch (action) {
        case NotificationAction.MARK_AS_READ:
          response = await api.put('/users/notifications/update', {
            notificationId,
            asRead,
          })
          break

        case NotificationAction.MARK_ALL_AS_READ:
          response = await api.put('/users/notifications/all-as-read', {
            userId: user?.id,
          })
          break

        case NotificationAction.REMOVE_NOTIFICATION:
          response = await api.delete(
            `/users/notifications/delete?id=${notificationId}`,
          )
          break

        default:
          setIsLoading(false)
          return
      }

      if (response.status === 200) {
        setNotificationsList((prevNotificationsList) =>
          (prevNotificationsList || [])
            .map((notification) => {
              if (notification.id === notificationId) {
                if (action === NotificationAction.MARK_AS_READ) {
                  return {
                    ...notification,
                    as_read: !asRead,
                  } as NotificationProps
                }
              }

              if (action === NotificationAction.MARK_ALL_AS_READ) {
                return {
                  ...notification,
                  as_read: true,
                } as NotificationProps
              }

              return notification
            })
            .filter(
              (notification) =>
                action !== NotificationAction.REMOVE_NOTIFICATION ||
                notification.id !== notificationId,
            ),
        )
      }
    } catch (error) {
      console.error(
        `ERROR | Error during ${action} notification action:`,
        error,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-9 flex h-[120px] items-center justify-between border-b border-zinc-600">
      <div className="flex items-center gap-4">
        {isButtonEnabled === true && (
          <Button icon={CaretLeft} onClick={() => router.back()} />
        )}

        <Heading>{title}</Heading>
      </div>

      <div className="flex items-center justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative">
            <div
              className={clsx('', {
                'absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500':
                  notificationsList &&
                  notificationsList.find(
                    (notifications) => notifications.as_read === false,
                  ),
              })}
            ></div>
            <Bell className="h-5 w-5 text-zinc-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 mx-6 my-4 rounded border border-zinc-700 bg-zinc-900">
            <div className="w-[448px] rounded">
              <div className="flex items-center justify-between bg-zinc-800 px-6 py-4">
                <Heading size="sm">Notificações</Heading>
                <Button
                  onClick={() =>
                    handleNotificationAction(
                      null,
                      true,
                      NotificationAction.MARK_ALL_AS_READ,
                    )
                  }
                  variant="link"
                  className="text-zinc-400"
                >
                  Marcar todas como lidas <Checks className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-96 overflow-y-scroll">
                {notificationsList !== undefined ? (
                  notificationsList.map((notification) => (
                    <Widget
                      key={notification.id}
                      id={notification.id}
                      type={notification.type}
                      as_read={notification.as_read}
                      created_at={notification.created_at}
                      user={notification.user}
                      sender={notification.sender}
                      scheduling={notification.scheduling}
                      onNotificationAction={handleNotificationAction}
                    />
                  ))
                ) : (
                  <div className="flex h-96 w-full items-center justify-center bg-zinc-900">
                    <Loading />
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2 divide-x divide-zinc-400">
          <div className="flex items-center justify-center gap-2 pl-2">
            <Text>{session.data?.user.name}</Text>

            <Image
              src={session.data?.user.avatar_url || ''}
              alt={session.data?.user.name || 'User profile image.'}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          <button onClick={handleSignOut} className="pl-2">
            <SignOut className="h-5 w-5 text-zinc-200" />
          </button>
        </div>
      </div>
    </div>
  )
}
