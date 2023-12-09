import Image from 'next/image'
import Link from 'next/link'
import { Check, X, Users } from 'phosphor-react'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'

enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  APPOINTMENT = 'appointment',
}

enum NotificationAction {
  AS_READ = 'as_read',
  REMOVE_NOTIFICATION = 'remove_notification',
}

interface CardFriendshipProps {
  type: NotificationType
  asRead: boolean
  avatarUrl: string
  avatarAlt: string
  name: string
  username: string
  notificationId: string
  onNotificationAction: (
    notificationId: string,
    action: NotificationAction,
  ) => void
}

export function CardNotification({
  type,
  asRead,
  avatarUrl,
  avatarAlt,
  name,
  username,
  notificationId,
  onNotificationAction,
}: CardFriendshipProps) {
  async function handleNotificationAction(action: NotificationAction) {
    try {
      onNotificationAction(notificationId, action)
    } catch (error) {
      console.error(
        `ERROR | Error during ${action} notification request:`,
        error,
      )
    }
  }

  return (
    <div className="flex items-center justify-between gap-5 rounded-md border border-zinc-600 p-4 transition-colors hover:border-violet-500">
      <div className="flex gap-5 divide-x divide-zinc-600">
        <Image
          src={avatarUrl}
          alt={avatarAlt}
          width={56}
          height={56}
          className="rounded-full"
        />

        <div className="gap-1 pl-5">
          <Text className="font-semibold text-zinc-50" size="lg">
            {name}
          </Text>
          <Link
            href={`/schedule/${username}`}
            className="text-sm text-zinc-200 transition-colors hover:text-violet-200"
          >
            @{username}
          </Link>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          icon={Check}
          onClick={() => handleNotificationAction(NotificationAction.AS_READ)}
        />
        <Button
          icon={X}
          variant="destructive"
          onClick={() =>
            handleNotificationAction(NotificationAction.REMOVE_NOTIFICATION)
          }
        />
      </div>
    </div>
  )
}
