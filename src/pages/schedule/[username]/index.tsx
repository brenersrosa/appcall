import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Check, UserMinus, UserPlus, Users } from 'phosphor-react'
import { useEffect, useMemo, useState } from 'react'

import { DashboardLayout } from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils'

import ScheduleForm from './schedule-form'

enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

enum FriendAction {
  SEND_REQUEST = 'send_request',
  ACCEPT_REQUEST = 'accept_request',
  REMOVE_FRIEND = 'remove_friend',
}

interface ScheduleProps {
  user: {
    id: string
    name: string
    username: string
    bio: string
    avatarUrl: string
    schedulePrivate: boolean
  }
  userLoggedIn: {
    id: string
    name: string
    email: string
  }
  friend: {
    id: string
    userId: string
    friendId: string
    status: FriendStatus
  }
}

export default function Schedule({
  user,
  userLoggedIn,
  friend,
}: ScheduleProps) {
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(
    friend.status,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isSender, setIsSender] = useState(false)
  const [isReceiver, setIsReceiver] = useState(false)

  const isFriend = useMemo(
    () => friendStatus === FriendStatus.ACCEPTED,
    [friendStatus],
  )

  async function handleFriendAction(action: FriendAction) {
    setIsLoading(true)
    try {
      let response
      switch (action) {
        case FriendAction.SEND_REQUEST:
          response = await api.post('/users/friend-request/create', {
            friendId: user?.id,
          })
          if (response.status === 201) {
            setFriendStatus(FriendStatus.PENDING)
            setIsSender(true)
            setIsReceiver(false)
          }
          setIsLoading(false)
          break

        case FriendAction.ACCEPT_REQUEST:
          response = await api.put(`/users/friend-request/update`, {
            friendId: user?.id,
            action: 'accept',
          })
          if (response.status === 200) setFriendStatus(FriendStatus.ACCEPTED)
          setIsLoading(false)
          break

        case FriendAction.REMOVE_FRIEND:
          response = await api.delete(
            `/users/friend-request/delete?userLoggedId=${userLoggedIn.id}&friendId=${user?.id}`,
          )
          if (response.status === 200) setFriendStatus(null)
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

  useEffect(() => {
    if (friend.userId === userLoggedIn.id) {
      setIsSender(true)
      setIsReceiver(false)
    } else {
      setIsSender(false)
      setIsReceiver(true)
    }
  }, [friend, userLoggedIn])

  return (
    <DashboardLayout
      headerTitle="📅 Agende um horário"
      asSchedule={true}
      avatarUrl={user.avatarUrl || ''}
      name={user.name}
      tag={user.username}
      bio={user.bio}
      action={
        <Button
          iconPosition="left"
          icon={isFriend ? Users : UserPlus}
          hoverText={
            isFriend
              ? 'Remover amizade'
              : friendStatus === FriendStatus.PENDING &&
                !!isSender &&
                !isReceiver
              ? 'Cancelar envio'
              : friendStatus === FriendStatus.PENDING &&
                !isSender &&
                !!isReceiver
              ? 'Aceitar solicitação'
              : 'Enviar solicitação'
          }
          hoverIcon={
            isFriend
              ? UserMinus
              : friendStatus === FriendStatus.PENDING &&
                !!isSender &&
                !isReceiver
              ? UserMinus
              : friendStatus === FriendStatus.PENDING &&
                !isSender &&
                !!isReceiver
              ? Check
              : UserPlus
          }
          onClick={() =>
            handleFriendAction(
              isFriend
                ? FriendAction.REMOVE_FRIEND
                : friendStatus === FriendStatus.PENDING && isSender
                ? FriendAction.REMOVE_FRIEND
                : friendStatus === FriendStatus.PENDING && isReceiver === true
                ? FriendAction.ACCEPT_REQUEST
                : FriendAction.SEND_REQUEST,
            )
          }
          isLoading={isLoading}
          className={cn('min-w-[198px]', {
            'hover:border-none hover:bg-red-600 hover:shadow-red': isFriend,
            'hover:bg-red-600 hover:shadow-red':
              friendStatus === FriendStatus.PENDING && isSender && !isReceiver,
          })}
        >
          {isFriend
            ? 'Amigos'
            : friendStatus === FriendStatus.PENDING && !isSender && !!isReceiver
            ? 'Solicitação recebida'
            : friendStatus === FriendStatus.PENDING && !!isSender && !isReceiver
            ? 'Solicitação enviada'
            : 'Enviar solicitação'}
        </Button>
      }
    >
      <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
        {(user.schedulePrivate === true &&
          friendStatus === FriendStatus.ACCEPTED) ||
        user.schedulePrivate === false ||
        isFriend === true ? (
          <ScheduleForm {...userLoggedIn} />
        ) : (
          <div className="my-4 flex flex-1 flex-col items-center justify-center gap-2">
            <Heading size="lg">Ops!</Heading>
            <Text className="text-center">
              Essa é uma agenda privada, para visualizar envie uma solicitação
              de amizade para {user?.name} clicando no botão acima. ☝
            </Text>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = String(context.params?.username)
  const session = await getSession(context)

  const userLoggedIn = session?.user

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  if (user.username === userLoggedIn?.username) {
    return {
      redirect: {
        destination: `/dashboard/${userLoggedIn.username}`,
        permanent: false,
      },
    }
  }

  const friend = await prisma.friend.findFirst({
    where: {
      OR: [
        { user_id: userLoggedIn?.id, friend_id: user.id },
        { user_id: user.id, friend_id: userLoggedIn?.id },
      ],
    },
  })

  return {
    props: {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        schedulePrivate: user.schedule_private,
      },
      userLoggedIn: {
        id: userLoggedIn?.id,
        name: userLoggedIn?.name,
        email: userLoggedIn?.email,
      },
      friend: {
        id: friend ? friend?.id : '',
        userId: friend ? friend.user_id : '',
        friendId: friend ? friend.friend_id : '',
        status: friend ? friend.status : null,
      },
    },
  }
}
