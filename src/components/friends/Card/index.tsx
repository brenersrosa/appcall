import Image from 'next/image'
import Link from 'next/link'
import { Check, X, Users } from 'phosphor-react'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'

enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

enum FriendAction {
  SEND_REQUEST = 'send_request',
  ACCEPT_REQUEST = 'accept_request',
  REMOVE_FRIEND = 'remove_friend',
  REJECT_REQUEST = 'remove_request',
}

interface CardFriendshipProps {
  status: FriendStatus
  avatarUrl: string
  avatarAlt: string
  name: string
  username: string
  variant?: 'request' | 'accepted'
  requestId: string
  onFriendAction: (requestId: string, action: FriendAction) => void
}

export function CardFriend({
  status,
  avatarUrl,
  avatarAlt,
  name,
  username,
  requestId,
  onFriendAction,
}: CardFriendshipProps) {
  async function handleFriendAction(action: FriendAction) {
    try {
      onFriendAction(requestId, action)
    } catch (error) {
      console.error(`ERROR | Error during ${action} friend request:`, error)
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

      {status === 'accepted' ? (
        <div>
          <Button
            className="min-w-[198px]"
            icon={Users}
            hoverIcon={X}
            iconPosition="left"
            hoverText="Desfazer amizade"
            onClick={() => handleFriendAction(FriendAction.REMOVE_FRIEND)}
          >
            Seguindo
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button
            icon={Check}
            onClick={() => handleFriendAction(FriendAction.ACCEPT_REQUEST)}
          />
          <Button
            icon={X}
            variant="destructive"
            onClick={() => handleFriendAction(FriendAction.REJECT_REQUEST)}
          />
        </div>
      )}
    </div>
  )
}
