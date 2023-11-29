import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, X, Users } from 'phosphor-react'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'

import { FriendStatus } from '@prisma/client'
import { api } from '@/lib/axios'

enum FriendAction {
  SEND_REQUEST = 'send_request',
  ACCEPT_REQUEST = 'accept_request',
  REMOVE_FRIEND = 'remove_friend',
}

interface CardFriendshipProps {
  id: string
  status: FriendStatus
  link: string
  avatarUrl: string
  avatarAlt: string
  name: string
  username: string
  variant?: 'request' | 'accepted'
}

export function CardFriend({
  id,
  status,
  link,
  avatarUrl,
  avatarAlt,
  name,
  username, // variant = 'request',
}: CardFriendshipProps) {
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(status)
  const [isLoading, setIsLoading] = useState(false)
  const [isSender, setIsSender] = useState(false)
  const [isReceiver, setIsReceiver] = useState(false)

  const handleFriendAction = async (action: FriendAction) => {
    setIsLoading(true)
    try {
      let response
      switch (action) {
        case FriendAction.SEND_REQUEST:
          response = await api.post('/users/friend-request/create', {
            id,
          })
          if (response.status === 201) {
            setFriendStatus(FriendStatus.pending)
            setIsSender(true)
            setIsReceiver(false)
          }
          setIsLoading(false)
          break

        case FriendAction.ACCEPT_REQUEST:
          response = await api.put(`/users/friend-request/update`, {
            id,
            action: 'accept',
          })
          if (response.status === 200) {
            setFriendStatus(FriendStatus.accepted)
          }
          setIsLoading(false)
          break

        case FriendAction.REMOVE_FRIEND:
          response = await api.delete(`/users/friend-request/delete?id=${id}`)
          if (response.status === 200) {
            setFriendStatus(null)
          }
          setIsLoading(false)
          break

        default:
          setIsLoading(false)
          break
      }
    } catch (error) {
      console.error(`ERROR | Error during ${action} friend request:`, error)
      setIsLoading(false)
    }
  }

  return (
    <div
      // href={`/schedule/${link}`}
      className="flex items-center justify-between gap-5 rounded-md border border-zinc-600 p-4 transition-colors hover:border-violet-500"
    >
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
          <Text className="text-zinc-200" size="sm">
            @{username}
          </Text>
        </div>
      </div>

      {friendStatus === 'accepted' ? (
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
            // isLoading={isLoading}
          />
          <Button
            icon={X}
            variant="destructive"
            onClick={() => handleFriendAction(FriendAction.REMOVE_FRIEND)}
            // isLoading={isLoading}
          />
        </div>
      )}
    </div>
  )
}
