import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import clsx from 'clsx'

import ScheduleForm from './ScheduleForm'
import { Header } from '@/components/schedule/Header'
import { Heading } from '@/components/ui/Heading'
import { Text } from '@/components/ui/Text'

import { prisma } from '@/lib/prisma'

import { api } from '@/lib/axios'
import { FriendStatus } from '@prisma/client'

interface ScheduleProps {
  user: {
    id: string
    name: string
    bio: string
    avatarUrl: string
    schedulePrivate: boolean
  }
  userLoggedIn: {
    id: string
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
  const [friendlyStatus, setFriendlyStatus] = useState<FriendStatus | null>(
    friend.status,
  )
  const [asFriend, setAsFriend] = useState(false)

  useEffect(() => {
    friendlyStatus === 'accepted' ? setAsFriend(true) : setAsFriend(false)
  }, [asFriend, friendlyStatus])

  async function handleSendFriendRequest() {
    try {
      const response = await api.post('/users/friend-request/create', {
        friendId: user.id,
      })

      if (response.status === 201) {
        setFriendlyStatus('pending')
      }
    } catch (error) {
      console.log('ERROR | Error sending friend request.')
    }
  }

  async function handleRemoveFriendRequest() {
    try {
      const response = await api.delete(
        `/users/friend-request/delete?userLoggedId=${userLoggedIn.id}&friendId=${user.id}`,
      )

      if (response.status === 200) {
        setFriendlyStatus(null)
      }
    } catch (error) {
      console.log('ERROR | Error remove friend request.')
    }
  }

  async function handleUpdateFriendRequest() {
    try {
      const response = await api.put(`/users/friend-request/update`, {
        friendId: user.id,
        action: 'accept',
      })

      if (response.status === 200) {
        setFriendlyStatus('accepted')
      }
    } catch (error) {
      console.log('ERROR | Error remove friend request.')
    }
  }

  return (
    <div className="mx-auto mb-4 mt-20 flex max-w-[852px] flex-col gap-6 px-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Header user={user} />

        <button
          onClick={
            friendlyStatus === 'pending' &&
            (friend.friendId === userLoggedIn.id ||
              friend.userId === userLoggedIn.id)
              ? handleUpdateFriendRequest
              : ((friendlyStatus === 'pending' ||
                  friendlyStatus === 'accepted') &&
                  friend.userId === userLoggedIn.id) ||
                friend.friendId === userLoggedIn.id
              ? handleRemoveFriendRequest
              : handleSendFriendRequest
          }
          className={clsx(
            'h-12 min-w-[198px] items-center justify-center gap-2 rounded-md bg-violet-500 font-medium text-zinc-50 transition-all disabled:pointer-events-none disabled:bg-zinc-600/70',
            friendlyStatus === 'accepted'
              ? "border border-zinc-700 bg-zinc-900 after:content-['Amigos'] hover:border-none hover:bg-red-600 hover:shadow-red hover:after:content-['Remover_amizade']"
              : friendlyStatus === 'pending' &&
                friend.userId === userLoggedIn.id
              ? "after:content-['Solicitação_enviada'] hover:bg-red-600 hover:shadow-red hover:after:content-['Cancelar_envio']"
              : friendlyStatus === 'pending' &&
                friend.friendId === userLoggedIn.id
              ? "after:content-['Solicitação_recebida'] hover:after:content-['Aceitar_solicitação']"
              : "after:content-['Enviar_solicitação'] hover:bg-violet-600 hover:shadow-violet",
          )}
        />
      </div>

      {(user.schedulePrivate === true && friendlyStatus === 'accepted') ||
      user.schedulePrivate === false ||
      asFriend === true ? (
        <ScheduleForm />
      ) : (
        <div className="my-4 flex flex-1 flex-col items-center justify-center gap-2">
          <Heading size="lg">Ops!</Heading>
          <Text className="text-center">
            Essa é uma agenda privada, para visualizar envie uma solicitação de
            amizade para {user.name} clicando no botão acima. ☝
          </Text>
        </div>
      )}
    </div>
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
        bio: user.bio,
        avatarUrl: user.avatar_url,
        schedulePrivate: user.schedule_private,
      },
      userLoggedIn: {
        id: userLoggedIn?.id,
      },
      friend: {
        id: friend ? friend?.id : '',
        userId: friend ? friend?.user_id : '',
        friendId: friend ? friend?.friend_id : '',
        status: friend ? friend.status : 'rejected',
      },
    },
  }
}
